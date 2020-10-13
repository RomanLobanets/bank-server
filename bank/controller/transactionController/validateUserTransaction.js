const { JoiAddUserTransaction } = require("../../validations/index");

module.exports = async (req, res, next) => {
  let error = null;

  try {
    JoiAddUserTransaction(req.body);
  } catch (err) {
    res.locals.errorMessage = err.message;
    error = "VALIDATIONERROR";
  }
  next(error);
};
