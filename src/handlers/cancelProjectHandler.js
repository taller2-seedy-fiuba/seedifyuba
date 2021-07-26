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
    const project = contractInteraction.getProject(projectHash);
    const ownerWallet = walletService.getWallet(req.body.owner_id);
    await project;
    await ownerWallet;
    const cancelProjectTx = await contractInteraction.cancelProject(ownerWallet, project.id);
    return reply.code(202).send(cancelProjectTx);
  };
}

module.exports = { schema, handler };
