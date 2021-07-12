function schema() {
  return {
    params: {
      type: "object",
      properties: {
        hash: {
          type: "string",
        },
      },
    },
    required: ["hash"],
  };
}

function handler({ contractInteraction }) {
  return async function (req, reply) {
    const body = await contractInteraction.getProject(req.params.hash);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
