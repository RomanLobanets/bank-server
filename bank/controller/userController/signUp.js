const { userModel } = require("../../models/index");
const { sendVerificationEmail } = require("../../helpers/index");
const { v4: uuidv4 } = require("uuid");
const bcrytpt = require("bcryptjs");

module.exports = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const passwordHash = await bcrytpt.hash(password, this._costFactor);
  const existUser = await userModel.findUserByEmail(email);
  const walletId = uuidv4();

  if (existUser) {
    return res.status(409).send("user is already exist");
  }

  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password: passwordHash,
    walletId,
  });
  await sendVerificationEmail(user);
  return res.status(201).json({ id: user._id, firstName, lastName, email });
};
