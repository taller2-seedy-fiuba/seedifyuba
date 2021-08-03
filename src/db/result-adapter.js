const adaptProject = result => {
  if (result.rows.length === 1) {
    const projectDBO = result.rows[0];
    return convertProject(projectDBO);
  } else if (result.rows.length > 1) {
    const projectDBO = result.rows[0];
    const stagesCost = [];
    for (let i = 0; i < result.rows.length; i++) {
      stagesCost.push(result.rows[i]["cost"]);
    }
    projectDBO["stages_cost"] = stagesCost;
    return convertProject(projectDBO);
  }
  return null;
};

const adaptProjects = result => {
  let projects = [];
  for (let i = 0; i < result.rows.length; i++) {
    projects.push(convertProject(result.rows[i]));
  }
  return projects;
};

const convertProject = projectDBO => {
  if (!projectDBO) return null;
  return {
    id: projectDBO["id"],
    hash: projectDBO["hash"],
    projectOwnerAddress: projectDBO["owner_address"],
    projectReviewerAddress: projectDBO["reviewer_address"],
    stagesCost: projectDBO["stages_cost"],
    state: projectDBO["state"],
    currentStage: projectDBO["current_stage"],
    totalAmountNeeded: projectDBO["total_amount_needed"],
    missingAmount: projectDBO["missing_amount"],
  };
};

const adaptWallet = result => {
  if (result.rows.length === 1) {
    const walletDBO = result.rows[0];
    return convertWallet(walletDBO);
  }
  return null;
};

const adaptWallets = result => {
  let wallets = [];
  for (let i = 0; i < result.rows.length; i++) {
    wallets.push(convertWallet(result.rows[i]));
  }
  return wallets;
};

const convertWallet = walletDBO => {
  if (!walletDBO) return null;
  return {
    id: walletDBO["id"],
    address: walletDBO["address"],
    privateKey: walletDBO["private_key"],
  };
};

const convertTx = txDBO => {
  if (!txDBO) return null;
  return {
    hash: txDBO["hash"],
    status: txDBO["status"],
    message: txDBO["message"],
    address: txDBO["address"],
    project_id: txDBO["project_id"],
    timestamp: txDBO["timestamp"],
    flow: txDBO["flow"],
    amount: txDBO["amount"]
  };
};

const adaptTx = result => {
  if (result.rows.length === 1) {
    const walletDBO = result.rows[0];
    return convertTx(walletDBO);
  }
  return null;
};

const adaptTxs = result => {
  let txs = [];
  for (let i = 0; i < result.rows.length; i++) {
    txs.push(convertTx(result.rows[i]));
  }
  return txs;
};

module.exports = { adaptProject, adaptProjects, adaptWallet, adaptWallets, adaptTx, adaptTxs };
