const { JoiSignIn } = require("../../validations/index");

module.exports = async (req, res, next) => {
  let error = null;
  try {
    JoiSignIn(req.body);
  } catch (err) {
    res.locals.errorMessage = err.message;
    error = "VALIDATIONERROR";
  }
  next(error);
};
