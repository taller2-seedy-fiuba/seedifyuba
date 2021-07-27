const authFilter = require("../filter/auth-filter");

function preHandler() {
  return async function (req, reply) {
    const doNext = await authFilter.doFilter(req)
    if (!doNext){
      const apiResponse =
      {
        status: 'FAILURE',
        statusCode: 503,
        code: 'UNAVAILABLE_SERVICE',
        message: 'Smart Contract Service is Unavailable'
      };
      reply.code(503).send(apiResponse);
    }
  };
}

module.exports = { preHandler };