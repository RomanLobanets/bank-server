const { Router } = require("express");
const { userController } = require("../controller/index");

const userRouter = Router();

userRouter.get("/users", userController.listUsers);

userRouter.post(
  "/signup",
  userController.validateSignUpUser,
  userController.signUp
);
userRouter.get(
  "/verify/:token",
  userController.verifyEmail,
  userController.signInOnEmail
);

userRouter.get("/signin", userController.validateSignIn, userController.signIn);

userRouter.put(
  "/update",
  userController.authorizeToken,
  userController.authorize,
  userController.validateUpdateUser,
  userController.updateUser
);

userRouter.patch(
  "/logout",
  userController.authorizeToken,
  userController.authorize,
  userController.logout
);

module.exports = userRouter;
