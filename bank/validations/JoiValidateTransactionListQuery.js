const Joi = require("joi");

module.exports = (params) => {
  const signInRules = Joi.object({
    perPage: Joi.number().error(new Error("number is required")),
    page: Joi.number().error(new Error("number is required")),
    start: Joi.number().error(new Error("number is required")),
    end: Joi.number().error(new Error("number is required")),
    merchant: Joi.string().error(new Error("string is required")),
  });
  const { error } = signInRules.validate(params);

  if (error) {
    throw new Error(error.message);
  }
};
