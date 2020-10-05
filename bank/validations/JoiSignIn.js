const Joi = require("joi");

module.exports = (params) => {
  const signInRules = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .error(new Error("Email Is required")),

    password: Joi.string().required().error(new Error("Password Is required")),
  });
  const { error } = signInRules.validate(params);

  if (error) {
    throw new Error(error.message);
  }
};
