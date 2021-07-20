const paramsJsonSchema = {
  type: 'object',
  properties: {
    hash: { type: 'string' }
  }
}

const bodyJsonSchema = {
  type: "object",
  required: ["owner_id"],
  properties: {
    owner_id: {
      type: "string",
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
    const project = await contractInteraction.getProject(projectHash);
    const ownerWallet = await walletService.getWallet(req.body.owner_id);
    const cancelProjectTx = await contractInteraction.setCompletedStageOfProject(ownerWallet, project.id);
    return reply.code(202).send(cancelProjectTx);
  };
}

module.exports = { schema, handler };
