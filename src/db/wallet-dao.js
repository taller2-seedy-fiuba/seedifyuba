const queries = require('./queries');
const adapter = require('./result-adapter');

const WALLETS_TABLE = 'WALLETS';

const SELECT = 'SELECT id, address, private_key FROM ' + WALLETS_TABLE;

const SELECT_BY_ID = SELECT + ' WHERE id = $1';

const INSERT =
  'INSERT INTO ' +
  WALLETS_TABLE +
  ' (id, address, private_key) VALUES ($1, $2, $3)';

const insert = (wallet) => {
  return new Promise((resolve, reject) => {
    queries.executeQueryWithParams(INSERT, [
      wallet.id,
      wallet.address,
      wallet.privateKey
    ])
      .then((results) => {
        resolve(results);
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
        resolve(adapter.adaptWallets(results));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const selectById = (id) => {
  return new Promise((resolve, reject) => {
    queries.executeQueryWithParams(SELECT_BY_ID, [id
    ])
      .then((results) => {
        resolve(adapter.adaptWallet(results));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { insert, select, selectById };


