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
    if(!project) reply.code(404).send({
      status: 'FAILURE',
      code: 'PROJECT_NOT_FOUND',
      message: 'Project with hash [' +projectHash+ '] not found',
      statusCode: 404
    });
    if(!ownerWallet) reply.code(404).send({
      status: 'FAILURE',
      code: 'WALLET_NOT_FOUND',
      message: 'Wallet of user with id [' +req.body.owner_id+ '] not found',
      statusCode: 404
    });
    const cancelProjectTx = await contractInteraction.cancelProject(ownerWallet, project.id);
    return reply.code(200).send(cancelProjectTx);
  };
}

module.exports = { schema, handler };
