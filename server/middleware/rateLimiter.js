const rateLimit = require("express-rate-limit");

/**
 * Strict rate limiter for auth endpoints.
 * 10 attempts per 15 minutes per IP — prevents brute-force on login/register.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many authentication attempts — please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter };
