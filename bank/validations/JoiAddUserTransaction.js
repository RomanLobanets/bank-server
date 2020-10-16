const Joi = require("joi");

module.exports = (params) => {
  const signInRules = Joi.object({
    longitude: Joi.number().error(new Error("Longitude should be a number")),
    latitude: Joi.number().error(new Error("Latitude should be a number")),
    merchant: Joi.string().error(new Error("Merchant should be a string")),
    amountInCents: Joi.number().error(
      new Error("AmountInCents should be a number")
    ),
  });
  const { error } = signInRules.validate(params);

  if (error) {
    throw new Error(error.message);
  }
};
