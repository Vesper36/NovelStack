# CI/CD 配置

持续集成和持续部署的配置指南。

## 自动部署脚本

VPS 上的一键部署脚本位于 `/opt/NovelStack/deploy.sh`：

```bash
#!/bin/bash
set -e
cd /opt/NovelStack
git checkout -- .
git pull origin main
npm install
npm run db:push
npm run build
pm2 restart novelstack

# 同步并构建文档
rsync -av --exclude node_modules docs/ /opt/docs/NovelStack/
cd /opt/docs/NovelStack
npm install
npx vitepress build
pm2 restart novelstack-docs
```

## 手动部署

```bash
ssh -p 36222 root@38.55.146.183 '/opt/NovelStack/deploy.sh'
```

## GitHub Actions (计划中)

后续版本将添加 GitHub Actions 自动部署：

```yaml
# .github/workflows/deploy.yml (即将推出)
name: Deploy to VPS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          port: ${{ secrets.VPS_PORT }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: /opt/NovelStack/deploy.sh
```

## 回滚

如需回滚到之前版本：

```bash
# 在 VPS 上
cd /opt/NovelStack
git log --oneline -10          # 查看提交历史
git checkout <commit-hash>     # 回滚到指定提交
npm install && npm run build
pm2 restart novelstack
```

## 部署检查清单

| 步骤 | 命令 |
|------|------|
| 查看进程状态 | `pm2 status` |
| 查看应用日志 | `pm2 logs novelstack` |
| 测试应用 | `curl -s -o /dev/null -w "%{http_code}" http://localhost:50040/` |
| 测试文档站 | `curl -s -o /dev/null -w "%{http_code}" http://localhost:40004/` |
| Nginx 测试 | `nginx -t` |

## 监控建议

- 使用 PM2 内置监控: `pm2 monit`
- PM2 Web 面板: `pm2 web` (端口 9615)
- 日志轮转: PM2 自动管理日志文件
