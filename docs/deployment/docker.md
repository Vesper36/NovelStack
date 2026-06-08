# Docker 部署

::: warning 开发中
Docker Compose 一键部署方案正在开发中。以下为规划配置，仅供参考。
:::

## 计划中的服务

```yaml
# docker-compose.yml (规划中)
version: '3.8'

services:
  # Next.js 主应用
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "50040:50040"
    environment:
      - NODE_ENV=production
      - PORT=50040
      - DATABASE_URL=file:./data/inkweave.db
    volumes:
      - app-data:/app/data
    restart: unless-stopped

  # Meilisearch 搜索引擎 (规划中)
  meilisearch:
    image: getmeili/meilisearch:v1.x
    ports:
      - "51639:7700"
    environment:
      - MEILI_MASTER_KEY=${MEILI_API_KEY}
    volumes:
      - meili-data:/meili_data
    restart: unless-stopped

volumes:
  app-data:
  meili-data:
```

## Dockerfile (规划中)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/drizzle.config.ts ./
RUN mkdir -p data
EXPOSE 50040
CMD ["npm", "run", "start"]
```

## 当前替代方案

生产环境使用 **PM2 + Nginx** 方案，详见 [VPS 部署指南](/deployment/vps)。

### 为什么不使用 Docker

| 考量 | PM2 方案 | Docker 方案 |
|------|----------|-------------|
| 复杂度 | 低 | 中 |
| 资源占用 | 低 | 略高 |
| 数据持久化 | 直接文件系统 | 需要 Volume |
| 调试 | 直接 | 需要 exec |
| 热更新 | `git pull` + `pm2 restart` | 重新构建镜像 |

对于个人项目和小型部署，PM2 方案更轻量灵活。

## 预计时间线

Docker 支持计划在以下条件成熟时推出：

- [ ] FastAPI 后端服务独立部署
- [ ] Meilisearch 集成完成
- [ ] 数据库迁移到 PostgreSQL（可选）
