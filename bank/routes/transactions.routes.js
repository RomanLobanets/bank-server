const { Router } = require("express");
const {
  userController,
  transactionController,
} = require("../controller/index");
const transactionModel = require("../models/transactionModel");

const transactionRouter = Router();

transactionRouter.get(
  "/listtransactions",
  userController.authorizeToken,
  userController.authorize,
  transactionController.validateListTransaction,
  transactionController.listTransactions
);
transactionRouter.put(
  "/transaction",
  userController.authorizeToken,
  userController.authorize,
  transactionController.validateUserTransaction,
  transactionController.addUserTransaction
);

module.exports = transactionRouter;
