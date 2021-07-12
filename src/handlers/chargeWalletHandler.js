function schema() {
  return {
    params: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
        },
        amount: {
          type: "integer",
        }
      },
    },
    required: ["projectId", "funderId"],
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const walletId = req.body.user_id;
    const chargeTx = await walletService.chargeWallet(walletId)
    return reply.code(202).send(chargeTx);
  };
}

module.exports = { schema, handler };
