const { Router } = require("express");
const {
  userController,
  transactionController,
} = require("../controller/index");

const transactionRouter = Router();

transactionRouter.get(
  "/listtransactions",
  userController.authorize,
  transactionController.listTransactions
);
transactionRouter.put(
  "/transaction",
  userController.authorize,
  transactionController.addUserTransaction
);

module.exports = transactionRouter;
