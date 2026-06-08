# 部署指南

InkWeave 支持多种部署方式。当前生产环境使用 **PM2 + Nginx** 方案部署在 VPS 上。

## 部署方式

### VPS 部署（推荐）

使用 PM2 进程管理 + Nginx 反向代理，完全控制、灵活配置。

详见 [VPS 部署](/deployment/vps)

### Docker 部署（规划中）

Docker Compose 一键部署方案正在开发中。

::: warning 开发中
Docker Compose 配置正在开发中，当前请使用 VPS 部署方式。
:::

## 端口规划

| 服务 | 端口 | PM2 进程 | 说明 |
|------|------|----------|------|
| 前端 (Next.js) | 50040 | inkweave | 主应用入口 |
| 文档站 (VitePress) | 40004 | novelstack-docs | 项目文档 |
| Webhook | 51640 | novelstack-webhook | GitHub 自动部署 |
| 后端 API (FastAPI) | 51638 | - | REST API（规划中） |
| Meilisearch | 51639 | - | 搜索引擎（规划中） |

## 域名配置

| 域名 | 用途 | 指向端口 |
|------|------|----------|
| `novelstack.demo.vesper36.cc` | Demo 演示站 | 50040 |
| `lobeam.docs.vesper36.cc` | 项目文档 | 40004 |

## 自动部署流程

```
git push main
    |
    v
GitHub Webhook (POST /webhook/deploy)
    |
    v
novelstack-webhook 进程接收请求
    |
    v
执行 deploy.sh:
  1. git pull origin main
  2. npm install
  3. npm run db:push
  4. npm run build
  5. pm2 restart inkweave
  6. rsync docs -> /opt/docs/lobeam/
  7. vitepress build
  8. pm2 restart novelstack-docs
```

## 部署检查清单

- [ ] Node.js >= 20.9.0 已安装
- [ ] PM2 已全局安装 (`npm i -g pm2`)
- [ ] Nginx 已配置反向代理
- [ ] 环境变量 `.env.local` 已设置
- [ ] 数据目录 `data/` 已创建
- [ ] SSL 证书已配置（Let's Encrypt）
- [ ] 防火墙已开放 80/443 端口
- [ ] GitHub Webhook 已配置指向 `/webhook/deploy`

## 常用运维命令

```bash
# 查看所有进程状态
pm2 status

# 查看应用日志
pm2 logs inkweave

# 重启应用
pm2 restart inkweave

# 手动触发部署
bash /opt/NovelStack/deploy.sh

# 测试 Nginx 配置
nginx -t

# 重载 Nginx
systemctl reload nginx

# 检查端口监听
ss -tlnp | grep -E "50040|40004|51640"
```
