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
  let walletCreated = {};
  walletDao.insert(wallet).then(walletDB => {
    walletCreated = walletDB
  });
  const result = {
    id: walletCreated.id,
    address: walletCreated.address,
    privateKey: walletCreated.privateKey,
  };
  return result;
};

const getWalletsData = () => async () => {
  let wallets = []
  walletDao.select().then(walletsDB => {
    wallets = walletsDB
  });
  console.dir(wallets);
  return wallets;
};

const getWalletData = () => async id => {
  let wallet;
  walletDao.selectById(id).then(walletDB => {
    wallet = walletDB;
  });
  return wallet;
};

const getWallet = ({}) => async id => {
  const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);
  let wallet;
  walletDao.selectById(id).then(walletDB => {
    wallet = walletDB;
  });
  return new ethers.Wallet(wallet.privateKey, provider);
};

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWallet: getWallet({ config }),
});
