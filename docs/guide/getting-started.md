# 快速开始

## 环境要求

| 工具 | 最低版本 |
|------|----------|
| Node.js | >= 20.9.0 |
| npm | >= 9 |

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/Vesper36/NovelStack.git
cd NovelStack
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
# 复制示例配置
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# 前端端口
FRONTEND_PORT=50040
NEXT_PUBLIC_SITE_URL=http://localhost:50040

# 后端 API 端口 (FastAPI)
BACKEND_PORT=51638
BACKEND_URL=http://localhost:51638

# Meilisearch 端口
MEILI_PORT=51639
MEILI_HOST=http://localhost:51639
MEILI_API_KEY=

# 数据库
DATABASE_URL=file:./data/inkweave.db
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:50040` 即可看到应用。

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (端口 50040) |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |

## 端口规划

| 服务 | 默认端口 | 说明 |
|------|----------|------|
| 前端 (Next.js) | 50040 | 主应用入口 |
| 后端 API (FastAPI) | 51638 | REST API 服务 |
| Meilisearch | 51639 | 搜索引擎 |

## 故障排除

### 端口被占用

```bash
# 查看端口占用
lsof -i :50040

# 杀掉占用进程
kill -9 <PID>
```

### 数据库问题

如果遇到数据库错误，删除 `data/` 目录后重新启动：

```bash
rm -rf data/
npm run dev
```

### 依赖问题

```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

## 下一步

- [项目结构](/guide/project-structure) - 了解代码组织方式
- [开发指南](/guide/development) - 开始开发
- [部署指南](/deployment/) - 部署到生产环境
