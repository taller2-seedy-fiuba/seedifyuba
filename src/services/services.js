const walletService = require("./wallets");
const contractInteraction = require("./contractInteraction");
const transactionService = require("./transactions");

module.exports = ({ config }) => ({
  walletService: walletService({ config }),
  contractInteraction: contractInteraction({ config }),
  transactionService: transactionService
});
