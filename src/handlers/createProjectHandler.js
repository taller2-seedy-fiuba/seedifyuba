function schema() {
  return {
    params: {
      type: "object",
      properties: {
        ownerId: {
          type: "integer",
        },
        reviewerId: {
          type: "integer",
        },
        stagesCost: {
          type: "array",
          minItems: 1,
          Items: { type: "number" },
        },
      },
    },
    required: ["ownerId", "reviewerId", "stagesCost"],
  };
}

function handler({ contractInteraction, walletService }) {
  console.log('Handling request to create project');
  return async function (req) {
    let walletDeployer = await walletService.getDeployerWallet();
    let stagesCost = req.body.stagesCost;
    let ownerWalletData = await walletService.getWalletData(req.body.ownerId);
    let reviewerWalletData = await walletService.getWalletData(req.body.ownerId);
    return contractInteraction.createProject(
      walletDeployer,
      stagesCost,
      ownerWalletData.address,
      reviewerWalletData.address,
    );
  };
}

module.exports = { schema, handler };
