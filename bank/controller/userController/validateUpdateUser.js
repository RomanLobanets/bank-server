const { JoiUpdateUser } = require("../../validations/index");
module.exports = (req, res, next) => {
  let error = null;
  try {
    JoiUpdateUser(req.body);
  } catch (err) {
    res.locals.errorMessage = err.message;
    error = "UPDATEUSERERROR";
  }
  next(error);
};
