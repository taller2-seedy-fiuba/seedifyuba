function schema() {
  return {
    params: {
      type: "object",
      properties: {
        projectId: {
          type: "integer",
        },
        reviewerId: {
          type: "string",
        },
        stageCompleted: {
          type: "integer",
        }
      },
    },
    required: ["projectId", "reviewerId"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const deployerWallet = await walletService.getDeployerWallet();
    const projectId = req.body.projectId;
    const reviewerAddress = await walletService.getWalletData(req.body.reviewerId);
    const stageCompleted = await walletService.getWalletData(req.body.stageCompleted);
    const fundProjectTx = contractInteraction.setCompletedStageOfProject(deployerWallet, projectId, reviewerAddress.address, stageCompleted);
    return reply.code(202).send(fundProjectTx);
  };
}

module.exports = { schema, handler };
