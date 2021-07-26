const transactionService = require("../services/transactions");

const paramsJsonSchema = {
  type: 'object',
  required: ["user_id"],
  properties: {
    user_id: { type: 'string' }
  }
}

const queryStringJsonSchema = {
  type: 'object',
  required: ["page", "page_size"],
  properties: {
    page: { type: 'number' },
    page_size: { type: 'number' }
  }
}

function schema() {
  return {
    params: paramsJsonSchema,
    querystring: queryStringJsonSchema
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const walletData = await walletService.getWalletData(req.params.user_id);
    if(!walletData) reply.code(404).send({
      status: 'FAILURE',
      code: 'WALLET_NOT_FOUND',
      message: 'Wallet of user with id [' +req.params.user_id+ '] not found',
      statusCode: 404
    });
    const body = await transactionService.getTransactions(walletData.address, req.query.page, req.query.page_size);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
