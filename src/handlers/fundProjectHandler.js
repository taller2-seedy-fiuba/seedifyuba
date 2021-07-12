function schema() {
  return {
    params: {
      type: "object",
      properties: {
        projectId: {
          type: "integer",
        },
        funderId: {
          type: "string",
        }
      },
    },
    required: ["projectId", "funderId"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const projectId = req.body.projectId;
    const funderWallet = await walletService.getWallet(req.body.funderId);
    const fundProjectTx = contractInteraction.fund(funderWallet, projectId)
    return reply.code(202).send(fundProjectTx);
  };
}

module.exports = { schema, handler };
