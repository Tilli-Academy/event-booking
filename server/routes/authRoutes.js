const router = require("express").Router();
const {
  register,
  login,
  refresh,
  logout,
  changePassword,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");

// Public — rate-limited
router.post(
  "/register",
  authLimiter,
  validate({
    name: { required: true, label: "Name" },
    email: { required: true, match: /^\S+@\S+\.\S+$/, label: "Email" },
    password: { required: true, minLength: 6, label: "Password" },
  }),
  register
);

router.post(
  "/login",
  authLimiter,
  validate({
    email: { required: true, label: "Email" },
    password: { required: true, label: "Password" },
  }),
  login
);

// Public — refresh token rotation
router.post(
  "/refresh",
  validate({
    refreshToken: { required: true, label: "Refresh token" },
  }),
  refresh
);

// Protected
router.post("/logout", protect, logout);

router.put(
  "/change-password",
  protect,
  validate({
    currentPassword: { required: true, label: "Current password" },
    newPassword: { required: true, minLength: 6, label: "New password" },
  }),
  changePassword
);

router.get("/me", protect, getMe);

module.exports = router;
