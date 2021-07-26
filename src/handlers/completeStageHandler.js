const paramsJsonSchema = {
  type: 'object',
  properties: {
    hash: { type: 'string' }
  }
}

const bodyJsonSchema = {
  type: "object",
  required: ["reviewer_id", "stage_completed"],
  properties: {
    reviewer_id: {
      type: "string",
    },
    stage_completed: {
      type: "integer",
    }
  }
}

function schema() {
  return {
    params: paramsJsonSchema,
    body: bodyJsonSchema
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const projectHash = req.params.hash;
    const project = contractInteraction.getProject(projectHash);
    const reviewerWallet = walletService.getWallet(req.body.reviewer_id);
    const stageCompleted = req.body.stage_completed;
    await project;
    await reviewerWallet;
    const fundProjectTx = await contractInteraction.setCompletedStageOfProject(reviewerWallet, project.id, stageCompleted);
    return reply.code(202).send(fundProjectTx);
  };
}

module.exports = { schema, handler };
