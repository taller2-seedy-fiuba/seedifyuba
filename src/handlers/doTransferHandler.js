const bodyJsonSchema = {
  type: "object",
  required: ["sender_id", "receiver_address", "amount"],
  properties: {
    sender_id: {
      type: "string",
    },
    receiver_address: {
      type: "string",
    },
    amount: {
      type: "integer",
    },
  },
};

function schema() {
  return {
    body: bodyJsonSchema,
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const amount = req.body.amount;
    const senderWalletData = await walletService.getWallet(req.body.sender_id);
    if (!senderWalletData)
      reply.code(404).send({
        status: "FAILURE",
        code: "WALLET_NOT_FOUND",
        message: "Wallet of user with id [" + req.body.sender_id + "] not found",
        statusCode: 404,
      });
    const transferTx = await walletService.transfer(senderWalletData, req.body.receiver_address, amount);
    return reply.code(200).send(transferTx);
  };
}

module.exports = { schema, handler };
