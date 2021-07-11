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
    const deployerWallet = await walletService.getDeployerWallet();
    const projectId = req.body.projectId;
    const funderWalletData = await walletService.getWalletData(req.body.funderId);
    const fundProjectTx = contractInteraction.fund(deployerWallet, projectId, funderWalletData.address)
    return reply.code(202).send(fundProjectTx);
  };
}

module.exports = { schema, handler };
