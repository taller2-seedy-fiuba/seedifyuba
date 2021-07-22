const transactionDao = require('../db/transaction-dao');

const getTransactions = () => async (userId, page, pageSize) => {
  console.log("Getting Transactions with userID ["+userId+"] page ["+page+"] and page size ["+pageSize+"]");
  const limit = pageSize;
  const offset = (page && page > 0) ? (page - 1) * pageSize : 0;
  let transactions = await transactionDao.selectByUser(userId, limit, offset);
  return transactions;
};

const logTransaction = () => async (hash, status, userId, projectId, message) => {
  console.log("Transaction with hash ["+hash+"] status ["+status+"] userID ["+userId+"] projectId ["+projectId+"] message ["+message+"]");
  const tx ={
    hash: hash,
    status: status,
    userId: userId,
    projectId: projectId,
    message: message,
    timestamp: new Date()
  }
  await transactionDao.insert(tx);
}

module.exports = ({ config }) => ({
  getTransactions: getTransactions({ config }),
  logTransaction: logTransaction({ config })
});
