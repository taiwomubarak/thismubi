# MUBI — React + TypeScript Portfolio

Black & yellow “memory” aesthetic portfolio — **Vite + React + TypeScript**, with a live contact form via **Nodemailer + Gmail SMTP**.

## Stack

- **Frontend:** Vite, React, TypeScript, React Router, Three.js, PWA, CSS modules
- **Shared:** `shared/contact.ts` — typed validation used by client + APIs
- **Local API:** Express + Helmet + rate limit (`server/`) via `tsx`
- **Production API:** Netlify Function (`netlify/functions/contact.ts`)
- **Email:** Nodemailer → Gmail SMTP → `taiwomubarak63@gmail.com` (reply-to = visitor)

## Secure contact wiring

- Shared sanitize + validate (length, email, control-char strip)
- Honeypot field (`website`) — bots get fake success
- CORS allowlist via `ALLOWED_ORIGINS`
- Rate limit (8 / 15 min per IP)
- JSON Content-Type enforcement
- Helmet (local API) + `nosniff` headers (Netlify)
- HTML escaped in email body
- Secrets only via env (never committed)

## Run locally

```bash
cp .env.example .env
# fill GMAIL_USER + GMAIL_APP_PASSWORD (see guide below)

npm install
npm run dev
```

- Site: http://localhost:5173  
- API: http://localhost:3001 (`/api/contact` proxied by Vite)

## Gmail App Password setup

Gmail blocks normal passwords for SMTP. Use an **App Password**.

1. Open [Google Account → Security](https://myaccount.google.com/security)
2. Turn on **2-Step Verification** (required)
3. Search for **App passwords** (or visit [App passwords](https://myaccount.google.com/apppasswords))
4. Create one:
   - App: **Mail**
   - Device: **Other** → name it `MUBI Portfolio`
5. Copy the **16-character** password
6. Put it in `.env`:

```env
GMAIL_USER=taiwomubarak63@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
CONTACT_TO=taiwomubarak63@gmail.com
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080
```

7. Restart `npm run dev`

Messages are sent **from** `GMAIL_USER`, **to** `CONTACT_TO`, with the visitor’s email as **Reply-To**.

## Deploy on Netlify

1. Push this repo to GitHub
2. New Netlify site → import the repo
3. Build settings (already in `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
4. Site settings → **Environment variables**:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `CONTACT_TO`
   - `ALLOWED_ORIGINS` = `https://your-site.netlify.app` (and custom domain if any)
5. Deploy

`/api/contact` is redirected to the Netlify Function. SPA routes fall back to `index.html`.

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Express API + Vite client together |
| `npm run server` | Typed API only (`tsx`) |
| `npm run dev:client` | Vite only |
| `npm run typecheck` | `tsc` frontend + server |
| `npm run build` | Typecheck + production build → `dist/` |
