function schema() {
  return {
    params: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        funder_id: {
          type: "string",
        }
      },
    },
    required: ["projectId", "funderId"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const projectId = req.params.id;
    const funderWallet = await walletService.getWallet(req.body.funder_id);
    const fundProjectTx = await contractInteraction.fundProject(funderWallet, projectId)
    return reply.code(202).send(fundProjectTx);
  };
}

module.exports = { schema, handler };
