const { JoiValidateTransactionListQuery } = require("../../validations/index");

module.exports = async (req, res, next) => {
  let error = null;

  try {
    JoiValidateTransactionListQuery(req.query);
  } catch (err) {
    res.locals.errorMessage = err.message;
    error = "VALIDATIONERROR";
  }
  next(error);
};
