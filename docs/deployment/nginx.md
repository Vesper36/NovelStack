# Nginx 配置

完整的 Nginx 反向代理配置指南。基于实际生产环境配置。

## 基础配置

```nginx
server {
    server_name your-domain.com;
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
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = your-domain.com) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name your-domain.com;
    return 404;
}
```

## 文档站配置

```nginx
server {
    server_name docs.your-domain.com;
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
    ssl_certificate /etc/letsencrypt/live/docs.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/docs.your-domain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = docs.your-domain.com) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name docs.your-domain.com;
    return 404;
}
```

## 生产环境实际配置

当前 VPS 使用以下域名：

| 域名 | 代理到 | 用途 |
|------|--------|------|
| `novelstack.demo.vesper36.cc` | `127.0.0.1:50040` | 应用演示 |
| `lobeam.docs.vesper36.cc` | `127.0.0.1:40004` | 项目文档 |

## 静态资源缓存

```nginx
# Next.js 构建产物 - 长期缓存
location /_next/ {
    proxy_pass http://127.0.0.1:50040;
    proxy_set_header Host $host;
    expires 365d;
    add_header Cache-Control "public, immutable";
}

# 公共静态资源 - 短期缓存
location /static/ {
    proxy_pass http://127.0.0.1:50040;
    proxy_set_header Host $host;
    expires 7d;
    add_header Cache-Control "public";
}
```

## 安全头

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## CORS 配置

如需跨域访问：

```nginx
add_header Access-Control-Allow-Origin * always;
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
add_header Access-Control-Expose-Headers "Content-Length,Content-Range" always;

if ($request_method = OPTIONS) {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Max-Age 1728000;
    add_header Content-Type "text/plain; charset=utf-8";
    add_header Content-Length 0;
    return 204;
}
```

## 常用命令

```bash
# 测试配置
nginx -t

# 重载配置（不中断连接）
systemctl reload nginx

# 重启配置（中断连接）
systemctl restart nginx

# 查看错误日志
tail -f /var/log/nginx/error.log

# 查看访问日志
tail -f /var/log/nginx/access.log

# 列出已启用站点
ls /etc/nginx/sites-enabled/
```
