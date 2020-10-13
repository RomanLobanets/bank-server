const { preparedUser } = require("../../helpers/");
const { userModel } = require("../../models");

module.exports = async (req, res, next) => {
  let error = null;
  try {
    const users = await userModel.find();
    return res.status(200).json(preparedUser(users));
  } catch (err) {
    res.locals.errorMessage = "something went wrong please try later";
    error = "LISTUSERSERROR";
  }
  next(error);
};
