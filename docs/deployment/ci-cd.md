# CI/CD 配置

## 当前方案：GitHub Webhook + 自动部署脚本

生产环境使用 GitHub Webhook 触发自动部署，推送代码到 `main` 分支即可自动完成构建和部署。

### 工作流程

```
开发者 push 到 main
       |
       v
GitHub 发送 Webhook POST
       |
       v
novelstack-webhook (端口 51640) 接收请求
       |
       v
验证 GitHub Signature
       |
       v
执行 /opt/NovelStack/deploy.sh
       |
       v
  +----+----+----+
  |    |    |    |
  v    v    v    v
git  npm  build  pm2
pull install     restart
  |              |
  v              v
rsync docs    vitepress build
  |              |
  v              v
pm2 restart novelstack-docs
```

### Webhook 配置

在 GitHub 仓库 Settings -> Webhooks 中添加：

| 配置项 | 值 |
|--------|-----|
| Payload URL | `https://novelstack.demo.vesper36.cc/webhook/deploy` |
| Content type | `application/json` |
| Secret | 与 `webhook.js` 中的 SECRET 一致 |
| Events | Just the push event |

### Webhook 服务器

`webhook.js` 运行在端口 51640：

- 接收 GitHub Push 事件
- 验证 `X-Hub-Signature-256` 签名
- 执行 `deploy.sh` 并记录日志
- 超时限制：600 秒

### 部署脚本

`deploy.sh` 依次执行：

1. `git checkout -- . && git pull origin main` - 重置本地改动并拉取最新代码
2. `npm install` - 安装依赖
3. `npm run db:push` - 推送数据库 schema 变更
4. `npm run build` - 构建 Next.js 生产版本
5. `pm2 restart inkweave` - 重启应用
6. `rsync docs/ /opt/docs/lobeam/` - 同步文档源文件
7. `npx vitepress build` - 构建 VitePress 文档
8. `pm2 restart novelstack-docs` - 重启文档站

日志输出到 `/opt/NovelStack/deploy.log`。

## 手动部署

```bash
# SSH 到 VPS 执行
ssh -p 36222 root@your-vps 'bash /opt/NovelStack/deploy.sh'

# 或登录后执行
bash /opt/NovelStack/deploy.sh
```

## 回滚

```bash
# 查看提交历史
cd /opt/NovelStack
git log --oneline -10

# 回滚到指定提交
git checkout <commit-hash>
npm install && npm run build
pm2 restart inkweave
```

## GitHub Actions（规划中）

后续计划添加 GitHub Actions，在 CI 环境中运行 lint 和类型检查：

```yaml
# .github/workflows/ci.yml (规划中)
name: CI
on:
  pull_request:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
```

## 部署检查清单

| 步骤 | 命令 |
|------|------|
| 查看进程状态 | `pm2 status` |
| 查看应用日志 | `pm2 logs inkweave` |
| 查看部署日志 | `tail -f /opt/NovelStack/deploy.log` |
| 测试应用 | `curl -s -o /dev/null -w "%{http_code}" http://localhost:50040/` |
| 测试文档站 | `curl -s -o /dev/null -w "%{http_code}" http://localhost:40004/` |
| 测试 Webhook | `curl -X POST http://localhost:51640/deploy` |
| Nginx 测试 | `nginx -t` |

## 监控

- **PM2 内置监控**: `pm2 monit`（实时 CPU/内存/日志）
- **PM2 Web 面板**: `pm2 web`（端口 9615，HTTP API）
- **日志轮转**: PM2 内置日志管理，`pm2 install pm2-logrotate`
