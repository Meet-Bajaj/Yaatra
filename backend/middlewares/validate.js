const { validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations in the array
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  };
};

module.exports = { validate };
