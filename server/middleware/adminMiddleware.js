const AppError = require("../utils/AppError");

/**
 * Restrict access to admin users only.
 * Must be used AFTER authMiddleware.protect so req.user exists.
 */
const admin = (req, _res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Admin access only", 403));
  }
  next();
};

module.exports = { admin };
