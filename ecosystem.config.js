module.exports = {
  apps: [
    {
      name: 'web-api',
      script: './build/server.js',
      instances: '1',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
