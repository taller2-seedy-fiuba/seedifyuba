const paramsJsonSchema = {
  type: 'object',
  properties: {
    user_id: { type: 'string' }
  }
}

function schema() {
  return {
    params: paramsJsonSchema
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const body = await walletService.getWalletData(req.params.user_id);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
