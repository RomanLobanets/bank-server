module.exports = (err, req, res, next) => {
  let code = 200;
  let error = null;
  switch (err) {
    case "VALIDATIONERROR":
      code = 406;
      error = { code: err, message: res.locals.errorMessage };
      break;
    case "SIGNINERROR":
      res
        .status(406)
        .json({ error: { code: err, message: res.locals.errorMessage } });
      break;
    case "AUTHORIZEERROR":
      res
        .status(401)
        .json({ error: { code: err, message: res.locals.errorMessage } });
      break;
    case "UPDATEUSERERROR":
      res
        .status(406)
        .json({ error: { code: err, message: res.locals.errorMessage } });
      break;
    case "USERNOTVERIFIED":
      res
        .status(401)
        .json({ error: { code: err, message: "User is not verified" } });
      break;
    case "WRONGPASSWORD":
      res.status(401).json({ error: { code: err, message: "Wrong password" } });
    default:
      next();
  }
  res.status(code).json({ error });
};
