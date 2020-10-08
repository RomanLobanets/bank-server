const { userModel } = require("../../models/index");
const { sendVerificationEmail } = require("../../helpers/index");
const { preparedUser } = require("../../helpers/index");
const bcrytpt = require("bcryptjs");

module.exports = async (req, res, next) => {
  console.log(res.locals.user);
  let error;
  let hashedPass;
  const costFactor = 4;
  try {
    if (req.body.password) {
      hashedPass = await bcrytpt.hash(req.body.password, costFactor);
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

    return res.status(201).json(preparedUser(updateSubscription));
  } catch (err) {
    res.locals.errorMessage = err.message;
    error = "UPDATEUSERERROR";
    next(error);
  }
};
