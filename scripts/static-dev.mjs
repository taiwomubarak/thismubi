import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../dist');
const PORT = Number(process.env.PORT) || 8080;
const API = process.env.API_URL || 'http://127.0.0.1:3001';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function send(res, status, body, type = 'text/plain') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

async function proxyApi(req, res) {
  const url = API + req.url;
  const headers = { ...req.headers, host: new URL(API).host };
  delete headers['content-length'];

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);

  try {
    const upstream = await fetch(url, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
    });
    const buf = Buffer.from(await upstream.arrayBuffer());
    const outHeaders = {};
    upstream.headers.forEach((v, k) => {
      if (k.toLowerCase() === 'transfer-encoding') return;
      outHeaders[k] = v;
    });
    res.writeHead(upstream.status, outHeaders);
    res.end(buf);
  } catch (err) {
    send(res, 502, `API proxy error: ${err.message}`);
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/')) {
    return proxyApi(req, res);
  }

  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  let filePath = path.join(root, urlPath === '/' ? 'index.html' : urlPath);

  if (!filePath.startsWith(root)) {
    return send(res, 403, 'Forbidden');
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(root, 'index.html');
  }

  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, types[ext] || 'application/octet-stream');
  } catch {
    send(res, 404, 'Not found');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`MUBI frontend: http://127.0.0.1:${PORT}`);
});
