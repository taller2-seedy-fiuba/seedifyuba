const transactionService = require("../services/transactions");

const paramsJsonSchema = {
  type: 'object',
  required: ["user_id", "hash"],
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
    if(!walletData) reply.code(404).send({
      status: 'FAILURE',
      code: 'WALLET_NOT_FOUND',
      message: 'Wallet of user with id [' +req.body.sender_id+ '] not found',
      statusCode: 404
    });
    const body = await transactionService.getTransaction(walletData.address, req.params.hash);
    if(!body) reply.code(404).send({
      status: 'FAILURE',
      code: 'TRANSACTION_NOT_FOUND',
      message: 'Transaction of user ['+req.params.user_id+'] with hash [' +req.params.hash+ '] not found',
      statusCode: 404
    });
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
