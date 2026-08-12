import { useState } from 'react';
import styles from '../styles/ContactForm.module.css';

export default function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    setStatus('sending');
    setMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || body.message || 'Failed to send message.');
      }

      setStatus('success');
      setMessage('MESSAGE SENT — THANK YOU');
      form.reset();
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 2200);
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Try again.');
    }
  }

  const sending = status === 'sending';
  let buttonText = 'SEND MESSAGE';
  if (sending) buttonText = 'SENDING…';
  else if (status === 'success') buttonText = 'SENT — THANK YOU';

  return (
    <form
      className={`contact-form reveal visible ${styles.form}${sending ? ` ${styles.sending}` : ''}`}
      id="contact-form"
      onSubmit={handleSubmit}
    >
      <div className="form-row">
        <label className="form-field">
          <span className="mono">NAME</span>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            autoComplete="name"
            disabled={sending}
          />
        </label>
        <label className="form-field">
          <span className="mono">EMAIL</span>
          <input
            type="email"
            name="email"
            placeholder="you@studio.com"
            required
            autoComplete="email"
            disabled={sending}
          />
        </label>
      </div>
      <label className="form-field">
        <span className="mono">MESSAGE</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell me what you need built…"
          required
          disabled={sending}
        />
      </label>
      <button type="submit" className="btn btn-yellow" data-hover="" disabled={sending}>
        {buttonText}
      </button>
      {message && (
        <p
          className={`${styles.status} ${
            status === 'success' ? styles.success : status === 'error' ? styles.error : ''
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
