const Joi = require("joi");

module.exports = (params) => {
  const createSignUpRules = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  const { error } = createSignUpRules.validate(params);
  if (error) {
    throw new Error(error.message);
  }
};
