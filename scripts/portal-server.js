/**
 * Portal Server — Combined static file server + health-check API.
 *
 * Replaces `serve -s build` so that server-side health checks are available
 * at /api/health/:key on the same origin (no CORS issues, no Nginx changes).
 *
 * The server makes real HTTP requests to internal service IPs to determine
 * whether each service is actually running, avoiding the browser `no-cors`
 * false-positive problem.
 */

const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;
const BUILD_DIR = path.resolve(__dirname, '..', 'build');

// ── Service registry (mirrors src/config/services.js) ──────────────────────
const SERVICES = {
  moodle:  { internal: 'http://192.168.10.203',      public: 'https://moodle.s4ras.site' },
  sso:     { internal: 'http://192.168.10.206:8080',  public: 'https://sso.s4ras.site' },
  cloud:   { internal: 'http://192.168.10.207',       public: 'https://cloud.s4ras.site' },
  iptv:    { internal: 'http://192.168.10.200',       public: 'https://iptv.s4ras.site' },
  voip:    { internal: 'http://192.168.10.201:8080',  public: 'https://voip.s4ras.site' },
  monitor: { internal: 'http://192.168.10.204:3000',  public: 'https://monitor.s4ras.site' },
};

// ── HTTP probe helper ──────────────────────────────────────────────────────
function probe(targetUrl, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const mod = targetUrl.startsWith('https') ? https : http;
    const opts = {
      timeout: timeoutMs,
      // Skip certificate validation for internal HTTPS endpoints
      rejectUnauthorized: false,
    };

    const req = mod.get(targetUrl, opts, (res) => {
      res.resume(); // drain response body
      // 2xx–4xx means the application is responding (even 401/403 = alive)
      // 502/503/504 from a reverse proxy means the upstream is down
      resolve({ reachable: res.statusCode < 500, code: res.statusCode });
    });

    req.on('error',   () => resolve({ reachable: false, code: null }));
    req.on('timeout', () => { req.destroy(); resolve({ reachable: false, code: null }); });
  });
}

// ── Health-check endpoint ──────────────────────────────────────────────────
app.get('/api/health/:key', async (req, res) => {
  const key = req.params.key;
  const service = SERVICES[key];

  if (!service) {
    return res.json({ status: 'unknown', message: 'Service not registered' });
  }

  const start = Date.now();

  // 1) Try internal (LAN) URL first — faster, no TLS overhead
  const internal = await probe(service.internal, 3000);
  if (internal.reachable) {
    return res.json({
      status: 'online',
      message: service.internal,
      latency: Date.now() - start,
    });
  }

  // 2) Fallback to public URL
  const pubStart = Date.now();
  const pub = await probe(service.public, 5000);
  if (pub.reachable) {
    return res.json({
      status: 'online',
      message: service.public,
      latency: Date.now() - pubStart,
    });
  }

  // 3) Both unreachable
  res.json({
    status: 'offline',
    message: `Unreachable (HTTP ${internal.code || pub.code || 'timeout'})`,
    latency: null,
  });
});

// Quick self-check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'portal-health-checker' });
});

// ── Static file serving (SPA mode, replaces `serve -s build`) ──────────────
app.use(express.static(BUILD_DIR));
// Express 5 requires named wildcard params — '*' alone is invalid
app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(BUILD_DIR, 'index.html'));
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Portal server running on port ${PORT} (static + health API)`);
});
