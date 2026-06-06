<p align="center">
  <img src="public/logo.svg" alt="NovelStack Logo" width="120" height="120">
</p>

<h1 align="center">NovelStack</h1>

<p align="center">
  <strong>为创作者而生的叙事平台</strong>
</p>

<p align="center">
  一个面向创作者与读者的结构化叙事平台，为长篇连载、同人衍生、互动实验型文本提供容器级支持。
</p>

<p align="center">
  <a href="#features">功能特性</a> &bull;
  <a href="#demo">在线演示</a> &bull;
  <a href="#quick-start">快速开始</a> &bull;
  <a href="#deployment">部署指南</a> &bull;
  <a href="#tech-stack">技术栈</a> &bull;
  <a href="#license">许可协议</a>
</p>

---

## Features

### 创作工具
- **多作品管理** - 一站式管理你的所有创作
- **章节编辑器** - 支持 Markdown 的沉浸式写作环境
- **自动保存** - 每 30 秒自动保存草稿，告别丢稿烦恼
- **作品信息管理** - 标题、简介、封面、标签、分级等完整元数据

### 阅读体验
- **自定义阅读设置** - 字体大小、行高、阅读宽度自由调节
- **多主题切换** - 默认、深夜、羊皮纸、赛博朋克、森林、海洋六款主题
- **阅读进度追踪** - 自动记录阅读位置
- **阅读时长估算** - 智能计算剩余阅读时间

### 搜索与发现
- **全文搜索** - 基于 Meilisearch 的高性能搜索
- **标签系统** - 题材、类型、配对、状态多维分类
- **内容分级** - 全年龄 / 青少年 / 成人 / 限制级四级分类

### 技术特性
- **响应式设计** - 完美适配桌面端与移动端
- **暗色模式** - 原生暗色主题支持
- **SSR/SSG** - Next.js 驱动的服务端渲染，SEO 友好
- **类型安全** - TypeScript + Zod 全链路类型保障

## Demo

在线体验: [novelstack.demo.vesper36.cc](https://novelstack.demo.vesper36.cc)

项目文档: [novelstack.docs.vesper36.cc](https://novelstack.docs.vesper36.cc)

## Quick Start

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装

```bash
# 克隆仓库
git clone https://github.com/vesper817/NovelStack.git
cd NovelStack

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的配置

# 初始化数据库
npm run db:push

# 启动开发服务器
npm run dev
```

访问 `http://localhost:51637` 即可。

### 构建生产版本

```bash
npm run build
npm run start
```

## Deployment

### 端口规划

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 (Next.js) | 51637 | 主应用 |
| 后端 API (FastAPI) | 51638 | REST API |
| Meilisearch | 51639 | 搜索引擎 |

### 使用 PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 构建
npm run build

# 使用项目配置启动
pm2 start ecosystem.config.cjs

# 保存进程列表（开机自启）
pm2 save
pm2 startup
```

### Nginx 反向代理

```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:51637;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker (即将支持)

Docker Compose 配置正在开发中，将包含 Next.js + FastAPI + Meilisearch 一键部署。

## Tech Stack

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| 组件 | Radix UI |
| 状态管理 | Zustand + TanStack Query |
| 动画 | Framer Motion |
| 数据库 | SQLite (better-sqlite3) |
| ORM | Drizzle ORM |
| 搜索 | Meilisearch |
| 表单 | React Hook Form + Zod |
| Markdown | remark + rehype + Shiki |
| 图标 | Lucide React |

## Project Structure

```
NovelStack/
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── creator/      # 创作者中心
│   │   ├── works/        # 作品页面
│   │   └── api/          # API 路由
│   ├── components/       # React 组件
│   │   ├── ui/           # 基础 UI 组件
│   │   ├── layout/       # 布局组件
│   │   └── ...           # 业务组件
│   └── lib/              # 核心库
│       ├── config/       # 配置
│       ├── db/           # 数据库 (Drizzle ORM)
│       ├── hooks/        # 自定义 Hooks
│       ├── mdx/          # MDX 处理
│       ├── stores/       # Zustand Store
│       ├── types/        # TypeScript 类型
│       ├── utils/        # 工具函数
│       └── validators/   # Zod 验证
├── public/               # 静态资源
├── data/                 # SQLite 数据库 (git 忽略)
└── scripts/              # 工具脚本
```

## Roadmap

- [x] 项目基础架构搭建
- [x] UI 组件库 (Radix + Tailwind)
- [x] 多主题系统
- [x] 作品 CRUD
- [x] 章节编辑器 (Markdown)
- [x] 阅读器 (自定义设置)
- [ ] 用户认证系统
- [ ] Meilisearch 全文搜索集成
- [ ] FastAPI 后端 API
- [ ] 标签与分类系统
- [ ] 评论与互动
- [ ] 数据统计面板
- [ ] Docker Compose 部署
- [ ] 国际化 (i18n)

## Contributing

欢迎贡献! 请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解贡献流程。

## License

本项目基于 [MIT License](LICENSE) 开源。

---

<p align="center">
  Built with Next.js, React, and Tailwind CSS
</p>
