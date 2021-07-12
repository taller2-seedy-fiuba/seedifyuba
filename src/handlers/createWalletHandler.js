function schema() {
  return {
    params: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
        },
      },
    },
    required: ["user_id"],
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const response = await walletService.createWallet(req.body.ownerId);
    return reply.code(201).send(response);
  };
}

module.exports = { handler, schema };
