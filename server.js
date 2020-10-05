const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const errorHandler = require("./bank/errorHandler");

const { userRouter, transactionRouter } = require("./bank/routes/index");

module.exports = class BankServer {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddleWares();
    this.initRoutes();
    this.server.use(errorHandler);
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
    this.server.use("/", userRouter);
    this.server.use("/", transactionRouter);
  }
  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGO_DB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
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
