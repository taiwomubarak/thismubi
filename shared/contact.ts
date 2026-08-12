export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  /** Honeypot — must be empty */
  website?: string;
};

export type ContactData = {
  name: string;
  email: string;
  message: string;
};

export type ValidationResult =
  | { ok: true; data: ContactData }
  | { ok: false; error: string; code?: 'HONEYPOT' | 'VALIDATION' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeText(input: unknown, max: number): string {
  return String(input ?? '')
    .replace(CONTROL_CHARS, '')
    .trim()
    .slice(0, max);
}

export function validateContactPayload(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid request body.', code: 'VALIDATION' };
  }

  const raw = body as Record<string, unknown>;

  // Honeypot: bots fill hidden "website" — silently reject as success-shaped on server
  const honeypot = sanitizeText(raw.website, 200);
  if (honeypot.length > 0) {
    return { ok: false, error: 'Rejected.', code: 'HONEYPOT' };
  }

  const name = sanitizeText(raw.name, 120);
  const email = sanitizeText(raw.email, 200).toLowerCase();
  const message = sanitizeText(raw.message, 5000);

  if (!name || name.length < 2) {
    return { ok: false, error: 'Please enter a valid name.', code: 'VALIDATION' };
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'Please enter a valid email.', code: 'VALIDATION' };
  }
  if (!message || message.length < 5) {
    return {
      ok: false,
      error: 'Please enter a message (5–5000 characters).',
      code: 'VALIDATION',
    };
  }

  return { ok: true, data: { name, email, message } };
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
