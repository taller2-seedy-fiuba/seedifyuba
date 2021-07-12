function schema() {
  return {
    params: {
      type: "object",
      properties: {
        hash: {
          type: "string",
        },
        reviewer_id: {
          type: "string",
        },
        stage_completed: {
          type: "integer",
        }
      },
    },
    required: ["hash", "reviewer_id", "stage_completed"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const projectId = req.params.id;
    const reviewerWallet = await walletService.getWallet(req.body.reviewer_id);
    const stageCompleted = req.body.stage_completed;
    const fundProjectTx = await contractInteraction.setCompletedStageOfProject(reviewerWallet, projectId, stageCompleted);
    return reply.code(202).send(fundProjectTx);
  };
}

module.exports = { schema, handler };
