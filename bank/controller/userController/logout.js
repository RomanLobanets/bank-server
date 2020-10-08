const { tokenModel } = require("../../models/index");
const { UnauthorizedError } = require("../../helpers");

module.exports = async (req, res, next) => {
  let error = null;

  try {
    const deletedToken = await tokenModel.findByUserIdAndTokenAndDelete(
      res.locals.user._id,
      res.locals.token
    );

    if (!deletedToken) {
      error = "LOGOUTERROR";
      res.locals.errorMessage = "token doesnt exist";
      next(error);
      return;
    }
    return res.status(204).send();
  } catch (err) {
    error = "LOGOUTERROR";
    res.locals.errorMessage = err.message;
  }
  next(error);
};
