#!/bin/sh
set -e

cd "$(git rev-parse --show-toplevel)"

printf "> Running portal deployment...\n"

printf "> Building React app\n"
npm run build

printf "> Restarting PM2 service portal-prod\n"
if pm2 describe portal-prod > /dev/null 2>&1; then
  pm2 restart portal-prod
else
  pm2 start serve --name portal-prod -- -s build -l 3000
fi

printf "> Deployment complete\n"
