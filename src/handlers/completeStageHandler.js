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
    const projectId = req.body.projectId;
    const reviewerWallet = await walletService.getWallet(req.body.reviewerId);
    const stageCompleted = req.body.stageCompleted;
    const fundProjectTx = contractInteraction.setCompletedStageOfProject(reviewerWallet, projectId, stageCompleted);
    return reply.code(202).send(fundProjectTx);
  };
}

module.exports = { schema, handler };
