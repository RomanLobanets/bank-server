const { Router } = require("express");
const bankController = require("./bank.controller");

const bankRouter = Router();

bankRouter.get("/users", bankController.listUsers);

bankRouter.post(
  "/signup",
  bankController.validateSignUpUser,
  bankController.signUp
);
bankRouter.get(
  "/verify/:token",
  bankController.verifyEmail,
  bankController.signInOnEmail
);

bankRouter.get("/signin", bankController.validateSignIn, bankController.signIn);

bankRouter.put(
  "/update",
  bankController.authorize,
  bankController.validateUpdateUser,
  bankController.updateUser
);
bankRouter.get(
  "/listtransactions",
  bankController.authorize,
  bankController.listTransactions
);
bankRouter.put(
  "/transaction",
  bankController.authorize,
  bankController.addUserTransaction
);

bankRouter.patch("/logout", bankController.authorize, bankController.logout);

module.exports = bankRouter;
