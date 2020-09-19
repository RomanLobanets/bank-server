const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const bankRouter = require("./bank/bank.routes");

module.exports = class BankServer {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddleWares();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleWares() {
    this.server.use(express.json());
    this.server.use(
      morgan(":method :url :status :res[content-length] - :response-time ms")
    );
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }
  initRoutes() {
    this.server.use("/", bankRouter);
  }
  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGO_DB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      // await mongoose.connection.dropDatabase();
      console.log("Database connected");
    } catch (err) {
      console.log(err);
    }
  }
  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("start at port", process.env.PORT);
    });
  }
};
