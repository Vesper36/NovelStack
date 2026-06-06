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
  ],
};
