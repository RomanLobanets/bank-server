module.exports = (err, req, res, next) => {
  let code = 200;
  let error = null;
  switch (err) {
    case "VALIDATIONERROR":
      code = 406;
      error = { code: err, message: res.locals.errorMessage };
      break;
    case "SIGNINERROR":
      code = 406;
      error = { code: err, message: res.locals.errorMessage };
      break;
    case "AUTHORIZEERROR":
      code = 401;
      error = { code: err, message: res.locals.errorMessage };
      break;
    case "UPDATEUSERERROR":
      code = 406;
      error = { code: err, message: res.locals.errorMessage };
      break;
    case "USERNOTVERIFIED":
      code = 406;
      error = { code: err, message: res.locals.errorMessage };
      break;
    case "WRONGPASSWORD":
      code = 406;
      error = { code: err, message: res.locals.errorMessage };
      break;
    case "SIGNUPERROR":
      code = 406;
      error = { code: err, message: res.locals.errorMessage };
      break;
    case "LOGOUTERROR":
      code = 409;
      error = { code: err, message: res.locals.errorMessage };
      break;
    case "LISTUSERSERROR":
      code = 401;
      error = { code: err, message: res.locals.errorMessage };
      break;
    case "VERIFYEMAIL":
      code = 403;
      error = { code: err, message: res.locals.errorMessage };
      break;
    default:
      next();
  }
  res.status(code).json({ error });
};
