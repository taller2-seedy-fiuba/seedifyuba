const calculations = require("./calculations");
const { projectState } = require("../model/project");

const adaptProjectFromSC = projectSC => {
  return {
    projectId: projectSC.projectId,
    state: adaptStateFromSC(projectSC.state),
    currentStage: projectSC.currentStage.toNumber(),
    missingAmount: calculations.fromEtherToMilli(calculations.fromWeiToEther(projectSC.missingAmount)),
    owner: projectSC.owner,
    reviewer: projectSC.reviewer,
  };
};

const adaptStateFromSC = state => {
  return stateMap[state];
};

const stateMap = {
  0: projectState.FUNDING,
  1: projectState.CANCELED,
  2: projectState.IN_PROGRESS,
  3: projectState.COMPLETED,
};

module.exports = { adaptProjectFromSC, adaptStateFromSC };
