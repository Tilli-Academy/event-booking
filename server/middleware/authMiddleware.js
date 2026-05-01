const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Verify JWT access token from Authorization header.
 * Attaches the full user document to req.user.
 */
const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Not authorized — no token provided", 401);
  }

  const token = header.split(" ")[1];

  // Check blacklist (logged-out tokens)
  const BlacklistedToken = require("../models/BlacklistedToken");
  const blacklisted = await BlacklistedToken.findOne({ token });
  if (blacklisted) {
    throw new AppError("Token has been revoked — please log in again", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Token expired — please refresh or log in again", 401);
    }
    throw new AppError("Not authorized — invalid token", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError("User belonging to this token no longer exists", 401);
  }

  // Check if password was changed after the token was issued
  if (user.passwordChangedAt) {
    const changedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
    if (decoded.iat < changedTimestamp) {
      throw new AppError("Password recently changed — please log in again", 401);
    }
  }

  req.user = user;
  next();
});

module.exports = { protect };
