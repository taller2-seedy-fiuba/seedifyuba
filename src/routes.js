const getWallet = require("./handlers/getWalletHandler");
const getWalletData = require("./handlers/getWalletDataHandler");
const getWalletsData = require("./handlers/getWalletsHandler");
const createWallet = require("./handlers/createWalletHandler");
const createProject = require("./handlers/createProjectHandler");
const getProject = require("./handlers/getProjectHandler");
const foundProject = require("./handlers/fundProjectHandler");
const completeStage = require("./handlers/completeStageHandler");

function getWalletsDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallets",
    schema: getWalletsData.schema(config),
    handler: getWalletsData.handler({ config, ...services }),
  };
}

function getWalletRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallets/:id",
    schema: getWallet.schema(config),
    handler: getWallet.handler({ config, ...services }),
  };
}

function getWalletDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallets/:id/data",
    schema: getWalletData.schema(config),
    handler: getWalletData.handler({ config, ...services }),
  };
}

function createWalletRoute({ services, config }) {
  return {
    method: "POST",
    url: "/wallets",
    schema: createWallet.schema(config),
    handler: createWallet.handler({ config, ...services }),
  };
}

function createProjectRoute({ services, config }) {
  return {
    method: "POST",
    url: "/projects",
    schema: createProject.schema(config),
    handler: createProject.handler({ config, ...services }),
  };
}

function getProjectRoute({ services, config }) {
  return {
    method: "GET",
    url: "/projects/:id",
    schema: foundProject.schema(config),
    handler: getProject.handler({ config, ...services }),
  };
}

function fundProjectRoute({ services, config }) {
  return {
    method: "POST",
    url: "/projects/:id/founds",
    schema: foundProject.schema(config),
    handler: foundProject.handler({ config, ...services }),
  };
}

function completeStageRoute({ services, config }) {
  return {
    method: "POST",
    url: "/projects/:id/stages",
    schema: completeStage.schema(config),
    handler: completeStage.handler({ config, ...services }),
  };
}

module.exports = [getWalletRoute, getWalletDataRoute, getWalletsDataRoute, createWalletRoute, createProjectRoute, getProjectRoute, fundProjectRoute, completeStageRoute];
