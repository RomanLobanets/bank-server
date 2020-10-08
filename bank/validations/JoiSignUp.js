const Joi = require("joi");

module.exports = (params) => {
  const createSignUpRules = Joi.object({
    firstName: Joi.string()
      .required()
      .error(new Error("First name Is required")),
    lastName: Joi.string().required().error(new Error("Last name Is required")),
    email: Joi.string()
      .email()
      .required()
      .error(new Error("Email Is required")),
    password: Joi.string().required().error(new Error("password Is required")),
  });
  const { error } = createSignUpRules.validate(params);
  if (error) {
    throw new Error(error.message);
  }
};
