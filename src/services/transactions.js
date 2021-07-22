const transactionDao = require('../db/transaction-dao');

const getTransactions = async (address, page, pageSize) => {
  console.log("Getting Transactions with address ["+address+"] page ["+page+"] and page size ["+pageSize+"]");
  const limit = pageSize;
  const offset = (page && page > 0) ? (page - 1) * pageSize : 0;
  let transactions = await transactionDao.selectByUser(address, limit, offset);
  return transactions;
};

const logTransaction = async (hash, status, address, projectId, message) => {
  console.log("Transaction with hash ["+hash+"] status ["+status+"] address ["+address+"] projectId ["+projectId+"] message ["+message+"]");
  const tx ={
    hash: hash,
    status: status,
    address: address,
    projectId: projectId,
    message: message,
    timestamp: new Date()
  }
  await transactionDao.insert(tx);
}

module.exports = { getTransactions, logTransaction }
