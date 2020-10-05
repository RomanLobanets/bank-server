const { userModel, transactionModel, tokenModel } = require("../models/index");

async function getBalance(walletId) {
  return transactionModel.aggregate([
    {
      $group: { _id: `$${walletId}`, balance: { $sum: "$amountInCents" } },
    },
  ]);
}
module.exports = getBalance;
