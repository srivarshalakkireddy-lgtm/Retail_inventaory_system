const Joi = require('joi');
const { errorResponse } = require('../utils/response');

/**
 * Validation middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return errorResponse(res, 'Validation error', 400, errors);
    }

    next();
  };
};

module.exports = validate;
