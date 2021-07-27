const transactionStatus = {
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
};

const transactionMessage = {
  PROJECT_CREATED: "Project created",
  PROJECT_NOT_CREATED: "Project not created",
  PROJECT_FUNDED: "Project funded",
  PROJECT_NOT_FUNDED: "Project not funded",
  STAGE_COMPLETED: "Stage completed",
  STAGE_NOT_COMPLETED: "Stage not completed",
  PROJECT_CANCELED: "Project canceled",
  PROJECT_NOT_CANCELED: "Project not canceled",
  AMOUNT_RECEIVED: "Amount received",
  AMOUNT_SENT: "Amount sent",
};

const transactionFlow = {
  IN: "IN",
  OUT: "OUT",
};

module.exports = { transactionStatus, transactionMessage, transactionFlow };
