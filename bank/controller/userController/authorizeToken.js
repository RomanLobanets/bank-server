const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  // console.log(req);
  const authorizationHeader = req.get("Authorization");
  const token = authorizationHeader.replace("Bearer ", "");
  let userId;
  let error;

  try {
    userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    res.locals.token = token;
    res.locals.userId = userId;
  } catch (err) {
    res.locals.errorMessage = "token doesnt veryfied";
    error = "AUTHORIZEERROR";
  }
  next(error);
};
