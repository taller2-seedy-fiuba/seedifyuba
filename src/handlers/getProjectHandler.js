const queryStringJsonSchema = {
  type: "object",
  properties: {
    source: { type: "string" },
  },
};

const paramsJsonSchema = {
  type: "object",
  properties: {
    hash: { type: "string" },
  },
};

function schema() {
  return {
    querystring: queryStringJsonSchema,
    params: paramsJsonSchema,
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const deployerWallet = await walletService.getDeployerWallet();
    const body = await contractInteraction.getProject(req.params.hash, req.query.source, deployerWallet);
    if (!body)
      reply.code(404).send({
        status: "FAILURE",
        code: "PROJECT_NOT_FOUND",
        message: "Project with hash [" + req.params.hash + "] not found",
        statusCode: 404,
      });
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
