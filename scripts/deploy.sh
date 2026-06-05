#!/bin/sh
set -e

cd "$(git rev-parse --show-toplevel)"

printf "> Running portal deployment...\n"

printf "> Building React app\n"
npm run build

printf "> Restarting PM2 service portal-prod\n"
if pm2 describe portal-prod > /dev/null 2>&1; then
  # reload to pick up updated environment variables from ecosystem file
  pm2 startOrReload ecosystem.config.js --env production
else
  pm2 startOrReload ecosystem.config.js --env production
fi

printf "> Deployment complete\n"
