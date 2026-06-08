module.exports = {
  apps: [
    {
      name: 'inkweave',
      script: 'node_modules/.bin/next',
      args: 'start -p 50040',
      cwd: '/opt/NovelStack',
      env: {
        NODE_ENV: 'production',
        PORT: '50040',
      },
      max_memory_restart: '512M',
      autorestart: true,
      watch: false,
    },
    {
      name: 'novelstack-docs',
      script: 'npx',
      args: 'vitepress preview --port 40004',
      cwd: '/opt/docs/lobeam',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '256M',
      autorestart: true,
      watch: false,
    },
    {
      name: 'novelstack-webhook',
      script: 'webhook.js',
      cwd: '/opt/NovelStack',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '128M',
      autorestart: true,
      watch: false,
    },
  ],
};
