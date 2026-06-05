const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.DEPLOY_SERVER_PORT || 4000;
const TOKEN = process.env.DEPLOY_TOKEN || 'changeme';

app.use(bodyParser.json());

// Simple CORS for local admin UI
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Deploy-Token');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/status', (req, res) => {
  res.json({ status: 'ok', service: 'deploy-trigger' });
});

app.post('/deploy', (req, res) => {
  const incoming = req.headers['x-deploy-token'] || req.headers['x-deploy-token'.toLowerCase()];
  if (!incoming || incoming !== TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // Run deploy script
  const sh = spawn('sh', ['./scripts/deploy.sh'], { env: process.env });

  let output = '';
  sh.stdout.on('data', (data) => {
    output += data.toString();
  });
  sh.stderr.on('data', (data) => {
    output += data.toString();
  });
  sh.on('close', (code) => {
    res.json({ exitCode: code, output });
  });
});

app.listen(PORT, () => {
  console.log(`Deploy trigger listening on port ${PORT}`);
});
