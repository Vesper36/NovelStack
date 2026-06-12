# SSL 证书配置

使用 Let's Encrypt 免费证书为你的 InkWeave 站点配置 HTTPS。

## 使用 Certbot

### 安装

```bash
apt install -y certbot python3-certbot-nginx
```

### 申请证书

```bash
# 单域名
certbot --nginx -d novelstack.demo.vesper36.cc

# 多域名（推荐）
certbot --nginx -d novelstack.demo.vesper36.cc -d novelstack.docs.vesper36.cc
```

按照提示操作：
1. 输入邮箱地址
2. 同意服务条款
3. 选择是否重定向 HTTP 到 HTTPS（推荐选择重定向）

### 验证自动续期

```bash
certbot renew --dry-run
```

Certbot 会自动创建 systemd timer 进行续期，无需手动操作。

## HTTPS Nginx 配置

Certbot 会自动修改你的 nginx 配置，添加：

```nginx
server {
    listen 443 ssl;
    server_name novelstack.demo.vesper36.cc;

    ssl_certificate /etc/letsencrypt/live/novelstack.demo.vesper36.cc/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/novelstack.demo.vesper36.cc/privkey.pem;

    # 推荐的安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

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
    }
}

# HTTP → HTTPS 重定向
server {
    listen 80;
    server_name novelstack.demo.vesper36.cc;
    return 301 https://$server_name$request_uri;
}
```

## 证书管理

```bash
# 查看证书状态
certbot certificates

# 手动续期
certbot renew

# 吊销证书
certbot revoke --cert-name novelstack.demo.vesper36.cc

# 删除证书
certbot delete --cert-name novelstack.demo.vesper36.cc
```

## 多域名证书

单个证书覆盖多个域名：

```bash
certbot --nginx \
  -d novelstack.demo.vesper36.cc \
  -d novelstack.docs.vesper36.cc
```

## 常见问题

### 证书申请失败

检查：
- 域名 DNS 是否正确解析到 VPS IP
- 80 端口是否能被 Let's Encrypt 验证服务器访问
- 防火墙是否开放 80 和 443 端口

```bash
# 检查防火墙
ufw status

# 开放端口
ufw allow 80
ufw allow 443
```
