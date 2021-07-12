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
  return async function (req, reply) {
    const walletDeployer = await walletService.getDeployerWallet();
    const stagesCost = req.body.stagesCost;
    const ownerWalletData = await walletService.getWalletData(req.body.ownerId);
    const reviewerWalletData = await walletService.getWalletData(req.body.ownerId);
    const createProjectTx = await contractInteraction.createProject(
      walletDeployer,
      stagesCost,
      ownerWalletData.address,
      reviewerWalletData.address,
    );
    return reply.code(202).send(createProjectTx);
  };
}

module.exports = { schema, handler };
