function schema() {
  return {
    params: {
      type: "object",
      properties: {
        id: {
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
    const walletId = req.params.id;
    const amount = req.body.amount;
    const chargeTx = await walletService.chargeWallet(walletId, amount)
    return reply.code(202).send(chargeTx);
  };
}

module.exports = { schema, handler };
