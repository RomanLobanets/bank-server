const { userModel, tokenModel } = require("../../models/index");

const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  let error = null;
  try {
    const authorizationHeader = req.get("Authorization");
    const token = authorizationHeader.replace("Bearer ", "");
    let userId;

    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (err) {
      res.locals.errorMessage = "token doesnt veryfied";
      next("AUTHORIZEERROR");
    }
    const userToken = await tokenModel.findByUserIdAndToken(userId, token);

    if (!userToken && userToken.token !== token) {
      res.locals.errorMessage = "token doesnt exist";
      next("AUTHORIZEERROR");
      return;
    }
    const user = await userModel.findById(userId);

    if (!user) {
      res.locals.errorMessage = "user doesnt exist";
      next("AUTHORIZEERROR");
      return;
    }
    res.locals.user = user;
    res.locals.user.token = token;
    next();
  } catch (err) {
    error = "AUTHORIZEERROR";
    next(error);
  }
};
