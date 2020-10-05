const { v4: uuidv4 } = require("uuid");
const { userModel } = require("../models/index");
const sendEmail = require("./sendEmail");

async function sendVerificationEmail(user) {
  const verificationToken = uuidv4();
  await userModel.createVerificationToken(user._id, verificationToken);
  await sendEmail(user, verificationToken);
}

module.exports = sendVerificationEmail;
