# Nginx 配置

完整的 Nginx 反向代理配置指南。

## 基础配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:51637;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        client_max_body_size 50m;
    }
}
```

## 静态资源缓存

```nginx
# Next.js 构建产物 - 长期缓存
location /_next/ {
    proxy_pass http://127.0.0.1:51637;
    proxy_set_header Host $host;
    expires 365d;
    add_header Cache-Control "public, immutable";
}

# 公共静态资源 - 短期缓存
location /static/ {
    proxy_pass http://127.0.0.1:51637;
    proxy_set_header Host $host;
    expires 7d;
    add_header Cache-Control "public";
}
```

## WebSocket 支持

Next.js 开发模式的 HMR 需要 WebSocket：

```nginx
location /_next/webpack-hmr {
    proxy_pass http://127.0.0.1:51637;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

## 多站点配置

```nginx
# Demo 演示站
server {
    server_name novelstack.demo.vesper36.cc;
    location / { proxy_pass http://127.0.0.1:51637; }
}

# 文档站
server {
    server_name novelstack.docs.vesper36.cc;
    location / { proxy_pass http://127.0.0.1:40004; }
}
```

## 安全头

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## 常用命令

```bash
# 测试配置
nginx -t

# 重载配置
systemctl reload nginx

# 查看错误日志
tail -f /var/log/nginx/error.log

# 查看访问日志
tail -f /var/log/nginx/access.log
```
