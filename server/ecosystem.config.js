// http://pm2.keymetrics.io/docs/usage/application-declaration/
// Options reference: http://doc.pm2.io/en/runtime/reference/ecosystem-file/
// args: 'one two',
module.exports = {
  apps: [
    {
      name: 'BIDORBOO',
      script: './index.js',
      watch: false,
      instances: 6,
      exec_mode: 'cluster',
      autorestart: true,
      max_restarts: 3,
      max_memory_restart: '900M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
