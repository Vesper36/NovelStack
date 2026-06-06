# VPS 部署指南

完整的 VPS 生产环境部署步骤。

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
# NovelStack Production Environment

# 前端端口
FRONTEND_PORT=50040
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 后端 API 端口 (FastAPI)
BACKEND_PORT=51638
BACKEND_URL=http://localhost:51638

# Meilisearch 端口
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

# 构建生产版本
npm run build
```

## 7. 启动应用

```bash
# 使用 PM2 启动
pm2 start ecosystem.config.cjs

# 保存进程列表
pm2 save

# 验证运行状态
pm2 status
curl -s -o /dev/null -w "%{http_code}" http://localhost:50040/
# 应返回 200
```

## 8. 配置 Nginx

```bash
cat > /etc/nginx/sites-available/novelstack << 'NGINX'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:50040;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINX

# 启用站点
ln -sf /etc/nginx/sites-available/novelstack /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重载 nginx
systemctl reload nginx
```

## 9. 配置 SSL（可选但推荐）

```bash
# 申请 Let's Encrypt 证书
certbot --nginx -d your-domain.com

# 验证自动续期
certbot renew --dry-run
```

## 自动更新部署

创建部署脚本方便后续更新：

```bash
cat > /opt/NovelStack/deploy.sh << 'SCRIPT'
#!/bin/bash
set -e

cd /opt/NovelStack

echo ">>> Pulling latest code..."
git pull origin main

echo ">>> Installing dependencies..."
npm install

echo ">>> Building..."
npm run build

echo ">>> Restarting application..."
pm2 restart novelstack

echo ">>> Deployment complete!"
SCRIPT

chmod +x /opt/NovelStack/deploy.sh
```

后续更新只需：

```bash
/opt/NovelStack/deploy.sh
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `pm2 status` | 查看进程状态 |
| `pm2 logs novelstack` | 查看应用日志 |
| `pm2 restart novelstack` | 重启应用 |
| `pm2 stop novelstack` | 停止应用 |
| `pm2 monit` | 实时监控面板 |
| `nginx -t` | 测试 Nginx 配置 |
| `systemctl status nginx` | 查看 Nginx 状态 |

## 故障排查

### 应用无法启动

```bash
# 查看 PM2 日志
pm2 logs novelstack --lines 50

# 检查端口占用
lsof -i :50040
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

# PM2 会自动重启内存超限的进程
# 默认限制 512MB，可在 ecosystem.config.cjs 中调整
```
