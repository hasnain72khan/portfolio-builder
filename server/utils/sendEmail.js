const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';
const headers = () => ({
  'accept': 'application/json',
  'content-type': 'application/json',
  'api-key': process.env.BREVO_API_KEY,
});
const sender = () => ({ name: 'Portfolio Builder', email: process.env.SMTP_FROM });

const sendEmail = async (to, name, subject, htmlContent) => {
  const res = await fetch(BREVO_URL, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ sender: sender(), to: [{ email: to, name: name || to }], subject, htmlContent }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to send email');
  }
};

const sendVerificationEmail = (to, verifyUrl, name) => sendEmail(to, name,
  'Verify your email - Portfolio Builder',
  `<div style="font-family:system-ui;max-width:450px;margin:0 auto;padding:32px;background:#111118;border-radius:16px;color:#e2e8f0;">
    <h2 style="color:#a78bfa;margin:0 0 8px;">Welcome, ${name || 'there'}!</h2>
    <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">Click below to verify your email and activate your portfolio:</p>
    <a href="${verifyUrl}" style="display:block;text-align:center;background:#7c3aed;color:white;font-size:16px;font-weight:bold;padding:14px 24px;border-radius:12px;text-decoration:none;">Verify My Email</a>
    <p style="color:#64748b;font-size:12px;margin:24px 0 0;">This link expires in 1 hour.</p>
  </div>`
);

const sendResetEmail = (to, resetUrl, name) => sendEmail(to, name,
  'Reset your password - Portfolio Builder',
  `<div style="font-family:system-ui;max-width:450px;margin:0 auto;padding:32px;background:#111118;border-radius:16px;color:#e2e8f0;">
    <h2 style="color:#a78bfa;margin:0 0 8px;">Reset Password</h2>
    <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">Hi ${name || 'there'}, click below to reset your password:</p>
    <a href="${resetUrl}" style="display:block;text-align:center;background:#7c3aed;color:white;font-size:16px;font-weight:bold;padding:14px 24px;border-radius:12px;text-decoration:none;">Reset Password</a>
    <p style="color:#64748b;font-size:12px;margin:24px 0 0;">This link expires in 10 minutes.</p>
  </div>`
);

const sendAnalyticsDigest = (to, name, { views, downloads, contacts, topDay, period }) => sendEmail(to, name,
  `Your Portfolio Week in Review — ${views} views`,
  `<div style="font-family:system-ui;max-width:450px;margin:0 auto;padding:32px;background:#111118;border-radius:16px;color:#e2e8f0;">
    <h2 style="color:#a78bfa;margin:0 0 4px;">Weekly Analytics</h2>
    <p style="color:#64748b;font-size:12px;margin:0 0 24px;">${period}</p>
    <div style="display:flex;gap:12px;margin-bottom:24px;">
      <div style="flex:1;background:rgba(124,58,237,0.1);border-radius:12px;padding:16px;text-align:center;">
        <p style="font-size:28px;font-weight:800;color:#a78bfa;margin:0;">${views}</p>
        <p style="font-size:11px;color:#64748b;margin:4px 0 0;">Views</p>
      </div>
      <div style="flex:1;background:rgba(59,130,246,0.1);border-radius:12px;padding:16px;text-align:center;">
        <p style="font-size:28px;font-weight:800;color:#60a5fa;margin:0;">${downloads}</p>
        <p style="font-size:11px;color:#64748b;margin:4px 0 0;">Downloads</p>
      </div>
      <div style="flex:1;background:rgba(16,185,129,0.1);border-radius:12px;padding:16px;text-align:center;">
        <p style="font-size:28px;font-weight:800;color:#6ee7b7;margin:0;">${contacts}</p>
        <p style="font-size:11px;color:#64748b;margin:4px 0 0;">Contacts</p>
      </div>
    </div>
    ${topDay ? `<p style="color:#94a3b8;font-size:13px;">📈 Best day: <strong style="color:#e2e8f0;">${topDay.date}</strong> with <strong style="color:#a78bfa;">${topDay.count} views</strong></p>` : ''}
  </div>`
);

module.exports = { sendVerificationEmail, sendResetEmail, sendAnalyticsDigest };
