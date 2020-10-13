const Joi = require("joi");

module.exports = (params) => {
  const signInRules = Joi.object({
    longitude: Joi.number().error(new Error("number is required")),
    latitude: Joi.number().error(new Error("number is required")),
    merchant: Joi.string().error(new Error("string is required")),
    amountInCents: Joi.number().error(new Error("number is required")),
  });
  const { error } = signInRules.validate(params);

  if (error) {
    throw new Error(error.message);
  }
};
