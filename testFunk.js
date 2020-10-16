const { MongoClient } = require("mongodb");

const transactionOptions = {
  readPreference: "primary",
  readConcern: { level: "local" },
  writeConcern: { w: "majority" },
};

async function main() {
  const client = new MongoClient({ useUnifiedTopology: true });
  await client.connect();

  const transaction = client.db("dbbank").collection("transactions");

  const money = {
    walletId: "d5e2c560-09f2-4e5f-8018-199ada67051f",
    longitude: "-100",
    latitude: "-100",
    merchant: "Bed",
  };

  await Promise.all([
    runTest(client, transaction, { ...money, amountInCents: 100 }),
    runTest(client, transaction, { ...money, amountInCents: 200 }),
    runTest(client, transaction, { ...money, amountInCents: -400 }),
    runTest(client, transaction, { ...money, amountInCents: 100 }),
    runTest(client, transaction, { ...money, amountInCents: 200 }),
    runTest(client, transaction, { ...money, amountInCents: -600 }),
  ]);
}

async function runTest(client, transaction, body) {
  const session = client.startSession();

  try {
    const transactionResult = await session.withTransaction(async () => {
      await transaction.insertOne(body, { session });

      const cursor = await transaction.aggregate([
        { $match: { walletId: "d5e2c560-09f2-4e5f-8018-199ada67051f" } },
        { $group: { _id: null, balance: { $sum: "$amountInCents" } } },
        { $project: { _id: 0, balance: 1 } },
      ]);

      for await (const { balance } of cursor) {
        console.log(balance);
        if (balance < 0) {
          await session.abortTransaction();
          throw new Error("bad balance");
        }
      }
    }, transactionOptions);
    console.log("done"); // transactionResult
  } catch (error) {
    console.error(error);
  } finally {
    await session.endSession();
  }
}

main().catch(console.error);

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
