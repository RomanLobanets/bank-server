const { userModel } = require("../../models/index");
const { preparedUser } = require("../../helpers/index");

module.exports = async (req, res, next) => {
  try {
    const users = await userModel.find();
    return res.status(200).json(preparedUser(users));
  } catch (err) {
    next(err);
  }
};
