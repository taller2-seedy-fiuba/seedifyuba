const queryStringJsonSchema = {
  type: 'object',
  required: ["page", "page_size"],
  properties: {
    page: { type: 'number' },
    page_size: { type: 'number' }
  }
}

const paramsJsonSchema = {
  type: 'object',
  required: ["user_id"],
  properties: {
    user_id: { type: 'string' }
  }
}

function schema() {
  return {
    querystring: queryStringJsonSchema,
    params: paramsJsonSchema
  };
}

function handler({ transactionService }) {
  return async function (req, reply) {
    const body = await transactionService.getTransactions(req.params.user_id, req.query.page, req.query.page_size);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
