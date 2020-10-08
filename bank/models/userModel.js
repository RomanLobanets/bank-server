const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserClass = require("./UserClass");

const userSchema = new Schema({
  walletId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  verificationToken: { type: String, required: false, default: "" },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.loadClass(UserClass);

const userModel = mongoose.model("User", userSchema, "users");

module.exports = userModel;
