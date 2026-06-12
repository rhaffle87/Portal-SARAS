# Deploy to VM 208

## Step-by-step

```bash
# 1. SSH into VM 208
ssh portal@100.123.192.3

# 2. Go to the project directory
cd /home/portal/Portal-SARAS

# 3. Pull latest changes
git fetch origin
git reset --hard origin/main
git clean -fd

# 4. Install dependencies
npm install

# 5. Build the frontend (no env vars needed — health API is same-origin)
npm run build

# 6. Stop the old portal process and start the new one
pm2 stop portal-prod 2>/dev/null
pm2 delete portal-prod 2>/dev/null
pm2 start ecosystem.config.js --only portal-prod

# 7. Verify it's running
pm2 status
pm2 logs portal-prod --lines 5

# 8. Quick health check test (from the VM itself)
curl -s http://localhost:3000/api/health/sso | head
curl -s http://localhost:3000/api/health/moodle | head
```

## What changed

The portal now runs a combined Express server (`scripts/portal-server.js`) instead of `serve -s build`. This server:

1. **Serves static files** from `build/` (same as before)
2. **Provides `/api/health/:key`** — a server-side health check that makes real HTTP requests to each service's internal IP

This fixes the "all services show online" bug. The old `fetch(url, { mode: 'no-cors' })` browser-side check could not read HTTP status codes, so reverse proxy 502/503 error pages looked like successful responses.

## Verifying the fix

After deploying, open the portal in your browser and check the **Status Layanan** section:
- **SSO** should show **Online** (green) — it's the only running service
- **All others** should show **Offline** (red) — they're not actually running

You can also test individual services from the VM:
```bash
# Should return {"status":"online", ...}
curl -s http://localhost:3000/api/health/sso

# Should return {"status":"offline", ...}
curl -s http://localhost:3000/api/health/moodle
```