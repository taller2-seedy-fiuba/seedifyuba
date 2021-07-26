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
    const stageCompleted = req.body.stage_completed;
    const [project, reviewerWallet] = await Promise.all([
      contractInteraction.getProject(projectHash),
      walletService.getWallet(req.body.reviewer_id)
    ]);
    const fundProjectTx = await contractInteraction.setCompletedStageOfProject(reviewerWallet, project.id, stageCompleted);
    return reply.code(200).send(fundProjectTx);
  };
}

module.exports = { schema, handler };
