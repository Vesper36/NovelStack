module.exports = {
  apps: [
    {
      name: 'inkweave',
      script: 'node_modules/.bin/next',
      args: 'start -p 51637',
      cwd: '/opt/NovelStack',
      env: {
        NODE_ENV: 'production',
        PORT: '51637',
      },
      max_memory_restart: '512M',
      autorestart: true,
      watch: false,
    },
  ],
};
