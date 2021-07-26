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
    const [project, ownerWallet] = await Promise.all([
      contractInteraction.getProject(projectHash),
      walletService.getWallet(req.body.owner_id)
    ]);
    const cancelProjectTx = await contractInteraction.cancelProject(ownerWallet, project.id);
    return reply.code(200).send(cancelProjectTx);
  };
}

module.exports = { schema, handler };
