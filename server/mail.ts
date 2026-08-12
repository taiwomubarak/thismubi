import nodemailer from 'nodemailer';
import type { ContactData } from '../shared/contact.js';
import { escapeHtml } from '../shared/contact.js';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
}

/** Gmail App Passwords are often copied with spaces — strip them. */
function gmailAppPassword(): string {
  return requireEnv('GMAIL_APP_PASSWORD').replace(/\s+/g, '');
}

export function assertMailEnv(): void {
  requireEnv('GMAIL_USER');
  gmailAppPassword();
}

export function createTransporter() {
  const user = requireEnv('GMAIL_USER');
  const pass = gmailAppPassword();

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export async function sendContactMail({ name, email, message }: ContactData): Promise<void> {
  const user = requireEnv('GMAIL_USER');
  const to = (process.env.CONTACT_TO || 'taiwomubarak63@gmail.com').trim();
  const transporter = createTransporter();

  // Verify SMTP auth early for clearer Netlify logs
  await transporter.verify();

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
    subject: `Portfolio contact from ${name}`.slice(0, 200),
    text,
    html,
  });
}

export function smtpErrorPayload(err: unknown): { error: string; code: string } {
  const message = err instanceof Error ? err.message : String(err);
  if (/Missing required env var/i.test(message)) {
    return {
      error: 'Server email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD on Netlify.',
      code: 'SMTP_ENV',
    };
  }
  if (/Invalid login|EAUTH|Username and Password not accepted|BadCredentials/i.test(message)) {
    return {
      error: 'Gmail rejected the App Password. Create a new App Password and update Netlify env.',
      code: 'SMTP_AUTH',
    };
  }
  return {
    error: 'Could not send message. Check SMTP credentials and try again.',
    code: 'SMTP_FAIL',
  };
}
