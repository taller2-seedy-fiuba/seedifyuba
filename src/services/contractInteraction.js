const ethers = require("ethers");
const projectDao = require('../db/project-dao');
const stageDao = require('../db/stage-dao');
const reviewDao = require('../db/review-dao');
const calculations = require('./calculations');

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

const createProject = ({ config }) => async (
  deployerWallet,
  stagesCost,
  projectOwnerAddress,
  projectReviewerAddress,
) => {
  console.log("Creating project with costs {"+stagesCost+"}, owner address ["+projectOwnerAddress+"] and reviewer address ["+projectReviewerAddress+"]");
  const seedyFiuba = await getContract(config, deployerWallet);
  const totalAmountNeeded = stagesCost.reduce((accumulator, current) => {
    return accumulator + current;
  });
  console.log('Total Amount Needed ['+totalAmountNeeded+']');
  const costs = stagesCost.map(calculations.fromMilliToEther).map(calculations.toWei);
  console.log('Final Costs [' + costs +']');
  const tx = await seedyFiuba.createProject(costs, projectOwnerAddress, projectReviewerAddress);
  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);
    if (firstEvent && firstEvent.event == "ProjectCreated") {
      const projectId = firstEvent.args.projectId.toNumber();
      console.log("project id ["+projectId+"]");
      seedyFiuba.projects(projectId)
        .then(projectSC => {
          const project = {
            projectId: projectId,
            hash: tx.hash,
            projectOwnerAddress: projectOwnerAddress,
            projectReviewerAddress: projectReviewerAddress,
            stagesCost: stagesCost,
            state: projectSC.state,
            currentStage: projectSC.currentStage.toNumber(),
            totalAmountNeeded: totalAmountNeeded,
            missingAmount: totalAmountNeeded
          }
          addProject(project);
        });
    } else {
      console.error(`Project not created in tx ${tx.hash}`);
    }
  });
  return tx;
};

const addProject = (project) => {
  console.log("Saving project into database");
  projectDao.insert(project).then(projectCreated => {
    let number = 1;
    project.stagesCost.forEach(stageCost => {
      stageDao.insert({
        projectId: project.projectId,
        number: number,
        cost: stageCost
      }).then(reviewer =>{
        //Nothing to do
      });
      number = number + 1;
    });
    reviewDao.insert(project).then(reviewer =>{
      //Nothing to do
    });
  });
}

const getProject = () => async hash => {
  console.log('Getting project with hash ['+hash+']');
  let project = await projectDao.selectByHash(hash);
  return project;
};

const updateProject = (updates) => {
  console.log("Saving updates into database");
  console.dir(updates);
  //TODO
}

const fundProject = ({ config }) => async (funderWallet, projectId, founds) =>{
  console.log('Funding project with id ['+projectId+'] by address ['+funderWallet.address+']');
  const seedyFiuba = await getContract(config, funderWallet);
  console.dir(seedyFiuba);
  const weisFunds = calculations.toWei(calculations.fromMilliToEther(founds));
  console.log('Weis funds ['+weisFunds+']');
  const tx = await seedyFiuba.fund(projectId, {value: weisFunds});
  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);
    if (firstEvent && firstEvent.event == "ProjectFunded") {
      const projectId = firstEvent.args.projectId.toNumber();
      const funderAddress = firstEvent.args.funder.toString();
      const funds = firstEvent.args.funds.toNumber();
      console.log('Project with id ['+projectId+'] was funded with ['+funds+'] by ['+funderAddress+']');
      const projectSC = seedyFiuba.projects(projectId);
      const updates = {
        projectId: projectId,
        state: projectSC.state,
        currentStage: projectSC.currentStage,
        missingAmount: projectSC.missingAmount
      }
      updateProject(updates);
    } else {
      console.error(`Project not funded in tx ${tx.hash}`);
    }
  });
  return tx;
}

const setCompletedStageOfProject = ({ config }) => async (reviewerWallet, projectId, completedStage) =>{
  console.log('Completed stage ['+completedStage+'] of project with id ['+projectId+']');
  const seedyFiuba = await getContract(config, reviewerWallet);
  const tx = await seedyFiuba.setCompletedStage(projectId, completedStage);
  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    const secondEvent = receipt && receipt.events && receipt.events[1];
    console.log(firstEvent);
    console.log(secondEvent);
    if (firstEvent && firstEvent.event == "StageCompleted") {
      const projectId = firstEvent.args.projectId.toNumber();
      const stagedCompleted = firstEvent.args.stageCompleted.toNumber();
      console.log('Staged ['+stagedCompleted+'] completed in project with id ['+projectId+']');
    } else {
      console.error(`Stage not completed in tx ${tx.hash}`);
    }
    if (secondEvent && secondEvent.event == "ProjectCompleted") {
      const projectId = firstEvent.args.projectId.toNumber();
      console.log('Project with id ['+projectId+'] is completed');
    }
  });
  return tx;
}

module.exports = dependencies => ({
  createProject: createProject(dependencies),
  getProject: getProject(dependencies),
  fundProject: fundProject(dependencies),
  setCompletedStageOfProject: setCompletedStageOfProject(dependencies)
});
