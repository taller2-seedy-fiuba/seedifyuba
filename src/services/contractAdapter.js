const adaptProjectFromSC = projectSC => {
  return {
    projectId: projectSC.projectId,
    state: adaptStateFromSC(projectSC.state),
    currentStage: projectSC.currentStage.toNumber(),
    missingAmount: projectSC.missingAmount,
    owner: projectSC.owner,
    reviewer: projectSC.reviewer
  }
}

const adaptStateFromSC = state => {
  return stateMap[state];
}

const stateMap = {
  '0': 'FUNDING',
  '1': 'CANCELED',
  '2': 'IN_PROGRESS',
  '3': 'COMPLETED'
}

module.exports = {adaptProjectFromSC, adaptStateFromSC}
