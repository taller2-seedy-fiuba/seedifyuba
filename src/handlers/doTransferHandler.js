const bodyJsonSchema = {
  type: 'object',
  required: ["sender_id", "receiver_address", "amount"],
  properties: {
    sender_id: {
      type: "string",
    },
    receiver_address: {
      type: "string",
    },
    amount: {
      type: "integer"
    }
  }
}

function schema() {
  return {
    body: bodyJsonSchema
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const amount = req.body.amount;
    const senderWalletData = await walletService.getWallet(req.body.sender_id);
    const transferTx = await walletService.transfer(senderWalletData, req.body.receiver_address, amount);
    return reply.code(200).send(transferTx);
  };
}

module.exports = { schema, handler };
