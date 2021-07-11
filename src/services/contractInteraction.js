const BigNumber = require("bignumber.js");
const ethers = require("ethers");
const projectDao = require('../db/project-dao');
const stageDao = require('../db/stage-dao');
const reviewDao = require('../db/review-dao');

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

const toWei = number => {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

const createProject = ({ config }) => async (
  deployerWallet,
  stagesCost,
  projectOwnerAddress,
  projectReviewerAddress,
) => {
  console.log("Creating project with costs {"+stagesCost+"}, owner address ["+projectOwnerAddress+"] and reviewer address ["+projectReviewerAddress+"]");
  const seedyFiuba = await getContract(config, deployerWallet);
  const tx = await seedyFiuba.createProject(stagesCost.map(toWei), projectOwnerAddress, projectReviewerAddress);
  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);
    if (firstEvent && firstEvent.event == "ProjectCreated") {
      const projectId = firstEvent.args.projectId.toNumber();
      console.log("project id ["+projectId+"]");
      const project = {
        projectId: projectId,
        hash: tx.hash,
        stagesCost: stagesCost,
        projectOwnerAddress: projectOwnerAddress,
        projectReviewerAddress: projectReviewerAddress
      }
      addProject(project);
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

const fundProject = ({ config }) => async (deployerWallet, projectId, funderAddress) =>{
  const seedyFiuba = await getContract(config, deployerWallet);
  const tx = await seedyFiuba.fund(projectId);
  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);
    if (firstEvent && firstEvent.event == "ProjectFunded") {
      const projectId = firstEvent.args.projectId.toNumber();
      const funderAddress = firstEvent.args.funder.toString();
      const funds = firstEvent.args.funds.toNumber();
      console.log('Project with id ['+projectId+'] was funded with ['+funds+'] by ['+funderAddress+']');
      const fundResult = {
        projectId: projectId,
        funderAddress: funderAddress,
        funds: funds
      }
    } else {
      console.error(`Project not funded in tx ${tx.hash}`);
    }
  });
  return tx;
}

module.exports = dependencies => ({
  createProject: createProject(dependencies),
  getProject: getProject(dependencies),
  fundProject: fundProject(dependencies)
});
