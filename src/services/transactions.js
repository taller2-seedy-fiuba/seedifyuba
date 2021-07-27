const transactionDao = require("../db/transaction-dao");

const getTransactions = async (address, page, pageSize) => {
  console.log(
    "Getting Transactions with address [" + address + "] page [" + page + "] and page size [" + pageSize + "]",
  );
  const limit = pageSize;
  const offset = page && page > 0 ? (page - 1) * pageSize : 0;
  let transactions = await transactionDao.selectByAddress(address, limit, offset);
  return transactions;
};

const getTransaction = async (address, hash) => {
  console.log("Getting Transactions with address [" + address + "] hash [" + hash + "]");
  let transaction = await transactionDao.selectByAddressAndHash(address, hash);
  return transaction;
};

const logTransaction = async (hash, status, address, projectId, message, flow) => {
  console.log(
    "Transaction with hash [" +
      hash +
      "] status [" +
      status +
      "] address [" +
      address +
      "] projectId [" +
      projectId +
      "] message [" +
      message +
      "] flow [" +
      flow +
      "]",
  );
  const tx = {
    hash: hash,
    status: status,
    address: address,
    projectId: projectId,
    message: message,
    timestamp: new Date(),
    flow: flow,
  };
  await transactionDao.insert(tx);
};

module.exports = { getTransactions, getTransaction, logTransaction };
