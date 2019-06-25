module.exports = {
  apps: [
    {
      name: 'BidOrBoo',
      script: './index.js',
      watch: true,
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      // args: 'one two',
      instances: 5,
      autorestart: true,
      max_restarts: 5,
      max_memory_restart: '600M',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
