const { userModel } = require("../../models/index");

module.exports = async (req, res, next) => {
  let error = null;
  try {
    const token = req.params.token;

    const userToverify = await userModel.findByVerificationToken(token);
    if (!userToverify) {
      error = "VERIFYEMAIL";
      res.locals.errorMessage = "verification token doesnt exist";
      next(error);
      return;
    }

    const updateUser = await userModel.verifyUser(userToverify._id);
    if (!updateUser) {
      error = "VERIFYEMAIL";
      res.locals.errorMessage = "user doesnt exist";
      next(error);
      return;
    }

    res.locals.user = updateUser;
  } catch (err) {
    res.locals.errorMessage = err.message;
    error = "VERIFYEMAIL";
  }
  next(error);
};
