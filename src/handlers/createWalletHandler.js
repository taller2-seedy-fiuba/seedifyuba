function schema() {
  return {
    params: {
      type: "object",
      properties: {
        id: {
          type: "integer",
        },
      },
    },
    required: ["id"],
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const response = await walletService.createWallet(req.body.ownerId);
    return reply.code(201).send(response);
  };
}

module.exports = { handler, schema };
