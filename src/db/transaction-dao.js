const queries = require('./queries');
const adapter = require('./result-adapter');

const TRANSACTIONS_TABLE = 'TRANSACTIONS';

const SELECT = 'SELECT hash, status, message, address, project_id, timestamp FROM ' + TRANSACTIONS_TABLE;

const SELECT_BY_HASH = SELECT + ' WHERE hash = $1';

const SELECT_BY_USER = SELECT + ' WHERE address = $1 ORDER BY timestamp LIMIT $2 OFFSET $3';

const INSERT =
  'INSERT INTO ' +
  TRANSACTIONS_TABLE +
  ' (hash, status, message, address, project_id, timestamp) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

const insert = (tx) => {
  return new Promise((resolve, reject) => {
    queries.executeQueryWithParams(INSERT, [
      tx.hash,
      tx.status,
      tx.message,
      tx.userId,
      tx.projectId,
      tx.timestamp
    ])
      .then((results) => {
        resolve(adapter.adaptTx(results));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const select = () => {
  return new Promise((resolve, reject) => {
    queries.executeQueryWithParams(SELECT, [
    ])
      .then((results) => {
        resolve(adapter.adaptTxs(results));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const selectByUser = (address, limit, offset) => {
  return new Promise((resolve, reject) => {
    queries.executeQueryWithParams(SELECT_BY_USER, [
      address,
      limit,
      offset
    ])
      .then((results) => {
        resolve(adapter.adaptTxs(results));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const selectByHash = (hash) => {
  return new Promise((resolve, reject) => {
    queries.executeQueryWithParams(SELECT_BY_HASH, [hash
    ])
      .then((results) => {
        resolve(adapter.adaptTx(results));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { insert, select, selectByHash, selectByUser };
