const transactionService = require("../services/transactions");

const paramsJsonSchema = {
  type: 'object',
  required: ["hash"],
  properties: {
    hash: { type: 'string' }
  }
}

function schema() {
  return {
    params: paramsJsonSchema
  };
}

function handler() {
  return async function (req, reply) {
    const body = await transactionService.getTransaction(req.params.hash);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
