const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
  walletId: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  merchant: { type: String, required: true },
  amountInCents: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: new Date() },
});

const transactionModel = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions"
);
module.exports = transactionModel;
