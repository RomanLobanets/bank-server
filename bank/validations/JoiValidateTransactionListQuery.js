const Joi = require("joi");

module.exports = (params) => {
  const signInRules = Joi.object({
    perPage: Joi.number().error(new Error("PerPage should be a number")),
    page: Joi.number().error(new Error("Page should be a number")),
    start: Joi.number().error(new Error("Start should be a number")),
    end: Joi.number().error(new Error("End should be a number")),
    merchant: Joi.string().error(new Error("Merchant should be a string")),
  });
  const { error } = signInRules.validate(params);

  if (error) {
    throw new Error(error.message);
  }
};
