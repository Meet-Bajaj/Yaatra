const AppError = require("../utils/appError");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("User context not found for authorization", 403));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }

    return next();
  };
};

module.exports = {
  authorize,
};
