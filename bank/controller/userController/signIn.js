const { userModel, tokenModel } = require("../../models/index");
const { getBalance } = require("../../helpers/index");
const { preparedUser } = require("../../helpers/index");

const bcrytpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  let error = null;
  try {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);

    if (!user || user.status !== true) {
      error = "SIGNINERROR";
      res.locals.errorMessage = "user doesnt exist or verified";
      next(error);
      return;
    }

    const isPasswordValid = await bcrytpt.compare(password, user.password);

    if (!isPasswordValid) {
      error = "SIGNINERROR";
      res.locals.errorMessage = "wrong password";
      next(error);
      return;
    }
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 1 * 24 * 60 * 60,
    });

    await tokenModel.create({
      userId: user._id,
      token,
      lastModifiedDate: Date.now(),
    });

    const balance = await getBalance(user.walletId);

    return res.status(200).json({
      token: token,
      balance,
      ...preparedUser(user),
    });
  } catch (err) {
    res.locals.errorMessage = "Oops something went wrong try again";
    error = "SIGNINERROR";
    next(error);
  }
};
