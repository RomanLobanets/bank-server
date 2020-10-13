const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
let client;

const transactionOptions = {
  readPreference: "primary",
  readConcern: { level: "local" },
  writeConcern: { w: "majority" },
};

async function main() {
  client = new MongoClient(process.env.MONGO_DB_URL);
  await client.connect();

  app.listen(3000, function () {
    console.log("server starts");
  });
}
app.use(express.json());

// app.put("/transations", async (req, res) => {
//   console.log(req.body);
//   const transaction = client.db("dbbank").collection("transactions");

//   const session = client.startSession();
//   try {
//     await session.withTransaction(async () => {
//       await transaction.insertOne(req.body, { session });
//       // await session.abortTransaction();
//       await transaction
//         .aggregate([
//           { $match: { walletId: "d5e2c560-09f2-4e5f-8018-199ada67051f" } },
//           { $group: { _id: null, balance: { $sum: "$amountInCents" } } },
//         ])
//         .toArray(async (err, list) => {
//           if (list[0].balance < 0) {
//             await session.abortTransaction();
//             res.status(403).send();
//             return;
//           }
//           console.log({ balance: list[0].balance });
//           console.log(err);
//         });
//     }, transactionOptions);
//     // await session.commitTransaction();
//     res.status(201).send();
//   } catch (err) {
//     session.abortTransaction();
//     console.log(err);
//   } finally {
//     await session.endSession();
//     // await client.close();
//   }
// });
app.put("/transations", async (req, res) => {
  const transaction = client.db("dbbank").collection("transactions");
  const session = client.startSession();

  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };
  try {
    const transactionResult = await session.withTransaction(async () => {
      await transaction.insertOne(req.body, { session });

      const bal = await transaction.aggregate([
        { $match: { walletId: "d5e2c560-09f2-4e5f-8018-199ada67051f" } },
        { $group: { _id: null, balance: { $sum: "$amountInCents" } } },
        { $project: { _id: 0, balance: 1 } },
      ]);
      // .toArray(async (err, list) => {
      //   console.log({ balance: list[0].balance });

      //   if (list[0].balance < 0) {
      //     await session.abortTransaction();
      //     console.log("balance to low");
      //     return res.status(403).json("balance to low");
      //   }
      // });

      bal.toArray(async function (err, docs) {
        console.log(docs);

        if (docs[0].balance < 0) {
          await session.abortTransaction();
          return res.status(403).json("balance to low");
        }
      });
    }, transactionOptions);
    return res.status(201).json("ok");
  } catch (err) {
    console.log("trans aborted");
  } finally {
    await session.endSession();
  }
});

main();
