const BigNumber = require("bignumber.js");

const fromMilliToEther = number => {
  const MILLIST_IN_UNIT = BigNumber(10).pow(-3);
  return BigNumber(number).times(MILLIST_IN_UNIT).toFixed();
};

const toWei = number => {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

const fromWeiToEther = bigNumber => {
  const ETHER_IN_WEIS = BigNumber(10).pow(-18);
  return BigNumber(bigNumber._hex).times(ETHER_IN_WEIS).toFixed();
};

const fromEtherToMilli = number => {
  const MILLIST_IN_UNIT = BigNumber(10).pow(3);
  return BigNumber(number).times(MILLIST_IN_UNIT).toNumber();
}


module.exports = {fromMilliToEther, toWei, fromWeiToEther, fromEtherToMilli}
