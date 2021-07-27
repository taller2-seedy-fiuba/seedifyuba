const app = {
  host: process.env.HOST || "localhost",
  port: process.env.PORT || 5000,
  datasource: {
    databaseUrl: process.env.DATABASE_URL,
  },
};

module.exports = app;
