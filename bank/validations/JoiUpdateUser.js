const Joi = require("joi");

module.exports = (params) => {
  const updateUserRules = Joi.object({
    firstName: Joi.string().error(new Error("First name should be a string")),
    lastName: Joi.string().error(new Error("Last name should be a string")),
    email: Joi.string().email().error(new Error("Email should be a string")),
    password: Joi.string().error(new Error("Password name should be a string")),
  });
  const { error } = updateUserRules.validate(params);
  if (error) {
    throw new Error(error.message);
  }
};
