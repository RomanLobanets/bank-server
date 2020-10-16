const { JoiSignUp } = require("../../validations/index");

module.exports = async (req, res, next) => {
  let error = null;
  try {
    JoiSignUp(req.body);
  } catch (err) {
    res.locals.errorMessage = err.message;
    error = "VALIDATESIGNUPUSER";
  }
  next(error);
};
