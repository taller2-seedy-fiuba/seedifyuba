const app = {
  host: process.env.HOST || "localhost",
  port: process.env.PORT || 5000,
  auth: process.env.AUTH || false,
  datasource: {
    databaseUrl: process.env.DATABASE_URL,
  },
  services: {
    api: {
      baseurl: process.env.SERVICES_BASEURL || 'http://localhost:8000',
    },
  },
};

module.exports = app;
