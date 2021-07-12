const config = require("./config");
const services = require("./services/services")({ config });
const routes = require("./routes");

// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });

// Declares routes
routes.forEach(route => fastify.route(route({ config, services })));

//Swagger & OpenAPI
fastify.register(require('fastify-swagger'), {
  mode: 'static',
  specification: {
    path: './api/swagger.yaml',
    postProcessor: function(swaggerObject) {
      return swaggerObject
    }
    },
  exposeRoute: true
});

// Run the server!
const start = async () => {
  try {
    fastify.listen(process.env.PORT || 5000, '0.0.0.0').then((address) =>
    fastify.log.info(`SERVER LISTENING ON ${address}`));

    fastify.ready(() => {
      console.log(fastify.printRoutes());
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
