// http://pm2.keymetrics.io/docs/usage/application-declaration/
// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
// args: 'one two',
module.exports = {
  apps: [
    {
      name: 'BidOrBoo',
      script: './index.js',
      watch: true,
      instances: 6,
      autorestart: true,
      max_restarts: 5,
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
