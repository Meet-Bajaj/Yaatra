const User = require("../models/users");
const asyncHandler = require("./asyncHandler");
const AppError = require("../utils/appError");
const { verifyToken } = require("../utils/jwt");

const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization || "";
  if (!authorization.startsWith("Bearer ")) {
    throw new AppError("Authentication token is required", 401);
  }

  const token = authorization.split(" ")[1];
  const decoded = verifyToken(token);

  const user = await User.findById(decoded.id).select("-password");
  if (!user || !user.isActive || user.isDeleted) {
    throw new AppError("Authenticated user was not found", 401);
  }

  req.user = user;
  next();
});

module.exports = {
  protect,
};
