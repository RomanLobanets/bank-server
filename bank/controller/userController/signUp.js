const { userModel } = require("../../models/index");
const { sendVerificationEmail } = require("../../helpers/index");
const { preparedUser } = require("../../helpers/index");
const { v4: uuidv4 } = require("uuid");
const bcrytpt = require("bcryptjs");

module.exports = async (req, res, next) => {
  let error;
  try {
    const costFactor = 4;
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrytpt.hash(password, costFactor);
    const existUser = await userModel.findUserByEmail(email);
    const walletId = uuidv4();

    if (existUser) {
      error = "SIGNUPERROR";
      res.locals.errorMessage = "user already exist";
      next(error);
      return;
    }

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      walletId,
    });

    await sendVerificationEmail(user);
    res.status(201).json(preparedUser(user));
  } catch (err) {
    error = "SIGNUPERROR";
    res.locals.errorMessage = err.message;
  }
  next(error);
};
