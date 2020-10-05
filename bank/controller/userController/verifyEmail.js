const { userModel } = require("../../models/index");

const { UnauthorizedError } = require("../../helpers");

module.exports = async (req, res, next) => {
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
};
