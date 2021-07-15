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

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const deployerWallet = await walletService.getDeployerWallet();
    const body = await contractInteraction.getProject(req.params.hash, req.query.source, deployerWallet);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
