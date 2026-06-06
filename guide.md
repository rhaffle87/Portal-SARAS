cd /home/portal/Portal-SARAS
git fetch origin
git reset --hard origin/main
git clean -fd


npm install
npm run build