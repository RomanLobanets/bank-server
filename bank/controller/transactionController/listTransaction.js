const {
  userModel,
  transactionModel,
  tokenModel,
} = require("../../models/index");
const { getBalance } = require("../../helpers/index");

module.exports = async (req, res, next) => {
  try {
    const { walletId } = req.user;
    const { perPage, page, start, end, mername } = req.query;
    let result;
    if (perPage && page && start && end && mername) {
      result = await transactionModel.aggregate([
        {
          $match: {
            walletId: `${walletId}`,
          },
        },
        { $sort: { createdAt: 1 } },
        {
          $match: {
            merchant: `${mername}`,
            createdAt: { $gte: Number(start), $lte: Number(end) },
          },
        },
        { $skip: Number(page * perPage) },
        { $limit: Number(perPage) },
      ]);
    } else if (perPage && page) {
      result = await transactionModel.aggregate([
        {
          $match: {
            walletId: `${walletId}`,
          },
        },
        { $sort: { createdAt: 1 } },

        { $skip: Number(page * perPage) },
        { $limit: Number(perPage) },
      ]);
    } else if (start && end) {
      result = await transactionModel.aggregate([
        {
          $match: {
            walletId: `${walletId}`,
          },
        },
        { $sort: { createdAt: 1 } },
        {
          $match: {
            createdAt: { $gte: Number(start), $lte: Number(end) },
          },
        },
      ]);
    } else if (mername) {
      result = await transactionModel.aggregate([
        {
          $match: {
            walletId: `${walletId}`,
          },
        },
        { $sort: { createdAt: 1 } },
        {
          $match: {
            merchant: `${mername}`,
          },
        },
      ]);
    } else {
      result = await transactionModel.aggregate([
        {
          $match: {
            walletId: `${walletId}`,
          },
        },
        { $sort: { createdAt: 1 } },
      ]);
    }

    return res.status(200).json(preparedTransAction(result));
  } catch (err) {
    next(err);
  }
};
