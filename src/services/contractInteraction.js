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

const projects = {};

const createProject = ({ config }) => async (
  deployerWallet,
  stagesCost,
  projectOwnerAddress,
  projectReviewerAddress,
) => {
  console.log("Creating project with costs {"+stagesCost+"}, owner address ["+projectOwnerAddress+"] and reviewer address ["+projectReviewerAddress+"]");
  const bookBnb = await getContract(config, deployerWallet);
  const tx = await bookBnb.createProject(stagesCost.map(toWei), projectOwnerAddress, projectReviewerAddress);
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

const getProject = () => async id => {
  console.log(`Getting project ${id}: ${projects[id]}`);
  return projects[id];
};

module.exports = dependencies => ({
  createProject: createProject(dependencies),
  getProject: getProject(dependencies),
});
