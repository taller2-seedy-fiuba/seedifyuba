const paramsJsonSchema = {
  type: "object",
  properties: {
    user_id: { type: "string" },
  },
};

const bodyJsonSchema = {
  type: "object",
  required: ["amount"],
  properties: {
    amount: {
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

function handler({ walletService }) {
  return async function (req, reply) {
    const userId = req.params.user_id;
    const amount = req.body.amount;
    const chargeTx = await walletService.chargeWallet(userId, amount);
    return reply.code(200).send(chargeTx);
  };
}

module.exports = { schema, handler };
