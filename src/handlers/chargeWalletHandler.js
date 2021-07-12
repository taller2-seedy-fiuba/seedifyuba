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
    required: ["user_id", "amount"],
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const userId = req.params.user_id;
    const amount = req.body.amount;
    const chargeTx = await walletService.chargeWallet(userId, amount);
    return reply.code(202).send(chargeTx);
  };
}

module.exports = { schema, handler };
