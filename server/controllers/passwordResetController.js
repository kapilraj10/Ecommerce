const crypto = require("crypto");
const User = require("../models/User");
const emailService = require("../services/emailService");
const generateToken = require("../utils/generateToken");
const sendResponse = require("../utils/apiResponse");
const AppError = require("../utils/AppError");

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError("Email is required", 400));

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 200, true, "If the email exists, a reset link has been sent");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await user.save({ validateModifiedOnly: true });

    await emailService.sendPasswordResetEmail(user.email, resetToken);

    sendResponse(res, 200, true, "If the email exists, a reset link has been sent");
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) return next(new AppError("All fields are required", 400));
    if (password !== confirmPassword) return next(new AppError("Passwords do not match", 400));
    if (password.length < 6) return next(new AppError("Password must be at least 6 characters", 400));

    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return next(new AppError("Invalid or expired reset token", 400));

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const newToken = generateToken(user._id);

    sendResponse(res, 200, true, "Password reset successful", {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: newToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) return next(new AppError("Invalid or expired verification token", 400));

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateModifiedOnly: true });

    sendResponse(res, 200, true, "Email verified successfully");
  } catch (error) {
    next(error);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isEmailVerified) return next(new AppError("Email already verified", 400));

    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateModifiedOnly: true });

    await emailService.sendVerificationEmail(user.email, verifyToken);

    sendResponse(res, 200, true, "Verification email sent");
  } catch (error) {
    next(error);
  }
};
