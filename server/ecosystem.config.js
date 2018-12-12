module.exports = {
  apps: [
    {
      name: 'BidOrBoo',
      script: './index.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      // args: 'one two',
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '512MB',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
