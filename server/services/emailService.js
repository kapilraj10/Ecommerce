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

  async sendWelcomeEmail(email, name) {
    return this.sendEmail({
      to: email,
      subject: "Welcome to TEKORA - Your Account is Ready",
      html: `
        <div style="max-width:600px;margin:0 auto;padding:24px;font-family:sans-serif;background:#f8fafc;">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:32px;text-align:center;">
            <h1 style="color:#0f172a;margin:0 0 4px;font-size:28px;letter-spacing:1px;">TEKORA</h1>
            <p style="color:#94a3b8;font-size:11px;letter-spacing:2px;margin:0 0 24px;text-transform:uppercase;">Technology. Simplified.</p>
            <h2 style="color:#0f172a;margin:0 0 12px;">Welcome, ${name}! ⚡</h2>
            <p style="color:#64748b;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Your account has been created successfully. You now have access to exclusive deals,
              order tracking, and effortless checkout with TEKORA.
            </p>
            <a href="${process.env.CLIENT_URL}/products" style="display:inline-block;padding:14px 32px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:12px;font-weight:bold;font-size:15px;">Start Shopping</a>
            <p style="color:#94a3b8;font-size:13px;margin:24px 0 0;">
              Tech news, deals &amp; tips straight to your inbox - simplified for you.
            </p>
          </div>
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin:24px 0 0;">&copy; ${new Date().getFullYear()} TEKORA. All rights reserved.</p>
        </div>
      `,
    });
  }

  async sendOrderConfirmationEmail(email, { name, orderId, items = [], subtotal = 0, shippingCost = 0, totalPrice = 0, paymentMethod = "", shippingAddress = {} }) {
    const itemsHtml = items
      .map(
        (item) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
              <div style="display:flex;align-items:center;gap:10px;">
                ${item.image ? `<img src="${item.image}" alt="" style="width:40px;height:40px;border-radius:8px;object-fit:cover;" />` : ""}
                <span style="color:#334155;font-size:14px;font-weight:600;">${item.name}</span>
              </div>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:center;color:#64748b;font-size:14px;">x${item.quantity}</td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:right;color:#334155;font-size:14px;font-weight:600;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
          </tr>
        `
      )
      .join("");

    return this.sendEmail({
      to: email,
      subject: `🎉 Order Confirmed - TEKORA (Order #${orderId})`,
      html: `
        <div style="max-width:600px;margin:0 auto;padding:24px;font-family:sans-serif;background:#f8fafc;">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:32px;">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="color:#0f172a;margin:0 0 4px;font-size:26px;letter-spacing:1px;">TEKORA</h1>
              <p style="color:#94a3b8;font-size:11px;letter-spacing:2px;margin:0;text-transform:uppercase;">Technology. Simplified.</p>
            </div>
            <div style="text-align:center;padding:12px 0 20px;">
              <span style="font-size:36px;">✅</span>
              <h2 style="color:#16a34a;margin:8px 0 4px;font-size:20px;">Thank you for your order!</h2>
              <p style="color:#64748b;font-size:14px;margin:0;">Hi <strong>${name}</strong>, your order <strong style="color:#0f172a;">#${orderId}</strong> has been confirmed.</p>
              <p style="color:#64748b;font-size:13px;margin:8px 0 0;">
                Payment: <strong style="color:#334155;text-transform:uppercase;">${paymentMethod}</strong>
                ${paymentMethod === "COD" ? "· Pay cash on delivery" : ""}
              </p>
            </div>

            <table style="width:100%;border-collapse:collapse;margin:8px 0 24px;">
              <thead>
                <tr>
                  <th style="text-align:left;font-size:12px;color:#94a3b8;padding-bottom:6px;">Item</th>
                  <th style="text-align:center;font-size:12px;color:#94a3b8;padding-bottom:6px;">Qty</th>
                  <th style="text-align:right;font-size:12px;color:#94a3b8;padding-bottom:6px;">Price</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <div style="background:#f8fafc;border-radius:12px;padding:16px 20px;">
              <div style="display:flex;justify-content:space-between;font-size:13px;color:#64748b;margin-bottom:6px;">
                <span>Subtotal</span><span>Rs. ${Number(subtotal).toLocaleString()}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:13px;color:#64748b;margin-bottom:6px;">
                <span>Shipping</span><span>${shippingCost === 0 ? "Free" : `Rs. ${Number(shippingCost).toLocaleString()}`}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:15px;color:#0f172a;font-weight:800;border-top:1px solid #e2e8f0;padding-top:10px;">
                <span>Total</span><span>Rs. ${Number(totalPrice).toLocaleString()}</span>
              </div>
            </div>

            ${shippingAddress && shippingAddress.address ? `
              <div style="margin-top:20px;font-size:13px;color:#64748b;">
                <p style="margin:0 0 2px;"><strong style="color:#334155;">Shipping to:</strong> ${shippingAddress.fullName || ""}</p>
                <p style="margin:0;">${shippingAddress.address || ""}, ${shippingAddress.city || ""}, ${shippingAddress.district || ""}</p>
              </div>
            ` : ""}

            <div style="text-align:center;margin-top:24px;">
              <a href="${process.env.CLIENT_URL}/my-orders" style="display:inline-block;padding:14px 32px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:12px;font-weight:bold;font-size:15px;">Track Your Order</a>
            </div>
          </div>
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin:24px 0 0;">
            &copy; ${new Date().getFullYear()} TEKORA. All rights reserved.<br />
            Gyaneshwor, Kathmandu, Nepal | +977-9869852053
          </p>
        </div>
      `,
    });
  }

  async sendOrderStatusEmail(email, { name, orderId, status, note = "", items = [], totalPrice = 0, shippingAddress = {} }) {
    const statusMeta = {
      Processing: { icon: "⚙️", color: "#3b82f6", title: "Your order is being processed" },
      Shipped: { icon: "🚚", color: "#2563eb", title: "Your order is on the way!" },
      Delivered: { icon: "✅", color: "#16a34a", title: "Your order has been delivered" },
      Cancelled: { icon: "❌", color: "#ef4444", title: "Your order has been cancelled" },
    };

    const meta = statusMeta[status] || { icon: "📦", color: "#2563eb", title: "Order update" };

    const itemsHtml = items
      .map(
        (item) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
              <div style="display:flex;align-items:center;gap:10px;">
                ${item.image ? `<img src="${item.image}" alt="" style="width:40px;height:40px;border-radius:8px;object-fit:cover;" />` : ""}
                <span style="color:#334155;font-size:14px;font-weight:600;">${item.name}</span>
              </div>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:center;color:#64748b;font-size:14px;">x${item.quantity}</td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:right;color:#334155;font-size:14px;font-weight:600;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
          </tr>
        `
      )
      .join("");

    return this.sendEmail({
      to: email,
      subject: `${meta.icon} Order ${status} - TEKORA (Order #${orderId})`,
      html: `
        <div style="max-width:600px;margin:0 auto;padding:24px;font-family:sans-serif;background:#f8fafc;">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:32px;">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="color:#0f172a;margin:0 0 4px;font-size:26px;letter-spacing:1px;">TEKORA</h1>
              <p style="color:#94a3b8;font-size:11px;letter-spacing:2px;margin:0;text-transform:uppercase;">Technology. Simplified.</p>
            </div>
            <div style="text-align:center;padding:12px 0 20px;">
              <span style="font-size:36px;">${meta.icon}</span>
              <h2 style="color:${meta.color};margin:8px 0 4px;font-size:20px;">${meta.title}</h2>
              <p style="color:#64748b;font-size:14px;margin:4px 0 0;">Hi <strong>${name}</strong>,</p>
              <p style="color:#64748b;font-size:14px;margin:4px 0 0;">Order #<strong style="color:#0f172a;">${orderId}</strong> has been updated to <strong style="color:${meta.color};text-transform:uppercase;">${status}</strong>.</p>
              ${note ? `<p style="color:#475569;font-size:13px;margin:8px 0 0;font-style:italic;">"${note}"</p>` : ""}
            </div>

            ${items.length ? `
              <table style="width:100%;border-collapse:collapse;margin:8px 0 24px;">
                <thead>
                  <tr>
                    <th style="text-align:left;font-size:12px;color:#94a3b8;padding-bottom:6px;">Item</th>
                    <th style="text-align:center;font-size:12px;color:#94a3b8;padding-bottom:6px;">Qty</th>
                    <th style="text-align:right;font-size:12px;color:#94a3b8;padding-bottom:6px;">Price</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>
            ` : ""}

            <div style="background:#f8fafc;border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;">
              <span style="color:#64748b;font-size:14px;">Total</span>
              <span style="color:#0f172a;font-size:16px;font-weight:800;">Rs. ${Number(totalPrice).toLocaleString()}</span>
            </div>

            ${shippingAddress && shippingAddress.address ? `
              <div style="margin-top:20px;font-size:13px;color:#64748b;">
                <p style="margin:0 0 2px;"><strong style="color:#334155;">Shipping to:</strong> ${shippingAddress.fullName || ""}</p>
                <p style="margin:0;">${shippingAddress.address || ""}, ${shippingAddress.city || ""}, ${shippingAddress.district || ""}</p>
              </div>
            ` : ""}

            <div style="text-align:center;margin-top:24px;">
              <a href="${process.env.CLIENT_URL}/my-orders" style="display:inline-block;padding:14px 32px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:12px;font-weight:bold;font-size:15px;">Track Your Order</a>
            </div>
          </div>
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin:24px 0 0;">
            &copy; ${new Date().getFullYear()} TEKORA. All rights reserved.<br />
            Gyaneshwor, Kathmandu, Nepal | +977-9869852053
          </p>
        </div>
      `,
    });
  }
}

module.exports = new EmailService();
