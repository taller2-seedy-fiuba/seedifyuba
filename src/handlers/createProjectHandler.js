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
    const stagesCost = req.body.stagesCost;
    const [walletDeployer, ownerWalletData, reviewerWalletData] = await Promise.all([
      walletService.getDeployerWallet(),
      walletService.getWalletData(req.body.ownerId),
      walletService.getWalletData(req.body.reviewerId)
    ]);
    const createProjectTx = await contractInteraction.createProject(
      walletDeployer,
      stagesCost,
      ownerWalletData.address,
      reviewerWalletData.address,
    );
    return reply.code(200).send(createProjectTx);
  };
}

module.exports = { schema, handler };
