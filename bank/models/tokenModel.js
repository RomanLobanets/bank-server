const mongoose = require("mongoose");
const { Schema } = mongoose;
const TokenClass = require("./TokenClass");

const tokenSchema = new Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  lastModifiedDate: { type: Date, required: true },
});

tokenSchema.loadClass(TokenClass);

const tokenModel = mongoose.model("Tokens", tokenSchema, "token");

module.exports = tokenModel;
