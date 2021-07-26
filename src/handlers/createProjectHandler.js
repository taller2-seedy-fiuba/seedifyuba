const bodyJsonSchema = {
  type: 'object',
  required: ["ownerId", "reviewerId", "stagesCost"],
  properties: {
    ownerId: {
      type: "string",
    },
    reviewerId: {
      type: "string",
    },
    stagesCost: {
      type: "array",
      minItems: 1,
      Items: { type: "number" },
    }
  }
}

function schema() {
  return {
    body: bodyJsonSchema
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const walletDeployer = walletService.getDeployerWallet();
    const stagesCost = req.body.stagesCost;
    const ownerWalletData = walletService.getWalletData(req.body.ownerId);
    const reviewerWalletData = walletService.getWalletData(req.body.reviewerId);
    await walletDeployer;
    await ownerWalletData;
    await reviewerWalletData;
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
