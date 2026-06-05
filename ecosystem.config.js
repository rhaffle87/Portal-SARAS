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
        // Use existing env value if set, otherwise default to the API host placeholder
        REACT_APP_BACKEND_API_URL: process.env.REACT_APP_BACKEND_API_URL || 'https://api.s4ras.site'
      }
    }
  ]
};
