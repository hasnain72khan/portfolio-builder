const sendVerificationEmail = async (to, verifyUrl, name) => {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'Portfolio Builder', email: process.env.SMTP_FROM },
      to: [{ email: to, name: name || to }],
      subject: 'Verify your email - Portfolio Builder',
      htmlContent: `
        <div style="font-family:system-ui;max-width:450px;margin:0 auto;padding:32px;background:#111118;border-radius:16px;color:#e2e8f0;">
          <h2 style="color:#a78bfa;margin:0 0 8px;">Welcome, ${name || 'there'}!</h2>
          <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">Click the button below to verify your email and activate your portfolio:</p>
          <a href="${verifyUrl}" style="display:block;text-align:center;background:#7c3aed;color:white;font-size:16px;font-weight:bold;padding:14px 24px;border-radius:12px;text-decoration:none;">
            Verify My Email
          </a>
          <p style="color:#64748b;font-size:12px;margin:24px 0 0;">This link expires in 1 hour. If you didn't register, ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('Brevo API error:', JSON.stringify(err));
    console.error('BREVO_API_KEY set:', !!process.env.BREVO_API_KEY);
    console.error('SMTP_FROM:', process.env.SMTP_FROM);
    throw new Error(err.message || 'Failed to send email');
  }
};

const sendResetEmail = async (to, resetUrl, name) => {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'Portfolio Builder', email: process.env.SMTP_FROM },
      to: [{ email: to, name: name || to }],
      subject: 'Reset your password - Portfolio Builder',
      htmlContent: `
        <div style="font-family:system-ui;max-width:450px;margin:0 auto;padding:32px;background:#111118;border-radius:16px;color:#e2e8f0;">
          <h2 style="color:#a78bfa;margin:0 0 8px;">Reset Password</h2>
          <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">Hi ${name || 'there'}, click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display:block;text-align:center;background:#7c3aed;color:white;font-size:16px;font-weight:bold;padding:14px 24px;border-radius:12px;text-decoration:none;">
            Reset Password
          </a>
          <p style="color:#64748b;font-size:12px;margin:24px 0 0;">This link expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to send email');
  }
};

module.exports = { sendVerificationEmail, sendResetEmail };
