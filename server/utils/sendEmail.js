const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

const sendVerificationEmail = async (to, verifyUrl, name) => {
  const t = getTransporter();
  await t.sendMail({
    from: `"Portfolio Builder" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: 'Verify your email - Portfolio Builder',
    html: `
      <div style="font-family:system-ui;max-width:450px;margin:0 auto;padding:32px;background:#111118;border-radius:16px;color:#e2e8f0;">
        <h2 style="color:#a78bfa;margin:0 0 8px;">Welcome, ${name || 'there'}!</h2>
        <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">Click the button below to verify your email and activate your portfolio:</p>
        <a href="${verifyUrl}" style="display:block;text-align:center;background:#7c3aed;color:white;font-size:16px;font-weight:bold;padding:14px 24px;border-radius:12px;text-decoration:none;">
          Verify My Email
        </a>
        <p style="color:#64748b;font-size:12px;margin:24px 0 0;">This link expires in 1 hour. If you didn't register, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail };
