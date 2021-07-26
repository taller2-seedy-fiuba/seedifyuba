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
    const body = await transactionService.getTransactions(walletData.address, req.query.page, req.query.page_size);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
