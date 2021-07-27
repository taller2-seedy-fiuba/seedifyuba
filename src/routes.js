const authHandler = require("./handlers/authHandler");
const getWallet = require("./handlers/getWalletHandler");
const getWalletData = require("./handlers/getWalletDataHandler");
const getWalletsData = require("./handlers/getWalletsHandler");
const createWallet = require("./handlers/createWalletHandler");
const createProject = require("./handlers/createProjectHandler");
const cancelProject = require("./handlers/cancelProjectHandler");
const getProject = require("./handlers/getProjectHandler");
const foundProject = require("./handlers/fundProjectHandler");
const completeStage = require("./handlers/completeStageHandler");
const chargeWallet = require("./handlers/chargeWalletHandler");
const doTransfer = require("./handlers/doTransferHandler");
const getTransactions = require("./handlers/getTransactionsHandler");
const getTransaction = require("./handlers/getTransactionHandler");

function getWalletsDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallets",
    schema: getWalletsData.schema(config),
    preHandler: authHandler.preHandler(),
    handler: getWalletsData.handler({ config, ...services }),
  };
}

function createWalletRoute({ services, config }) {
  return {
    method: "POST",
    url: "/wallets",
    schema: createWallet.schema(config),
    preHandler: authHandler.preHandler(),
    handler: createWallet.handler({ config, ...services }),
  };
}

function getWalletRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallets/:user_id",
    schema: getWallet.schema(config),
    preHandler: authHandler.preHandler(),
    handler: getWallet.handler({ config, ...services }),
  };
}

function getWalletDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallets/:user_id/data",
    schema: getWalletData.schema(config),
    preHandler: authHandler.preHandler(),
    handler: getWalletData.handler({ config, ...services }),
  };
}

function chargeWalletRoute({ services, config }) {
  return {
    method: "POST",
    url: "/wallets/:user_id/charges",
    schema: chargeWallet.schema(config),
    preHandler: authHandler.preHandler(),
    handler: chargeWallet.handler({ config, ...services }),
  };
}

function createProjectRoute({ services, config }) {
  return {
    method: "POST",
    url: "/projects",
    schema: createProject.schema(config),
    preHandler: authHandler.preHandler(),
    handler: createProject.handler({ config, ...services }),
  };
}

function getProjectRoute({ services, config }) {
  return {
    method: "GET",
    url: "/projects/:hash",
    schema: getProject.schema(config),
    preHandler: authHandler.preHandler(),
    handler: getProject.handler({ config, ...services }),
  };
}

function updateStatusProjectRoute({ services, config }) {
  return {
    method: "PATCH",
    url: "/projects/:hash",
    schema: cancelProject.schema(config),
    preHandler: authHandler.preHandler(),
    handler: cancelProject.handler({ config, ...services }),
  };
}

function fundProjectRoute({ services, config }) {
  return {
    method: "POST",
    url: "/projects/:hash/funds",
    schema: foundProject.schema(config),
    preHandler: authHandler.preHandler(),
    handler: foundProject.handler({ config, ...services }),
  };
}

function completeStageRoute({ services, config }) {
  return {
    method: "POST",
    url: "/projects/:hash/stages",
    schema: completeStage.schema(config),
    preHandler: authHandler.preHandler(),
    handler: completeStage.handler({ config, ...services }),
  };
}

function transfersRoute({ services, config }) {
  return {
    method: "POST",
    url: "/transfers",
    schema: doTransfer.schema(config),
    preHandler: authHandler.preHandler(),
    handler: doTransfer.handler({ config, ...services }),
  };
}

function transactionsRoute({ services, config }) {
  return {
    method: "GET",
    url: "/users/:user_id/transactions",
    schema: getTransactions.schema(config),
    preHandler: authHandler.preHandler(),
    handler: getTransactions.handler({ config, ...services }),
  };
}

function transactionRoute({ services, config }) {
  return {
    method: "GET",
    url: "/users/:user_id/transactions/:hash",
    schema: getTransaction.schema(config),
    preHandler: authHandler.preHandler(),
    handler: getTransaction.handler({ config, ...services }),
  };
}

module.exports = [
  getWalletRoute,
  getWalletDataRoute,
  getWalletsDataRoute,
  createWalletRoute,
  createProjectRoute,
  updateStatusProjectRoute,
  getProjectRoute,
  fundProjectRoute,
  completeStageRoute,
  chargeWalletRoute,
  transfersRoute,
  transactionsRoute,
  transactionRoute,
];
