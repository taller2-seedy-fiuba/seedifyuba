const queries = require("./queries");

const STAGES_TABLE = "STAGES";

const SELECT = "SELECT project_id, number, cost " + STAGES_TABLE;

const SELECT_BY_ID = SELECT + " WHERE id = $1";

const INSERT = "INSERT INTO " + STAGES_TABLE + " (project_id, number, cost) VALUES ($1, $2, $3)";

const insert = stage => {
  return new Promise((resolve, reject) => {
    queries
      .executeQueryWithParams(INSERT, [stage.projectId, stage.number, stage.cost])
      .then(results => {
        resolve(results);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const select = () => {
  return new Promise((resolve, reject) => {
    queries
      .executeQueryWithParams(SELECT, [])
      .then(results => {
        resolve(results);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const selectById = id => {
  return new Promise((resolve, reject) => {
    queries
      .executeQueryWithParams(SELECT_BY_ID, [id])
      .then(results => {
        resolve(results);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = { insert, select, selectById };
