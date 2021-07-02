const queries = require('./queries');

const REVIEWS_TABLE = 'WALLETS';

const SELECT = 'SELECT project_id, reviewer_id ' + REVIEWS_TABLE;

const SELECT_BY_ID = SELECT + ' WHERE id = $1';

const INSERT =
  'INSERT INTO ' +
  REVIEWS_TABLE +
  ' (project_id, reviewer_id) VALUES ($1, $2)';

const insert = (project) => {
  return new Promise((resolve, reject) => {
    queries.executeQueryWithParams(INSERT, [
      project.id,
      project.projectReviewerAddress
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
        resolve(results);
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
        resolve(results);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { insert, select, selectById };
