const queries = require('./queries');
const adapter = require('./result-adapter');

const PROJECTS_TABLE = 'PROJECTS AS P';
const STAGES_TABLE = 'STAGES AS S';
const REVIEWS_TABLE = 'REVIEWS AS R';

const SELECT = 'SELECT id, hash, owner_address ' + PROJECTS_TABLE;

const SELECT_BY_ID =
  'SELECT P.id, P.hash, P.owner_address, S.project_id, S.number, S.cost, R.project_id, R.reviewer_address' +
  ' FROM ' +
  PROJECTS_TABLE +
  ' , ' +
  STAGES_TABLE +
  ' , ' +
  REVIEWS_TABLE +
  ' WHERE P.id = S.project_id AND P.id = R.project_id AND P.id = $1';

const INSERT =
  'INSERT INTO ' +
  PROJECTS_TABLE +
  ' (id, hash, owner_address) VALUES ($1, $2, $3) RETURNING *';

const insert = (project) => {
  return new Promise((resolve, reject) => {
    queries.executeQueryWithParams(INSERT, [
      project.projectId,
      project.hash,
      project.projectOwnerAddress
    ])
      .then((results) => {
        resolve(adapter.adaptProject(results));
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
        resolve(adapter.adaptProjects(results));
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
        resolve(adapter.adaptProject(results));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { insert, select, selectById };
