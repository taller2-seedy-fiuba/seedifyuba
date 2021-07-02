const adaptProject = () => (result, details) => {

}

const adaptProjects = () => (result, details) => {

}

const adaptWallet = () => (result) => {
  if(result.rows.length === 1){
    const walletDBO = result.rows[0];
    return convertWallet(walletDBO);
  }
  return null;
}

const adaptWallets = () => (result) => {
  let wallets = [];
  for (let i = 0; i < result.rows.length; i++) {
    wallets.push(convertWallet(result.rows[i]));
  }
  return wallets;
}

const convertWallet = () => (walletDBO) => {
  if(!walletDBO) return null;
  return {
    id: walletDBO['id'],
    address: walletDBO['address'],
    privateKey: walletDBO['private_key']
  }
}


