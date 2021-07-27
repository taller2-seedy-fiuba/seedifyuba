require("dotenv").config();
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 5000;
const network = "kovan";
const deployArtifact = require(`../deployments/${network}/Seedifyuba`);
const deployerMnemonic = process.env.MNEMONIC;
const infuraApiKey = process.env.INFURA_API_KEY;

console.log(deployerMnemonic);
module.exports = {
  host: host,
  port: port,
  contractAddress: deployArtifact.address,
  contractAbi: deployArtifact.abi,
  deployerMnemonic,
  infuraApiKey,
  network,
};
