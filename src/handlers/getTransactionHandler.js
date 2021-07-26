const transactionService = require("../services/transactions");

const paramsJsonSchema = {
  type: 'object',
  required: ["user_id, hash"],
  properties: {
    user_id: { type: 'string' },
    hash: { type: 'string' }
  }
}

function schema() {
  return {
    params: paramsJsonSchema
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const walletData = await walletService.getWalletData(req.params.user_id);
    const body = await transactionService.getTransaction(walletData.address, req.params.hash);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
