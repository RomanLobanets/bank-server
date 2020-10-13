const { transactionModel } = require("../../models/index");

module.exports = async (req, res, next) => {
  let error = null;

  const { walletId } = res.locals.user;
  const { perPage, page, start, end, merchant } = req.query;

  const matchStage = { $match: { walletId } };
  const sortStage = { $sort: { createdAt: 1 } };
  const merchStage = {
    $match: { merchant: { $regex: new RegExp(merchant), $options: "i" } },
  };
  const rangeStage = {
    $match: { createdAt: { $gte: Number(start), $lte: Number(end) } },
  };
  const skipStage = { $skip: Number(page * perPage) };
  const limitStage = { $limit: Number(perPage) };

  const pipline = [matchStage, sortStage];

  if (merchant) {
    pipline.push(merchStage);
  }
  if (start & end) {
    pipline.push(rangeStage);
  }
  if (perPage && page) {
    pipline.push(skipStage, limitStage);
  }

  try {
    const result = await transactionModel.aggregate(pipline);
    return res.status(200).json(result);
  } catch (err) {
    error = "LISTTRANSERROR";
    res.locals.errorMessage = "Oops smt went wrong try later";
    next(error);
  }
};
