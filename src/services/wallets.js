const ethers = require("ethers");
const walletDao = require('../db/wallet-dao');
const calculations = require('./calculations');

const getDeployerWallet = ({ config }) => () => {
  console.log("Getting Deployer Wallet");
  const provider = new ethers.providers.InfuraProvider(config.network, config.infuraApiKey);
  return ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
};

const createWallet = () => async ownerId => {
  console.log("Creating Wallet for ownerId ["+ownerId+"]");
  const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);
  wallet.id = ownerId;
  let walletCreated = await walletDao.insert(wallet);
  const result = {
    id: walletCreated.id,
    address: walletCreated.address,
    privateKey: walletCreated.privateKey,
  };
  return result;
};

const getWalletsData = () => async () => {
  console.log("Getting Wallets Data");
  let wallets = await walletDao.select();
  return wallets;
};

const getWalletData = () => async id => {
  console.log("Getting Wallet Data with id ["+id+"]");
  let wallet = await walletDao.selectById(id);
  console.log("Wallet Data found");
  console.dir(wallet);
  return wallet;
};

const getWallet = ({}) => async id => {
  console.log("Getting Wallet with id ["+id+"]");
  const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);
  let wallet = await walletDao.selectById(id);
  console.log("Wallet found");
  console.dir(wallet);
  return new ethers.Wallet(wallet.privateKey, provider);
};

const chargeWallet = ({config}) => async (id, amount) => {
  console.log("Charging Wallet with id ["+id+"] and amount ["+amount+"]");
  const deployerWalletAction = await getDeployerWallet({config});
  const walletAction = await getWallet({config});
  const deployerWallet = await deployerWalletAction();
  const wallet = await walletAction(id);
  console.log('Amount ['+amount+']');
  const amountInEthers = calculations.fromMilliToEther(amount);
  console.log('Amount In Ethers ['+amountInEthers+']');
  const tx = {
    to: wallet.address,
    value:  ethers.utils.parseEther(amountInEthers)
  };
  const sendPromise = deployerWallet.sendTransaction(tx);
  sendPromise.then((tx) => {
    console.log('Wallet charged successfully')
    console.log(tx);
  });
}

const transfer = ({config}) => async (sender, receiver, amount) => {
  console.log('Transferring from ['+sender.address+'] to ['+receiver.address+'] amount ['+amount+']');
  const amountInEthers = calculations.fromMilliToEther(amount);
  console.log('Amount In Ethers ['+amountInEthers+']');
  const tx = {
    to: receiver.address,
    value:  ethers.utils.parseEther(amountInEthers)
  };
  const sendPromise = sender.sendTransaction(tx);
  sendPromise.then((tx) => {
    console.log('Successful Transaction');
    console.log(tx);
    return tx;
  });
}

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWallet: getWallet({ config }),
  chargeWallet: chargeWallet({ config }),
  transfer: transfer({ config })
});
