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
    const project = contractInteraction.getProject(projectHash);
    const funderWallet = walletService.getWallet(req.body.funder_id);
    const funds = req.body.funds;
    await project;
    await funderWallet;
    const fundProjectTx = await contractInteraction.fundProject(funderWallet, project.id, funds);
    return reply.code(202).send(fundProjectTx);
  };
}

module.exports = { schema, handler };
