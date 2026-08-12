# MUBI — React Portfolio

Black & yellow “memory” aesthetic portfolio — Vite + React + React Router, with a live contact form via **Nodemailer + Gmail SMTP**.

## Stack

- **Frontend:** Vite, React, React Router, Three.js, CSS (design system + CSS modules for contact UI)
- **Local API:** Express (`server/`) — used in development
- **Production API:** Netlify Function (`netlify/functions/contact.js`) — same mail logic
- **Email:** Nodemailer → Gmail SMTP → `taiwomubarak63@gmail.com` (reply-to = visitor)

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
4. Site settings → **Environment variables** — add the same as `.env`:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `CONTACT_TO`
5. Deploy

`/api/contact` is redirected to the Netlify Function. SPA routes (`/about`, `/contact`, …) fall back to `index.html`.

## Design preserved

Preloader, custom cursor, grain/vignette, yellow hover stains, marquee, bouncing profile, Three.js hero, skills orbit, and handshake-gated contact — all kept.

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Express API + Vite client together |
| `npm run server` | API only |
| `npm run dev:client` | Vite only |
| `npm run build` | Production build → `dist/` |
