const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail({ to, subject, html }) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async sendVerificationEmail(email, token) {
    const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    return this.sendEmail({
      to: email,
      subject: "Verify Your Email - E-Shop Nepal",
      html: `
        <div style="max-width:600px;margin:0 auto;padding:20px;font-family:sans-serif;">
          <h2 style="color:#2563eb;">Verify Your Email</h2>
          <p>Thank you for registering. Please click the button below to verify your email address.</p>
          <a href="${url}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0;">Verify Email</a>
          <p style="color:#666;font-size:14px;">If the button doesn't work, copy and paste this link: ${url}</p>
          <p style="color:#666;font-size:14px;">This link expires in 24 hours.</p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email, token) {
    const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    return this.sendEmail({
      to: email,
      subject: "Reset Your Password - E-Shop Nepal",
      html: `
        <div style="max-width:600px;margin:0 auto;padding:20px;font-family:sans-serif;">
          <h2 style="color:#2563eb;">Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to set a new password.</p>
          <a href="${url}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;margin:16px 0;">Reset Password</a>
          <p style="color:#666;font-size:14px;">If the button doesn't work, copy and paste this link: ${url}</p>
          <p style="color:#666;font-size:14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
  }
}

module.exports = new EmailService();
