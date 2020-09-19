const mongoose = require("mongoose");
const { collection } = require("../../homework-06/user/user.model");
const { Schema } = mongoose;
const userSchema = new Schema({
  walletId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false, default: "" },
  verificationToken: { type: String, required: false, default: "" },
  status: {
    type: String,
    required: true,
    enum: ["Verified", "Created"],
    default: "Created",
  },
});

const transactionSchema = new Schema({
  walletId: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  merchant: { type: String, required: true },
  amountInCents: { type: Number, required: true },
  createdAt: { type: Number, required: true },
});
userSchema.statics.findUserByIdAndUpdate = findUserByIdAndUpdate;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.createVerificationToken = createVerificationToken;
userSchema.statics.findByVerificationToken = findByVerificationToken;
userSchema.statics.verifyUser = verifyUser;
userSchema.statics.updateToken = updateToken;

function findUserByIdAndUpdate(userId, updatedParams) {
  return this.findByIdAndUpdate(userId, { $set: updatedParams }, { new: true });
}

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function createVerificationToken(userId, token) {
  return this.findByIdAndUpdate(
    userId,
    { verificationToken: token },
    { new: true }
  );
}

async function findByVerificationToken(verificationToken) {
  return this.findOne({ verificationToken });
}

async function verifyUser(userId) {
  return this.findByIdAndUpdate(
    userId,
    { status: "Verified", verificationToken: "" },
    { new: true }
  );
}

async function updateToken(id, token) {
  return this.findByIdAndUpdate(id, { token }, { new: true });
}

const userModel = mongoose.model("User", userSchema, "users");
const transactionModel = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions"
);
// module.exports = userModel;
// module.exports = transactionModel;
module.exports = {
  userModel,
  transactionModel,
};
