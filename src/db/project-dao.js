const queries = require("./queries");
const adapter = require("./result-adapter");

const PROJECTS_TABLE = "PROJECTS AS P";
const STAGES_TABLE = "STAGES AS S";
const REVIEWS_TABLE = "REVIEWS AS R";

const SELECT =
  "SELECT P.id, P.hash, P.owner_address, P.state, P.current_stage, P.total_amount_needed, P.missing_amount " +
  PROJECTS_TABLE;

const SELECT_BY_ID =
  "SELECT P.id, P.hash, P.owner_address, P.state, P.current_stage, P.total_amount_needed, P.missing_amount, S.project_id, S.number, S.cost, R.project_id, R.reviewer_address" +
  " FROM " +
  PROJECTS_TABLE +
  " , " +
  STAGES_TABLE +
  " , " +
  REVIEWS_TABLE +
  " WHERE P.id = S.project_id AND P.id = R.project_id AND P.id = $1";

const SELECT_BY_HASH =
  "SELECT P.id, P.hash, P.owner_address, P.state, P.current_stage, P.total_amount_needed, P.missing_amount, S.project_id, S.number, S.cost, R.project_id, R.reviewer_address" +
  " FROM " +
  PROJECTS_TABLE +
  " , " +
  STAGES_TABLE +
  " , " +
  REVIEWS_TABLE +
  " WHERE P.id = S.project_id AND P.id = R.project_id AND P.hash = $1";

const INSERT =
  "INSERT INTO " +
  PROJECTS_TABLE +
  " (id, hash, owner_address, state, current_stage, total_amount_needed, missing_amount) VALUES ($1, $2, $3, $4, $5, $6, $7)";

const UPDATE_BY_ID =
  "UPDATE " + PROJECTS_TABLE + " SET state = $2, current_stage = $3, missing_amount = $4 WHERE id = $1";

const insert = project => {
  return new Promise((resolve, reject) => {
    queries
      .executeQueryWithParams(INSERT, [
        project.projectId,
        project.hash,
        project.projectOwnerAddress,
        project.state,
        project.currentStage,
        project.totalAmountNeeded,
        project.missingAmount,
      ])
      .then(results => {
        resolve();
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
        resolve(adapter.adaptProjects(results));
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
        resolve(adapter.adaptProject(results));
      })
      .catch(err => {
        reject(err);
      });
  });
};

const selectByHash = hash => {
  return new Promise((resolve, reject) => {
    queries
      .executeQueryWithParams(SELECT_BY_HASH, [hash])
      .then(results => {
        resolve(adapter.adaptProject(results));
      })
      .catch(err => {
        reject(err);
      });
  });
};

const updateById = updates => {
  return new Promise((resolve, reject) => {
    queries
      .executeQueryWithParams(UPDATE_BY_ID, [
        updates.projectId,
        updates.state,
        updates.currentStage,
        updates.missingAmount,
      ])
      .then(results => {
        resolve(adapter.adaptProject(results));
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = { insert, select, selectById, selectByHash, updateById };
