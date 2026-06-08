# VPS 部署指南

完整的 VPS 生产环境部署步骤。本文档基于实际生产环境编写。

## 前置条件

- VPS 服务器（Debian/Ubuntu）
- 域名已解析到 VPS IP
- SSH 访问权限

## 1. 系统准备

```bash
# 更新系统
apt update && apt upgrade -y

# 安装基础工具
apt install -y curl git nginx certbot python3-certbot-nginx
```

## 2. 安装 Node.js 20

```bash
# 添加 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# 安装 Node.js
apt install -y nodejs

# 验证版本
node -v  # >= 20.9.0
npm -v   # >= 9
```

## 3. 安装 PM2

```bash
npm install -g pm2

# 设置开机自启
pm2 startup systemd -u root --hp /root
```

## 4. 克隆项目

```bash
# 创建项目目录
mkdir -p /opt/NovelStack

# 克隆仓库
git clone https://github.com/Vesper36/NovelStack.git /opt/NovelStack
cd /opt/NovelStack
```

## 5. 配置环境变量

```bash
cat > .env.local << 'EOF'
# InkWeave Production Environment

# 前端端口
FRONTEND_PORT=50040
NEXT_PUBLIC_SITE_URL=https://novelstack.demo.vesper36.cc

# 后端 API 端口 (FastAPI, 规划中)
BACKEND_PORT=51638
BACKEND_URL=http://localhost:51638

# Meilisearch 端口 (规划中)
MEILI_PORT=51639
MEILI_HOST=http://localhost:51639
MEILI_API_KEY=

# 数据库
DATABASE_URL=file:./data/inkweave.db
EOF
```

## 6. 安装依赖并构建

```bash
# 安装依赖
npm install

# 创建数据目录
mkdir -p data

# 推送数据库 schema
npm run db:push

# 构建生产版本
npm run build
```

## 7. 配置 PM2

项目已包含 `ecosystem.config.cjs`，定义了三个进程：

```javascript
module.exports = {
  apps: [
    {
      name: "inkweave",              // 主应用
      script: "node_modules/.bin/next",
      args: "start -p 50040",
      cwd: "/opt/NovelStack",
      env: { NODE_ENV: "production", PORT: "50040" },
      max_memory_restart: "512M",
    },
    {
      name: "novelstack-docs",       // 文档站
      script: "npx",
      args: "vitepress preview --port 40004",
      cwd: "/opt/docs/lobeam",
      max_memory_restart: "256M",
    },
    {
      name: "novelstack-webhook",    // 自动部署
      script: "webhook.js",
      cwd: "/opt/NovelStack",
      max_memory_restart: "128M",
    },
  ],
};
```

启动所有进程：

```bash
pm2 start ecosystem.config.cjs
pm2 save
```

## 8. 配置 Nginx

```bash
cat > /etc/nginx/sites-available/novelstack << 'NGINX'
server {
    server_name novelstack.demo.vesper36.cc;
    client_max_body_size 50M;

    # GitHub Webhook
    location /webhook/deploy {
        proxy_pass http://127.0.0.1:51640/deploy;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-GitHub-Delivery $http_x_github_delivery;
        proxy_set_header X-Hub-Signature-256 $http_x_hub_signature_256;
    }

    # 主应用
    location / {
        proxy_pass http://127.0.0.1:50040;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/novelstack.demo.vesper36.cc/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/novelstack.demo.vesper36.cc/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = novelstack.demo.vesper36.cc) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name novelstack.demo.vesper36.cc;
    return 404;
}
NGINX

# 启用站点
ln -sf /etc/nginx/sites-available/novelstack /etc/nginx/sites-enabled/

# 测试并重载
nginx -t && systemctl reload nginx
```

## 9. 配置 SSL

```bash
# 申请 Let's Encrypt 证书
certbot --nginx -d novelstack.demo.vesper36.cc

# 验证自动续期
certbot renew --dry-run
```

## 10. 配置文档站 Nginx

```bash
cat > /etc/nginx/sites-available/lobeam-docs << 'NGINX'
server {
    server_name lobeam.docs.vesper36.cc;
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:40004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/lobeam.docs.vesper36.cc/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lobeam.docs.vesper36.cc/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = lobeam.docs.vesper36.cc) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name lobeam.docs.vesper36.cc;
    return 404;
}
NGINX

ln -sf /etc/nginx/sites-available/lobeam-docs /etc/nginx/sites-enabled/
certbot --nginx -d lobeam.docs.vesper36.cc
```

## 11. 部署文档站

```bash
# 创建文档目录
mkdir -p /opt/docs/lobeam

# 从项目同步文档
rsync -av --exclude node_modules docs/ /opt/docs/lobeam/

# 安装依赖并构建
cd /opt/docs/lobeam
cat > package.json << 'PKG'
{
  "name": "novelstack-docs",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview"
  },
  "devDependencies": {
    "vitepress": "^1.6.4"
  }
}
PKG

npm install
npx vitepress build
```

## 自动更新部署

`deploy.sh` 位于 `/opt/NovelStack/deploy.sh`，一键完成：

```bash
#!/bin/bash
set -e
cd /opt/NovelStack

echo ">>> Pulling latest code..."
git checkout -- .
git pull origin main

echo ">>> Installing dependencies..."
npm install

echo ">>> Pushing database..."
npm run db:push

echo ">>> Building..."
npm run build

echo ">>> Restarting application..."
pm2 restart inkweave

echo ">>> Syncing docs..."
rsync -av --exclude node_modules --exclude .vitepress/dist docs/ /opt/docs/lobeam/

echo ">>> Building docs..."
cd /opt/docs/lobeam
# Ensure ESM compatibility
python3 -c "
import json
with open('package.json') as f:
    d = json.load(f)
d['type'] = 'module'
with open('package.json', 'w') as f:
    json.dump(d, f, indent=2)
    f.write('\n')
"
npm install 2>/dev/null
npx vitepress build

echo ">>> Restarting docs server..."
pm2 restart novelstack-docs

echo ">>> Deployment complete at $(date)"
```

手动执行部署：

```bash
bash /opt/NovelStack/deploy.sh
```

## 故障排查

### 应用无法启动

```bash
# 查看 PM2 日志
pm2 logs inkweave --lines 50

# 检查端口占用
ss -tlnp | grep 50040
```

### 502 Bad Gateway

```bash
# 检查应用是否运行
pm2 status

# 检查端口是否监听
ss -tlnp | grep 50040

# 检查 Nginx 配置
nginx -t
```

### 内存不足

```bash
# 查看内存使用
free -h

# PM2 会自动重启超限进程
# 默认限制: 应用 512MB, 文档 256MB, Webhook 128MB
```

### Webhook 不触发

```bash
# 检查 Webhook 进程
pm2 status novelstack-webhook

# 测试 Webhook
curl -X POST http://localhost:51640/deploy

# 检查 Nginx 代理
curl -X POST https://novelstack.demo.vesper36.cc/webhook/deploy
```

## VPS 目录结构

```
/opt/
├── NovelStack/          # 主应用源码 + 构建产物
│   ├── src/             # 源码
│   ├── .next/           # Next.js 构建输出
│   ├── data/            # SQLite 数据库
│   ├── docs/            # 文档源码
│   ├── deploy.sh        # 部署脚本
│   ├── webhook.js       # GitHub Webhook 服务器
│   └── ecosystem.config.cjs
├── docs/
│   └── lobeam/          # VitePress 文档构建输出
│       ├── .vitepress/
│       │   └── dist/    # 静态文件
│       ├── guide/
│       ├── api/
│       └── deployment/
└── ...
```
