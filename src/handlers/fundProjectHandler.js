const paramsJsonSchema = {
  type: 'object',
  properties: {
    hash: { type: 'string' }
  }
}

const bodyJsonSchema = {
  type: "object",
  required: ["funder_id", "funds"],
  properties: {
    funder_id: {
      type: "string",
    },
    funds: {
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
    const funds = req.body.funds;
    const [project, funderWallet] = await Promise.all([
      contractInteraction.getProject(projectHash),
      walletService.getWallet(req.body.funder_id)
    ]);
    const fundProjectTx = await contractInteraction.fundProject(funderWallet, project.id, funds);
    return reply.code(200).send(fundProjectTx);
  };
}

module.exports = { schema, handler };
