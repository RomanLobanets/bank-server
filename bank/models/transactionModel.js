const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
  walletId: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  merchant: { type: String, required: true },
  amountInCents: { type: Number, required: true },
  createdAt: {
    type: Number,
    index: true,
    unique: true,
    required: true,
    default: Date.now(),
  },
});

const transactionModel = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions"
);
module.exports = transactionModel;
