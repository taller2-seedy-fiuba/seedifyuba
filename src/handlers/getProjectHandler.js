const queryStringJsonSchema = {
  type: 'object',
  properties: {
    source: { type: 'string' }
  }
}

const paramsJsonSchema = {
  type: 'object',
  properties: {
    hash: { type: 'string' }
  }
}

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
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
