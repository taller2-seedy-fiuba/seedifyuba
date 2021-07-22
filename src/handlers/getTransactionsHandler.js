const transactionService = require("../services/transactions");
const queryStringJsonSchema = {
  type: 'object',
  required: ["page", "page_size"],
  properties: {
    address: { type: 'string' },
    page: { type: 'number' },
    page_size: { type: 'number' }
  }
}

function schema() {
  return {
    querystring: queryStringJsonSchema
  };
}

function handler() {
  return async function (req, reply) {
    const body = await transactionService.getTransactions(req.query.address, req.query.page, req.query.page_size);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
