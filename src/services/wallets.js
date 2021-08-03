const ethers = require("ethers");
const walletDao = require("../db/wallet-dao");
const calculations = require("./calculations");
const transactions = require("./transactions");
const { transactionMessage, transactionStatus, transactionFlow } = require("../model/transaction");

const getDeployerWallet = ({ config }) => async () => {
  console.log("Getting Deployer Wallet");
  const provider = new ethers.providers.InfuraProvider(config.network, config.infuraApiKey);
  return ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
};

const createWallet = () => async ownerId => {
  console.log("Creating Wallet for ownerId [" + ownerId + "]");
  const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);
  wallet.id = ownerId;
  const walletCreated = await walletDao.insert(wallet);
  const result = {
    id: walletCreated.id,
    address: walletCreated.address,
    privateKey: walletCreated.privateKey,
  };
  return result;
};

const getWalletsData = () => async () => {
  console.log("Getting Wallets Data");
  const wallets = await walletDao.select();
  return wallets;
};

const getWalletData = () => async id => {
  console.log("Getting Wallet Data with id [" + id + "]");
  const wallet = await walletDao.selectById(id);
  console.log("Wallet Data found");
  console.dir(wallet);
  return wallet;
};

const getWallet = ({}) => async id => {
  console.log("Getting Wallet with id [" + id + "]");
  const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);
  const walletData = await walletDao.selectById(id);
  console.log("Wallet Data found");
  console.dir(walletData);
  if (!walletData) return null;
  const wallet = new ethers.Wallet(walletData.privateKey, provider);
  wallet.balance = calculations.fromWeiToEther(await wallet.getBalance());
  return wallet;
};

const chargeWallet = ({ config }) => async (id, amount) => {
  console.log("Charging Wallet with id [" + id + "] and amount [" + amount + "] MiniEthers");
  const deployerWalletAction = await getDeployerWallet({ config });
  const walletAction = await getWallet({ config });
  const deployerWallet = await deployerWalletAction();
  const wallet = await walletAction(id);
  console.log("Amount [" + amount + "]");
  const amountInEthers = calculations.fromMilliToEther(amount);
  console.log("Amount In Ethers [" + amountInEthers + "]");
  const tx = {
    to: wallet.address,
    value: ethers.utils.parseEther(amountInEthers),
  };
  const sendPromise = deployerWallet.sendTransaction(tx);
  sendPromise.then(tx => {
    console.log("Wallet charged successfully");
    console.log(tx);
    transactions.logTransaction(
      tx.hash,
      transactionStatus.SUCCESS,
      deployerWallet.address,
      null,
      transactionMessage.AMOUNT_SENT,
      transactionFlow.OUT,
      amount
    );
    transactions.logTransaction(
      tx.hash,
      transactionStatus.SUCCESS,
      wallet.address,
      null,
      transactionMessage.AMOUNT_RECEIVED,
      transactionFlow.IN,
      amount
    );
    return {
      hast: tx.hash,
      status: transactionStatus.SUCCESS,
      address: wallet.address,
      project_id: null,
      message: transactionMessage.AMOUNT_RECEIVED,
      flow: transactionFlow.IN,
    };
  });
};

const transfer = ({ config }) => async (sender, receiverAddress, amount) => {
  console.log(
    "Transferring from [" + sender.address + "] to [" + receiverAddress + "] amount [" + amount + "] MiniEthers",
  );
  const amountInEthers = calculations.fromMilliToEther(amount);
  console.log("Amount In Ethers [" + amountInEthers + "]");
  const tx = {
    to: receiverAddress,
    value: ethers.utils.parseEther(amountInEthers),
  };
  const sendTx = await sender.sendTransaction(tx);
  console.log("Successful Transaction");
  console.log(sendTx);
  transactions.logTransaction(
    sendTx.hash,
    transactionStatus.SUCCESS,
    sender.address,
    null,
    transactionMessage.AMOUNT_SENT,
    transactionFlow.OUT,
    amount
  );
  transactions.logTransaction(
    sendTx.hash,
    transactionStatus.SUCCESS,
    receiverAddress,
    null,
    transactionMessage.AMOUNT_RECEIVED,
    transactionFlow.IN,
    amount
  );
  return {
    hast: sendTx.hash,
    status: transactionStatus.SUCCESS,
    address: sender.address,
    project_id: null,
    message: transactionMessage.AMOUNT_SENT,
    flow: transactionFlow.OUT,
  };
};

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWallet: getWallet({ config }),
  chargeWallet: chargeWallet({ config }),
  transfer: transfer({ config }),
});
