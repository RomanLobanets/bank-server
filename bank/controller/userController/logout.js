const { tokenModel } = require("../../models/index");
const { UnauthorizedError } = require("../../helpers");

module.exports = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    const token = authorizationHeader.replace("Bearer ", "");
    const deletedToken = await tokenModel.findByUserIdAndTokenAndDelete(
      res.locals.user._id,
      token
    );

    if (!deletedToken) {
      throw new UnauthorizedError("User not authorized");
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
