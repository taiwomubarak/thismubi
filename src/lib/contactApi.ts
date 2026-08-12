import type { ContactPayload } from '@shared/contact';

export type { ContactPayload };
export type ContactSuccess = { ok: true; message: string };
export type ContactError = { error: string };

export async function sendContactMessage(payload: ContactPayload): Promise<ContactSuccess> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = data as ContactError;
    throw new Error(err.error || 'Failed to send message.');
  }

  return data as ContactSuccess;
}
