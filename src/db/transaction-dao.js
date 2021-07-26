const queries = require('./queries');
const adapter = require('./result-adapter');

const TRANSACTIONS_TABLE = 'TRANSACTIONS';

const SELECT = 'SELECT hash, status, message, address, project_id, timestamp, flow FROM ' + TRANSACTIONS_TABLE;

const SELECT_BY_ADDRESS = SELECT + ' WHERE address = $1 ORDER BY timestamp LIMIT $2 OFFSET $3';

const SELECT_BY_ADDRESS_HASH = SELECT + ' WHERE address = $1 AND hash = $2';

const INSERT =
  'INSERT INTO ' +
  TRANSACTIONS_TABLE +
  ' (hash, status, message, address, project_id, timestamp, flow) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

const insert = (tx) => {
  return new Promise((resolve, reject) => {
    queries.executeQueryWithParams(INSERT, [
      tx.hash,
      tx.status,
      tx.message,
      tx.address,
      tx.projectId,
      tx.timestamp,
      tx.flow
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

const selectByAddress = (address, limit, offset) => {
  return new Promise((resolve, reject) => {
    queries.executeQueryWithParams(SELECT_BY_ADDRESS, [
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

const selectByAddressAndHash = (address, hash) => {
  return new Promise((resolve, reject) => {
    queries.executeQueryWithParams(SELECT_BY_ADDRESS_HASH, [
      address,
      hash
    ])
      .then((results) => {
        resolve(adapter.adaptTx(results));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { insert, select, selectByAddressAndHash, selectByAddress };
