module.exports = {
  apps: [
    {
      name: 'portal-prod',
      script: 'serve',
      args: '-s build -l 3000',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        // Concrete backend API URL baked into the build when deploy script runs
        REACT_APP_BACKEND_API_URL: 'https://api.s4ras.site'
      }
    }
    ,
    {
      name: 'deploy-trigger',
      script: 'node',
      args: 'scripts/deploy-server.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        // Set DEPLOY_TOKEN in your environment before starting PM2
        DEPLOY_TOKEN: process.env.DEPLOY_TOKEN || '',
        DEPLOY_SERVER_PORT: 4000
      }
    }
  ]
};
