const queries = require('./queries');

const PROJECTS_TABLE = 'PROJECTS';

const SELECT = 'SELECT id, hash, owner_id ' + PROJECTS_TABLE;

const SELECT_BY_ID = SELECT + ' WHERE id = $1';

const INSERT =
  'INSERT INTO ' +
  PROJECTS_TABLE +
  ' (id, hash, owner_id) VALUES ($1, $2, $3)';

const insert = (project) => {
  return new Promise((resolve, reject) => {
    queries.executeQueryWithParams(INSERT, [
      project.projectId,
      project.hash,
      project.projectOwnerAddress
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
