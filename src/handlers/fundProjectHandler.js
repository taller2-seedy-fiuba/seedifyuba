const paramsJsonSchema = {
  type: "object",
  properties: {
    hash: { type: "string" },
  },
};

const bodyJsonSchema = {
  type: "object",
  required: ["funder_id", "funds"],
  properties: {
    funder_id: {
      type: "string",
    },
    funds: {
      type: "integer",
    },
  },
};

function schema() {
  return {
    params: paramsJsonSchema,
    body: bodyJsonSchema,
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const projectHash = req.params.hash;
    const funds = req.body.funds;
    const [project, funderWallet] = await Promise.all([
      contractInteraction.getProject(projectHash),
      walletService.getWallet(req.body.funder_id),
    ]);
    if (!project)
      reply.code(404).send({
        status: "FAILURE",
        code: "PROJECT_NOT_FOUND",
        message: "Project with hash [" + projectHash + "] not found",
        statusCode: 404,
      });
    if (!funderWallet)
      reply.code(404).send({
        status: "FAILURE",
        code: "WALLET_NOT_FOUND",
        message: "Wallet of user with id [" + req.body.funder_id + "] not found",
        statusCode: 404,
      });
    const fundProjectTx = await contractInteraction.fundProject(funderWallet, project.id, funds);
    return reply.code(200).send(fundProjectTx);
  };
}

module.exports = { schema, handler };
