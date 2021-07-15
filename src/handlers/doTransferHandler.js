function schema() {
  return {
    params: {
      type: "object",
      properties: {
        sender_id: {
          type: "string",
        },
        receiver_id: {
          type: "string",
        },
        amount: {
          type: "integer"
        }
      },
    },
    required: ["sender_id", "receiver_id", "amount"],
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const amount = req.body.amount;
    const senderWalletData = await walletService.getWallet(req.body.sender_id);
    const receiverWalletData = await walletService.getWallet(req.body.receiver_id);
    const transferTx = await walletService.transfer(senderWalletData, receiverWalletData, amount);
    return reply.code(202).send(transferTx);
  };
}

module.exports = { schema, handler };
