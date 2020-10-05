const { userModel, tokenModel } = require("../../models/index");
const { getBalance } = require("../../helpers/index");

const bcrytpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  let error = null;
  try {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);

    if (!user || user.status !== "Verified") {
      next("USERNOTVERIFIED");
      return;
    }
    const balance = await getBalance(user.walletId);
    const isPasswordValid = await bcrytpt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      next("WRONGPASSWORD");
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

    return res.status(200).json({
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        balance: balance[0].balance,
      },
    });
  } catch (err) {
    res.locals.errorMessage = err.message;
    error = "SIGNINERROR";
    next(error);
  }
};
