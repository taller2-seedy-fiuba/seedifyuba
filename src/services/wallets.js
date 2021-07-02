const ethers = require("ethers");
const walletDao = require('../db/wallet-dao');

const getDeployerWallet = ({ config }) => () => {
  const provider = new ethers.providers.InfuraProvider(config.network, config.infuraApiKey);
  return ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
};

const createWallet = () => async () => {
  const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);
  const walletCreated = await walletDao.insert(wallet);
  const result = {
    id: walletCreated.id,
    address: walletCreated.address,
    privateKey: walletCreated.privateKey,
  };
  return result;
};

const getWalletsData = () => async () => {
  const wallets = await walletDao.select();
  return wallets;
};

const getWalletData = () => async id => {
  const wallet = await walletDao.selectById(id);
  return wallet;
};

const getWallet = ({}) => async id => {
  const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);
  const wallet = await walletDao.selectById(id);
  return new ethers.Wallet(wallet.privateKey, provider);
};

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWallet: getWallet({ config }),
});
