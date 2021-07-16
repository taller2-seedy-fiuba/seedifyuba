const bodyJsonSchema = {
  type: "object",
  required: ["user_id"],
  properties: {
    user_id: {
      type: "string",
    },
  }
}

function schema() {
  return {
    body: bodyJsonSchema
  };
};

function handler({ walletService }) {
  return async function (req, reply) {
    const response = await walletService.createWallet(req.body.ownerId);
    return reply.code(201).send(response);
  };
}

module.exports = { handler, schema };
