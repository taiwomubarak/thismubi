import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { validateContactPayload } from '../shared/contact.js';
import { assertMailEnv, sendContactMail, smtpErrorPayload } from './mail.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080,https://thismubi.netlify.app')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin / non-browser (no Origin header) for health checks
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error('CORS origin not allowed'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    maxAge: 600,
  }),
);

app.use(express.json({ limit: '16kb' }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Try again later.' },
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.post('/api/contact', contactLimiter, async (req: Request, res: Response) => {
  try {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      return res.status(415).json({ error: 'Content-Type must be application/json.' });
    }

    const parsed = validateContactPayload(req.body);

    // Honeypot: pretend success so bots do not retry
    if (!parsed.ok && parsed.code === 'HONEYPOT') {
      return res.status(200).json({ ok: true, message: 'Message sent.' });
    }

    if (!parsed.ok) {
      return res.status(400).json({ error: parsed.error });
    }

    assertMailEnv();
    await sendContactMail(parsed.data);
    return res.status(200).json({ ok: true, message: 'Message sent.' });
  } catch (err) {
    console.error('[contact]', err instanceof Error ? err.message : err);
    const payload = smtpErrorPayload(err);
    return res.status(500).json(payload);
  }
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err.message === 'CORS origin not allowed') {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }
  console.error('[api]', err);
  return res.status(500).json({ error: 'Server error.' });
});

app.listen(PORT, () => {
  console.log(`MUBI API listening on http://localhost:${PORT}`);
});
