const paramsJsonSchema = {
  type: "object",
  properties: {
    user_id: { type: "string" },
  },
};

function schema() {
  return {
    params: paramsJsonSchema,
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const body = await walletService.getWalletData(req.params.user_id);
    if (!body)
      reply.code(404).send({
        status: "FAILURE",
        code: "WALLET_NOT_FOUND",
        message: "Wallet of user with id [" + req.params.user_id + "] not found",
        statusCode: 404,
      });
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
