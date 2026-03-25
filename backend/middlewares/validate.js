const { validationResult } = require("express-validator");

const AppError = require("../utils/appError");

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return next(
      new AppError(
        "Validation failed",
        400,
        errors.array().map((error) => ({
          field: error.path,
          message: error.msg,
          value: error.value,
        }))
      )
    );
  };
};

module.exports = {
  validate,
};
