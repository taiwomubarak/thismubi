import { useState, type FormEvent } from 'react';
import styles from '../styles/ContactForm.module.css';
import { sendContactMessage } from '../lib/contactApi';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
      website: String(formData.get('website') ?? ''),
    };

    setStatus('sending');
    setMessage('');

    try {
      await sendContactMessage(data);

      setStatus('success');
      setMessage('MESSAGE SENT — THANK YOU');
      form.reset();
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 2200);
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Try again.');
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
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px' }}
      />
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
