import type { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { validateContactPayload } from '../../shared/contact.js';
import { assertMailEnv, sendContactMail, smtpErrorPayload } from '../../server/mail.js';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 8;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(event: HandlerEvent): string {
  const forwarded = event.headers['x-forwarded-for'] || event.headers['X-Forwarded-For'];
  if (typeof forwarded === 'string' && forwarded.length) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return event.headers['client-ip'] || event.headers['x-nf-client-connection-ip'] || 'unknown';
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now > row.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  row.count += 1;
  return row.count > MAX_HITS;
}

function allowedOrigins(): string[] {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

function corsHeaders(origin?: string): Record<string, string> {
  const list = allowedOrigins();
  const allow =
    origin && (list.length === 0 || list.includes(origin) || list.includes('*'))
      ? origin
      : list[0] || '';

  return {
    'Access-Control-Allow-Origin': allow || 'null',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
    'X-Content-Type-Options': 'nosniff',
  };
}

function json(
  statusCode: number,
  body: unknown,
  origin?: string,
): HandlerResponse {
  return {
    statusCode,
    headers: {
      ...corsHeaders(origin),
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  };
}

export const handler: Handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin;

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(origin),
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' }, origin);
  }

  const list = allowedOrigins();
  if (list.length > 0 && origin && !list.includes(origin) && !list.includes('*')) {
    return json(403, { error: 'Origin not allowed.' }, origin);
  }

  const ip = clientIp(event);
  if (rateLimited(ip)) {
    return json(429, { error: 'Too many messages. Try again later.' }, origin);
  }

  const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
  if (!String(contentType).includes('application/json')) {
    return json(415, { error: 'Content-Type must be application/json.' }, origin);
  }

  try {
    let body: unknown = {};
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return json(400, { error: 'Invalid JSON body.' }, origin);
    }

    const parsed = validateContactPayload(body);

    if (!parsed.ok && parsed.code === 'HONEYPOT') {
      return json(200, { ok: true, message: 'Message sent.' }, origin);
    }

    if (!parsed.ok) {
      return json(400, { error: parsed.error }, origin);
    }

    assertMailEnv();
    await sendContactMail(parsed.data);
    return json(200, { ok: true, message: 'Message sent.' }, origin);
  } catch (err) {
    console.error('[netlify contact]', err instanceof Error ? err.message : err);
    const payload = smtpErrorPayload(err);
    return json(500, payload, origin);
  }
};
