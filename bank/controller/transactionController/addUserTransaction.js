const { transactionModel } = require("../../models/index");
const { getBalance } = require("../../helpers/index");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  const session = await mongoose.startSession({ causalConsistency: true });
  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "majority" },
    writeConcern: { w: "majority" },
    j: false,
  };

  try {
    await session.withTransaction(async () => {
      const { walletId } = res.locals.user;
      const { longitude, latitude, merchant, amountInCents } = req.body;

      const createdAt = Date.now();
      const newMerchant = await transactionModel.create(
        [
          {
            walletId,
            longitude,
            latitude,
            merchant,
            amountInCents,
            createdAt,
          },
        ],
        { session },
        { multi: true }
      );

      console.log({ newMerchant });
      const balance = await getBalance(walletId, session);
      console.log({ balance, amountInCents });

      if (balance < 0) {
        await session.abortTransaction();
        console.log("not enoght money");
        throw new Error("LOGOUTERROR");
      }

      await session.commitTransaction();

      return res.status(201).json({
        walletId,
        longitude,
        latitude,
        merchant,
        amountInCents,
        createdAt,
        balance,
      });
    }, transactionOptions);
  } catch (err) {
    // await session.abortTransaction();
    console.log(err);
    next("LOGOUTERROR");
  } finally {
    await session.endSession();
  }
};

// module.exports = async (req, res, next) => {
//   const session = await mongoose.startSession();

//   try {
//     await session.startTransaction();
//     const { walletId } = res.locals.user;
//     const { longitude, latitude, merchant, amountInCents } = req.body;
//     const balance = await getBalance(walletId, session);
//     console.log({ balance, amountInCents });

//     if (balance + amountInCents < 0) {
//       console.log("not enoght money");
//       throw new Error("LOGOUTERROR");
//     }

//     const actualBalance = balance + amountInCents;
//     const createdAt = Date.now();
//     const newMerchant = await transactionModel.create(
//       [
//         {
//           walletId,
//           longitude,
//           latitude,
//           merchant,
//           amountInCents,
//           createdAt,
//         },
//       ],
//       { session }
//     );
//     // console.log({ newMerchant });
//     await session.commitTransaction();
//     console.log({ actualBalance });
//     return res.status(201).json({
//       walletId,
//       longitude,
//       latitude,
//       merchant,
//       amountInCents,
//       createdAt,
//       balance: actualBalance,
//     });
//   } catch (err) {
//     console.log(err);
//     await session.abortTransaction();
//     next(err);
//   } finally {
//     session.endSession();
//   }
// };
