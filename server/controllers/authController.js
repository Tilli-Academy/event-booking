const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const data = await authService.register({ name, email, password });

  res.status(201).json({ success: true, data });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const data = await authService.login({ email, password });

  res.json({ success: true, data });
});

// POST /api/auth/refresh
exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const data = await authService.refresh(refreshToken);

  res.json({ success: true, data });
});

// POST /api/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const { refreshToken } = req.body;

  await authService.logout(accessToken, refreshToken);

  res.json({ success: true, message: "Logged out successfully" });
});

// PUT /api/auth/change-password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const data = await authService.changePassword(req.user._id, currentPassword, newPassword);

  res.json({ success: true, data });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);

  res.json({ success: true, data: user });
});
