const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const BlacklistedToken = require("../models/BlacklistedToken");
const AppError = require("../utils/AppError");

// --------------- Token helpers ---------------

const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "15m",
  });

const generateRefreshToken = async (userId) => {
  const raw = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await RefreshToken.create({ user: userId, token: raw, expiresAt });
  return raw;
};

const buildAuthPayload = async (user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = await generateRefreshToken(user._id);

  return {
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

// --------------- Public methods ---------------

exports.register = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new AppError("Email already registered", 409);
  }

  const user = await User.create({ name, email, password });
  return buildAuthPayload(user);
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  return buildAuthPayload(user);
};

exports.refresh = async (refreshTokenValue) => {
  if (!refreshTokenValue) {
    throw new AppError("Refresh token is required", 400);
  }

  const stored = await RefreshToken.findOne({ token: refreshTokenValue });
  if (!stored) {
    throw new AppError("Invalid refresh token", 401);
  }

  if (stored.expiresAt < new Date()) {
    await stored.deleteOne();
    throw new AppError("Refresh token expired — please log in again", 401);
  }

  const user = await User.findById(stored.user);
  if (!user) {
    await stored.deleteOne();
    throw new AppError("User no longer exists", 401);
  }

  // Rotate: delete old, issue new pair
  await stored.deleteOne();
  return buildAuthPayload(user);
};

exports.logout = async (accessToken, refreshTokenValue) => {
  // Blacklist the current access token until it naturally expires
  if (accessToken) {
    try {
      const decoded = jwt.decode(accessToken);
      if (decoded && decoded.exp) {
        await BlacklistedToken.create({
          token: accessToken,
          expiresAt: new Date(decoded.exp * 1000),
        });
      }
    } catch {
      // If token is malformed, just skip blacklisting
    }
  }

  // Remove refresh token from DB
  if (refreshTokenValue) {
    await RefreshToken.findOneAndDelete({ token: refreshTokenValue });
  }
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  // Invalidate all existing refresh tokens for this user
  await RefreshToken.deleteMany({ user: userId });

  // Issue a fresh token pair so user stays logged in
  return buildAuthPayload(user);
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};
