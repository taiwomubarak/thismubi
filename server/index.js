import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sendContactMail, validateContactPayload } from './mail.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  try {
    const parsed = validateContactPayload(req.body);
    if (!parsed.ok) {
      return res.status(400).json({ error: parsed.error });
    }

    await sendContactMail(parsed.data);
    return res.status(200).json({ ok: true, message: 'Message sent.' });
  } catch (err) {
    console.error('[contact]', err);
    return res.status(500).json({
      error: 'Could not send message. Check SMTP credentials and try again.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`MUBI API listening on http://localhost:${PORT}`);
});
