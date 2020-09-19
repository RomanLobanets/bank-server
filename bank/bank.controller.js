const { userModel, transactionModel } = require("./bank.model");
// const transactionModel = require("./bank.model");
const { v4: uuidv4 } = require("uuid");
const bcrytpt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const { UnauthorizedError } = require("./helpers");

class BankController {
  constructor() {
    this._costFactor = 4;
  }
  get listUsers() {
    return this._listUsers.bind(this);
  }
  get signUp() {
    return this._signUp.bind(this);
  }
  get updateUser() {
    return this._updateUser.bind(this);
  }
  get signIn() {
    return this._signIn.bind(this);
  }
  get addUserTransaction() {
    return this._addUserTransaction.bind(this);
  }
  get listTransactions() {
    return this._listTransactions.bind(this);
  }
  async _listTransactions(req, res, next) {
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

      return res.status(200).json(this.preparedTransAction(result));
    } catch (err) {
      next(err);
    }
  }
  async _listUsers(req, res, next) {
    try {
      const users = await userModel.find();
      return res.status(200).json(this.preparedUser(users));
    } catch (err) {
      next(err);
    }
  }
  preparedUser(users) {
    return users.map((item) => {
      const { firstName, lastName, email } = item;
      return { firstName, lastName, email };
    });
  }
  preparedTransAction(transactions) {
    return transactions.map((item) => {
      const { longitude, latitude, merchant, amountInCents, createdAt } = item;
      const formatedDate = new Date(createdAt).toLocaleString();
      return {
        location: { longitude, latitude },
        merchant,
        amountInCents,
        createdAt: formatedDate,
      };
    });
  }

  async _signUp(req, res, next) {
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrytpt.hash(password, this._costFactor);
    const existUser = await userModel.findUserByEmail(email);
    const walletId = uuidv4();

    if (existUser) {
      return res.status(409).send("user is already exist");
    }

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      walletId,
    });
    await this.sendVerificationEmail(user);
    return res.status(201).json({ id: user._id, firstName, lastName, email });
  }

  async _signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findUserByEmail(email);

      const balance = await this.getBalance(user.walletId);

      if (!user || user.status !== "Verified") {
        return res.status(401).send("User is not verified");
      }
      const isPasswordValid = await bcrytpt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).send("User is not verified");
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 1 * 24 * 60 * 60,
      });
      await userModel.updateToken(user._id, token);

      return res.status(200).json({
        token,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          balance: balance[0].balance,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async signInOnEmail(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findUserByEmail(email);
      if (!user || user.status !== "Verified") {
        return res.status(401).send("Email or password is wrong");
      }

      if (password !== user.password) {
        return res.status(401).send("Email or password is wrong");
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 1 * 24 * 60 * 60,
      });
      await userModel.updateToken(user._id, token);
      return res.status(200).json({
        token,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async validateSignUpUser(req, res, next) {
    const createSignUpRules = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = createSignUpRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details[0].message);
    }
    next();
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("User not authorized"));
      }
      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError("User not authorized");
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      next(err);
    }
  }
  // FINISHED WITH EMAILVERIFICATION
  async _updateUser(req, res, next) {
    try {
      const userId = req.user._id;
      let updateSubscription = null;
      console.log(req.body.password);
      if (req.body.password !== undefined) {
        const password = req.body.password;
        const passwordHAsh = await bcrytpt.hash(password, this._costFactor);
        updateSubscription = await userModel.findUserByIdAndUpdate(userId, {
          ...req.body,
          password: passwordHAsh,
        });
        return res.status(201).json(updateSubscription);
      } else {
        updateSubscription = await userModel.findUserByIdAndUpdate(
          userId,
          req.body
        );
        return res.status(201).json(updateSubscription);
      }
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;
      await userModel.updateToken(user._id, null);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
  async getBalance(walletId) {
    try {
      // const result = await userModel.aggregate([
      //   { $match: { walletId: `${walletId}` } },
      //   {
      //     $lookup: {
      //       from: "transactions",
      //       localField: "walletId",
      //       foreignField: "walletId",
      //       as: "trans",
      //     },
      //   },
      //   {
      //     $unwind: "$trans",
      //   },
      //   { $group: { _id: null, balance: { $sum: "$trans.amountInCents" } } },
      // ]);
      // return result;
      const result = await transactionModel.aggregate([
        {
          $group: { _id: `$${walletId}`, balance: { $sum: "$amountInCents" } },
        },
      ]);
      return result;
    } catch (err) {
      return err;
    }
  }

  async _addUserTransaction(req, res, next) {
    try {
      const { walletId } = req.user;
      const { longitude, latitude, merchant, amountInCents } = req.body;
      const balance = await this.getBalance(walletId);
      if (balance[0].balance + amountInCents < 0) {
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
  }

  async sendVerificationEmail(user) {
    const verificationToken = uuidv4();
    await userModel.createVerificationToken(user._id, verificationToken);
    await this.sendEmail(user, verificationToken);
  }

  async sendEmail(user, verificationToken) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: user.email,
      from: "extreme.exterminating.ny@gmail.com",
      subject: "Verification Email",
      text: "verificate it please",
      html: `<a href='http://localhost:3000/verify/${verificationToken}' >click here please to verify your account</a>`,
    };
    const result = await sgMail.send(msg);
  }

  async verifyEmail(req, res, next) {
    try {
      const token = req.params.token;

      const userToverify = await userModel.findByVerificationToken(token);
      if (!userToverify) {
        throw new UnauthorizedError("User not authorized");
      }
      const updateUser = await userModel.verifyUser(userToverify._id);
      req.body = { ...updateUser._doc };

      next();
      // return res.status(200).send("your user is verified now you can sign in");
    } catch (err) {
      next(err);
    }
  }

  validateSignIn(req, res, next) {
    const signInRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = signInRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details[0].message);
    }
    next();
  }

  validateUpdateUser(req, res, next) {
    const updateUserRules = Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string(),
      password: Joi.string(),
    });
    const result = updateUserRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    next();
  }
}
module.exports = new BankController();
