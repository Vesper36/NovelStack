# 部署指南

NovelStack 支持多种部署方式，选择适合你的方式：

## 部署方式

### [VPS 部署](/deployment/vps)

推荐的生产部署方式。使用 PM2 进程管理 + Nginx 反向代理。

**适用场景**: 个人服务器、小型团队

**优势**: 完全控制、灵活配置、易于调试

### [Docker 部署](/deployment/docker)

使用 Docker Compose 一键部署全套服务。

**适用场景**: 容器化环境、需要隔离

**优势**: 环境一致、易于迁移、一键部署

::: warning 开发中
Docker Compose 配置正在开发中。
:::

## 端口规划

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 (Next.js) | 51637 | 主应用入口 |
| 后端 API (FastAPI) | 51638 | REST API 服务 |
| Meilisearch | 51639 | 搜索引擎 |
| 文档站 (VitePress) | 40004 | 项目文档 |

## 域名配置

| 域名 | 用途 |
|------|------|
| `novelstack.demo.vesper36.cc` | Demo 演示站 |
| `novelstack.docs.vesper36.cc` | 项目文档 |

## 部署检查清单

- [ ] Node.js >= 20.9.0 已安装
- [ ] PM2 已安装
- [ ] Nginx 已配置
- [ ] 环境变量已设置
- [ ] 数据目录已创建
- [ ] SSL 证书已配置（推荐）
- [ ] 防火墙已开放端口
