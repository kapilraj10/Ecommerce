const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword, verifyEmail, resendVerification } = require("../controllers/passwordResetController");
const { authenticateUser } = require("../middleware/auth");

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", authenticateUser, resendVerification);

module.exports = router;
