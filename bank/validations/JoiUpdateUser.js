const Joi = require("joi");

module.exports = (params) => {
  const updateUserRules = Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
  });
  const { error } = updateUserRules.validate(params);
  if (error) {
    throw new Error(error.message);
  }
};
