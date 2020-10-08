const { Router } = require("express");
const {
  userController,
  transactionController,
} = require("../controller/index");

const transactionRouter = Router();

transactionRouter.get(
  "/listtransactions",
  userController.authorizeToken,
  userController.authorize,
  transactionController.listTransactions
);
transactionRouter.put(
  "/transaction",
  userController.authorizeToken,
  userController.authorize,
  transactionController.addUserTransaction
);

module.exports = transactionRouter;
