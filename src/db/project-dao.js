const queries = require('./queries');

const PROJECTS_TABLE = 'PROJECTS AS P';
const STAGES_TABLE = 'STAGES AS S';
const REVIEWS_TABLE = 'REVIEWS AS R';

const SELECT = 'SELECT id, hash, owner_address ' + PROJECTS_TABLE;

const SELECT_BY_ID = SELECT + ' WHERE id = $1';

const INSERT =
  'INSERT INTO ' +
  PROJECTS_TABLE +
  ' (id, hash, owner_address) VALUES ($1, $2, $3)';

const SELECT_WITH_DETAILS =
  'SELECT P.id, P.hash, P.owner_address, S.project_id, S.number, S.cost, R.project_id, R.reviewer_address' +
  ' FROM ' +
  PROJECTS_TABLE +
  ' , ' +
  STAGES_TABLE +
  ' , ' +
  REVIEWS_TABLE +
  ' WHERE P.id = S.project_id AND P.id = R.project_id AND P.id = $1';

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

const selectById = (id, details) => {
  return new Promise((resolve, reject) => {
    let query = SELECT_BY_ID;
    if (details) query = SELECT_WITH_DETAILS;
    queries.executeQueryWithParams(query, [id
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
