const { userModel } = require("../../models/index");
const { sendVerificationEmail } = require("../../helpers/index");

const bcrytpt = require("bcryptjs");

module.exports = async (req, res, next) => {
  try {
    let hashedPass;
    if (req.body.password) {
      hashedPass = await bcrytpt.hash(req.body.password, this._costFactor);
    }
    if (req.body.email) {
      await userModel.changeEmail(res.locals.user._id);
      await sendVerificationEmail(res.locals.user);
    }

    const updateSubscription = await userModel.findUserByIdAndUpdate(
      res.locals.user._id,
      {
        ...req.body,
        password: hashedPass,
      }
    );

    return res.status(201).json(updateSubscription);
  } catch (err) {
    console.log(err);

    next(err);
  }
};
