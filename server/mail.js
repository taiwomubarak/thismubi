import nodemailer from 'nodemailer';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function createTransporter() {
  const user = requireEnv('GMAIL_USER');
  const pass = requireEnv('GMAIL_APP_PASSWORD');

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

export function validateContactPayload(body = {}) {
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();

  if (!name || name.length > 120) {
    return { ok: false, error: 'Please enter a valid name.' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return { ok: false, error: 'Please enter a valid email.' };
  }
  if (!message || message.length < 5 || message.length > 5000) {
    return { ok: false, error: 'Please enter a message (5–5000 characters).' };
  }

  return { ok: true, data: { name, email, message } };
}

export async function sendContactMail({ name, email, message }) {
  const user = requireEnv('GMAIL_USER');
  const to = process.env.CONTACT_TO || 'taiwomubarak63@gmail.com';
  const transporter = createTransporter();

  const text = [
    'New message from the MUBI portfolio contact form.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <p><strong>New portfolio contact</strong></p>
      <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
      <strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"MUBI Portfolio" <${user}>`,
    to,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text,
    html,
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
