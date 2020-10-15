const { userModel, tokenModel } = require("../../models/index");

module.exports = async (req, res, next) => {
  let error = null;

  try {
    const userToken = await tokenModel.findByUserIdAndToken(
      res.locals.userId,
      res.locals.token
    );

    if (!userToken) {
      res.locals.errorMessage = "token doesnt exist";
      error = "AUTHORIZEERROR";
      next(error);
      return;
    }
    const user = await userModel.findById(res.locals.userId);
    res.locals.user = user;

    if (!user) {
      res.locals.errorMessage = "user doesnt exist";
      error = "AUTHORIZEERROR";
      next(error);
      return;
    }
  } catch (err) {
    error = "AUTHORIZEERROR";
    res.locals.errorMessage = "Oops something went wrong with authorize";
  }
  next(error);
};
