const ethers = require("ethers");
const projectDao = require("../db/project-dao");
const stageDao = require("../db/stage-dao");
const reviewDao = require("../db/review-dao");
const calculations = require("./calculations");
const contractAdapter = require("./contractAdapter");
const transactions = require("./transactions");
const { transactionMessage, transactionStatus, transactionFlow } = require("../model/transaction");
const getRevertReason = require("eth-revert-reason");

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

const createProject = ({ config }) => async (
  deployerWallet,
  stagesCost,
  projectOwnerAddress,
  projectReviewerAddress,
) => {
  console.log(
    "Creating project with costs {" +
      stagesCost +
      "}, owner address [" +
      projectOwnerAddress +
      "] and reviewer address [" +
      projectReviewerAddress +
      "]",
  );
  const seedyFiuba = await getContract(config, deployerWallet);
  const totalAmountNeeded = stagesCost.reduce((accumulator, current) => {
    return accumulator + current;
  });
  console.log("Total Amount Needed [" + totalAmountNeeded + "]");
  const costs = stagesCost.map(calculations.fromMilliToEther).map(calculations.toWei);
  console.log("Final Costs [" + costs + "]");
  const tx = await seedyFiuba.createProject(costs, projectOwnerAddress, projectReviewerAddress).catch(async err => {
    console.error("Failure run tx");
    console.error(err);
    throw err;
  });
  const receipt = await tx.wait(1).catch(async err => {
    console.error(`Receipt failure in tx ${tx.hash}`);
    console.error(err);
  });
  console.log("Transaction mined");
  console.log(tx);
  const firstEvent = receipt && receipt.events && receipt.events[0];
  console.log("First Event");
  console.log(firstEvent);
  if (firstEvent && firstEvent.event == "ProjectCreated") {
    const projectId = firstEvent.args.projectId.toNumber();
    console.log("project id [" + projectId + "] was created");
    const projectSC = await seedyFiuba.projects(projectId);
    const project = contractAdapter.adaptProjectFromSC(projectSC);
    const projectToAdd = {
      projectId: projectId,
      hash: tx.hash,
      projectOwnerAddress: projectOwnerAddress,
      projectReviewerAddress: projectReviewerAddress,
      stagesCost: stagesCost,
      state: project.state,
      currentStage: project.currentStage,
      totalAmountNeeded: totalAmountNeeded,
      missingAmount: totalAmountNeeded,
    };
    addProject(projectToAdd);
    transactions.logTransaction(
      tx.hash,
      transactionStatus.SUCCESS,
      deployerWallet.address,
      projectId,
      transactionMessage.PROJECT_CREATED,
      transactionFlow.OUT,
    );
    transactions.logTransaction(
      tx.hash,
      transactionStatus.SUCCESS,
      projectOwnerAddress,
      projectId,
      transactionMessage.PROJECT_CREATED,
      transactionFlow.OUT,
    );
    return {
      hast: tx.hash,
      status: transactionStatus.SUCCESS,
      address: projectOwnerAddress,
      project_id: projectId,
      message: transactionMessage.PROJECT_CREATED,
      flow: transactionFlow.OUT,
    };
  } else {
    const reason = await getRevertReason(tx.hash, config.network);
    console.error(`Project not created in tx ${tx.hash} with reason ${reason}`);
    const message = transactionMessage.PROJECT_NOT_CREATED + " - " + reason;
    transactions.logTransaction(
      tx.hash,
      transactionStatus.FAILURE,
      deployerWallet.address,
      null,
      message,
      transactionFlow.OUT,
    );
    transactions.logTransaction(
      tx.hash,
      transactionStatus.FAILURE,
      projectOwnerAddress,
      null,
      message,
      transactionFlow.OUT,
    );
    throw {
      status: "FAILURE",
      code: "PROJECT_NOT_CREATED",
      message: message,
      statusCode: 500,
    };
  }
};

const addProject = async project => {
  console.log("Saving project into database");
  projectDao.insert(project).then(projectCreated => {
    let number = 1;
    project.stagesCost.forEach(stageCost => {
      stageDao
        .insert({
          projectId: project.projectId,
          number: number,
          cost: stageCost,
        })
        .then(reviewer => {
          //Nothing to do
        });
      number = number + 1;
    });
    reviewDao.insert(project).then(reviewer => {
      //Nothing to do
    });
  });
};

const getProject = ({ config }) => async (hash, source, deployerWallet) => {
  console.log("Getting project with hash [" + hash + "] and source [" + source + "]");
  const project = await projectDao.selectByHash(hash);
  console.log("DB Project");
  console.dir(project);
  if (!source || source == "database") {
    return project;
  }
  if (project && source == "contract") {
    const seedyFiuba = await getContract(config, deployerWallet);
    const projectSC = await seedyFiuba.projects(project.id);
    console.log("SC Project");
    console.dir(projectSC);
    return contractAdapter.adaptProjectFromSC(projectSC);
  }
  return null;
};

const updateProject = async updates => {
  console.log("Saving updates into database");
  console.dir(updates);
  await projectDao.updateById(updates);
};

const fundProject = ({ config }) => async (funderWallet, projectId, founds) => {
  console.log("Funding project with id [" + projectId + "] by address [" + funderWallet.address + "]");
  const seedyFiuba = await getContract(config, funderWallet);
  const weisFunds = calculations.toWei(calculations.fromMilliToEther(founds));
  console.log("Weis funds [" + weisFunds + "]");
  const tx = await seedyFiuba.fund(projectId, { value: weisFunds }).catch(async err => {
    console.error("Failure run tx");
    console.error(err);
    throw err;
  });
  const receipt = await tx.wait(1).catch(async err => {
    console.error(`Receipt failure in tx ${tx.hash}`);
    console.error(err);
  });
  console.log("Transaction mined");
  console.log(tx);
  const firstEvent = receipt && receipt.events && receipt.events[0];
  console.log("First Event");
  console.log(firstEvent);
  if (firstEvent && firstEvent.event == "ProjectFunded") {
    const projectId = firstEvent.args.projectId.toNumber();
    const funderAddress = firstEvent.args.funder.toString();
    const funds = firstEvent.args.funds;
    console.log("Project with id [" + projectId + "] was funded with [" + funds + "] by [" + funderAddress + "]");
    const projectSC = await seedyFiuba.projects(projectId);
    const project = contractAdapter.adaptProjectFromSC(projectSC);
    const updates = {
      projectId: projectId,
      state: project.state,
      currentStage: project.currentStage,
      missingAmount: project.missingAmount,
    };
    updateProject(updates);
    transactions.logTransaction(
      tx.hash,
      transactionStatus.SUCCESS,
      funderWallet.address,
      projectId,
      transactionMessage.PROJECT_FUNDED,
      transactionFlow.OUT,
    );
    return {
      hast: tx.hash,
      status: transactionStatus.SUCCESS,
      address: funderWallet.address,
      project_id: projectId,
      message: transactionMessage.PROJECT_FUNDED,
      flow: transactionFlow.OUT,
    };
  } else {
    const reason = await getRevertReason(tx.hash, config.network);
    console.error(`Project not funded in tx ${tx.hash} with reason ${reason}`);
    const message = transactionMessage.PROJECT_NOT_FUNDED + " - " + reason;
    transactions.logTransaction(
      tx.hash,
      transactionStatus.FAILURE,
      funderWallet.address,
      projectId,
      message,
      transactionFlow.OUT,
    );
    throw {
      status: "FAILURE",
      code: "PROJECT_NOT_FUNDED",
      message: message,
      statusCode: 500,
    };
  }
};

const setCompletedStageOfProject = ({ config }) => async (reviewerWallet, projectId, completedStage) => {
  console.log("Completed stage [" + completedStage + "] of project with id [" + projectId + "]");
  const seedyFiuba = await getContract(config, reviewerWallet);
  const tx = await seedyFiuba.setCompletedStage(projectId, completedStage, { gasLimit: 100000 }).catch(async err => {
    console.error("Failure run tx");
    console.error(err);
    throw err;
  });
  const receipt = await tx.wait(1).catch(async err => {
    console.error(`Receipt failure in tx ${tx.hash}`);
    console.error(err);
  });
  console.log("Transaction mined");
  console.log(tx);
  const firstEvent = receipt && receipt.events && receipt.events[0];
  const secondEvent = receipt && receipt.events && receipt.events[1];
  console.log("First Event");
  console.log(firstEvent);
  console.log("Second Event");
  console.log(secondEvent);
  if (firstEvent && firstEvent.event == "StageCompleted") {
    const projectId = firstEvent.args.projectId.toNumber();
    const stageCompleted = firstEvent.args.stageCompleted.toNumber();
    console.log("Staged [" + stageCompleted + "] completed in project with id [" + projectId + "]");
    if (secondEvent && secondEvent.event == "ProjectCompleted") {
      const projectId = firstEvent.args.projectId.toNumber();
      console.log("Project with id [" + projectId + "] is completed");
    }
    const projectSC = await seedyFiuba.projects(projectId);
    const project = contractAdapter.adaptProjectFromSC(projectSC);
    const updates = {
      projectId: projectId,
      state: project.state,
      currentStage: project.currentStage,
      missingAmount: project.missingAmount,
    };
    updateProject(updates);
    transactions.logTransaction(
      tx.hash,
      transactionStatus.SUCCESS,
      reviewerWallet.address,
      projectId,
      transactionMessage.STAGE_COMPLETED,
      transactionFlow.OUT,
    );
    return {
      hast: tx.hash,
      status: transactionStatus.SUCCESS,
      address: reviewerWallet.address,
      project_id: projectId,
      message: transactionMessage.STAGE_COMPLETED,
      flow: transactionFlow.OUT,
    };
  } else {
    const reason = await getRevertReason(tx.hash, config.network);
    console.error(`Stage not completed in tx ${tx.hash} with reason ${reason}`);
    const message = transactionMessage.STAGE_NOT_COMPLETED + " - " + reason;
    transactions.logTransaction(
      tx.hash,
      transactionStatus.FAILURE,
      reviewerWallet.address,
      projectId,
      message,
      transactionFlow.OUT,
    );
    throw {
      status: "FAILURE",
      code: "STAGE_NOT_COMPLETED",
      message: message,
      statusCode: 500,
    };
  }
};

const cancelProject = ({ config }) => async (ownerWallet, projectId) => {
  console.log("Canceling project with ID [" + projectId + "]");
  const seedyFiuba = await getContract(config, ownerWallet);
  const tx = await seedyFiuba.cancelProject(projectId, { gasLimit: 100000 });
  const receipt = await tx.wait(1);
  console.log("Transaction mined");
  console.log(tx);
  const firstEvent = receipt && receipt.events && receipt.events[0];
  console.log("First Event");
  console.log(firstEvent);
  if (firstEvent && firstEvent.event == "ProjectCanceled") {
    const projectId = firstEvent.args.projectId.toNumber();
    console.log("project with id [" + projectId + "] was canceled");
    const projectSC = await seedyFiuba.projects(projectId);
    const project = contractAdapter.adaptProjectFromSC(projectSC);
    const updates = {
      projectId: projectId,
      state: project.state,
      currentStage: project.currentStage,
      missingAmount: project.missingAmount,
    };
    updateProject(updates);
    transactions.logTransaction(
      tx.hash,
      transactionStatus.SUCCESS,
      ownerWallet.address,
      projectId,
      transactionMessage.PROJECT_CANCELED,
      transactionFlow.OUT,
    );
    return {
      hast: tx.hash,
      status: transactionStatus.SUCCESS,
      address: ownerWallet.address,
      project_id: projectId,
      message: transactionMessage.PROJECT_CANCELED,
      flow: transactionFlow.OUT,
    };
  } else {
    const reason = await getRevertReason(tx.hash, config.network);
    console.error(`Project not canceled in tx ${tx.hash} with reason ${reason}`);
    const message = transactionMessage.PROJECT_NOT_CANCELED + " - " + reason;
    transactions.logTransaction(
      tx.hash,
      transactionStatus.FAILURE,
      ownerWallet.address,
      projectId,
      message,
      transactionFlow.OUT,
    );
    throw {
      status: "FAILURE",
      code: "PROJECT_NOT_CANCELED",
      message: message,
      statusCode: 500,
    };
  }
};

module.exports = dependencies => ({
  createProject: createProject(dependencies),
  getProject: getProject(dependencies),
  fundProject: fundProject(dependencies),
  setCompletedStageOfProject: setCompletedStageOfProject(dependencies),
  cancelProject: cancelProject(dependencies),
});
