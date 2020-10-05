const {
  userModel,
  transactionModel,
  tokenModel,
} = require("../../models/index");
const { getBalance } = require("../../helpers/index");

module.exports = async (req, res, next) => {
  try {
    const { walletId } = req.user;
    const { longitude, latitude, merchant, amountInCents } = req.body;
    const [{ balance }] = await getBalance(walletId);
    if (balance + amountInCents < 0) {
      return res.status(401).send("not enough money on your acount");
    }
    const actualBalance = balance[0].balance + amountInCents;
    const createdAt = Date.now();
    const newMerchant = await transactionModel.create({
      walletId,
      longitude,
      latitude,
      merchant,
      amountInCents,
      createdAt,
    });
    return res.status(201).json({
      walletId,
      longitude,
      latitude,
      merchant,
      amountInCents,
      createdAt,
      balance: actualBalance,
    });
  } catch (err) {
    next(err);
  }
};
