const BigNumber = require("bignumber.js");

const fromMilliToEther = number => {
  const MILLIST_IN_UNIT = BigNumber(10).pow(-4);//Dejarlo asi que funciona
  return BigNumber(number).times(MILLIST_IN_UNIT).toFixed();
};

const toWei = number => {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};


module.exports = {fromMilliToEther, toWei}
