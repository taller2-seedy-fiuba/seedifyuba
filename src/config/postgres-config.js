const app = require("./config");

const { Pool } = require("pg");
const databaseUrl = app.datasource.databaseUrl;

const connection = {
  connectionString: databaseUrl,
  query_timeout: 1000,
  statement_timeout: 1000,
  ssl: {
    rejectUnauthorized: false,
  },
};

let pool;

if (databaseUrl) {
  pool = new Pool(connection);
  console.log("Conexión Postgres exitosa contra " + databaseUrl);
}

module.exports = pool;
