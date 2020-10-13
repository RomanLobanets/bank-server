const { userModel, transactionModel, tokenModel } = require("../models/index");

module.exports = async (walletId, session) => {
  try {
    const result = await transactionModel
      .aggregate(
        [
          { $match: { walletId } },
          { $group: { _id: null, balance: { $sum: "$amountInCents" } } },
          // { $match: { balance: { $gte: 0 } } },
        ]
        // { readConcern: { level: "local" } }
      )
      .session(session);
    // .readConcern("snapshot");
    // .maxTimeMS(10000);

    if (result.length < 1 || result == undefined) {
      return 0;
    } else {
      return result[0].balance;
    }
  } catch (err) {
    console.log(err);
  }
};
