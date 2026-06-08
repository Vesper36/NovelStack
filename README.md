<p align="center">
  <img src="public/logo.svg" alt="InkWeave Logo" width="120" height="120">
</p>

<h1 align="center">InkWeave</h1>

<p align="center">
  <strong>墨织 -- 为创作者而生的叙事平台</strong>
</p>

<p align="center">
  一个面向创作者与读者的结构化叙事平台，为长篇连载、同人衍生、互动实验型文本提供容器级支持。
</p>

<p align="center">
  <a href="#features">功能特性</a> &bull;
  <a href="#demo">在线演示</a> &bull;
  <a href="#quick-start">快速开始</a> &bull;
  <a href="#deployment">部署指南</a> &bull;
  <a href="#tech-stack">技术栈</a>
</p>

---

## Features

### 创作工具
- **多作品管理** - 一站式管理所有创作，支持草稿/审核/发布/归档状态流转
- **CodeMirror 编辑器** - 基于 CodeMirror 6 的 MDX 编辑器，语法高亮、行号、活动行标记
- **双轨草稿系统** - 本地 IndexedDB + 云端版本快照，双保险不丢稿
- **自动保存** - 每 30 秒自动保存到云端，编辑中实时保存到本地
- **卷章结构** - 作品 > 卷 > 章节三级管理
- **侧边预览** - 编辑器右侧实时 HTML 预览面板

### 阅读体验
- **自定义阅读设置** - 字体大小、行高、阅读宽度自由调节
- **六款主题** - 默认、深夜、羊皮纸、赛博朋克、森林、海洋
- **滚动进度条** - 顶部实时显示阅读进度
- **智能工具栏** - 向下滚动自动隐藏，向上滚动自动显示
- **章节目录** - 从标题结构自动生成，桌面侧边栏 + 移动端底栏
- **键盘导航** - 左右箭头切换章节，T 键切换主题

### 用户与权限
- **JWT 认证** - 基于 jose 库，httpOnly Cookie，bcrypt 密码加密
- **五级角色** - 读者、作者、编辑、管理员、超级管理员
- **RBAC 权限** - 完整的角色-权限矩阵

### 技术特性
- **SSR/SSG** - Next.js 16 服务端渲染，SEO 友好
- **类型安全** - TypeScript + Zod 全链路类型保障
- **OpenGraph + JSON-LD** - 自动注入 SEO 元数据
- **响应式设计** - 桌面端与移动端完美适配

## Demo

- 在线体验: [novelstack.demo.vesper36.cc](https://novelstack.demo.vesper36.cc)
- 项目文档: [lobeam.docs.vesper36.cc](https://lobeam.docs.vesper36.cc)

## Quick Start

### 环境要求

- Node.js >= 20.9.0
- npm >= 9

### 安装

```bash
# 克隆仓库
git clone https://github.com/Vesper36/NovelStack.git
cd NovelStack

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local

# 初始化数据库
npm run db:push

# 启动开发服务器
npm run dev
```

访问 `http://localhost:50040` 即可。

### 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (端口 50040) |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 (端口 50040) |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run db:push` | 推送数据库 schema 变更 |
| `npm run db:studio` | 启动 Drizzle Studio 数据库管理 |

## Deployment

### 端口规划

| 服务 | 端口 | PM2 进程 | 说明 |
|------|------|----------|------|
| 前端 (Next.js) | 50040 | inkweave | 主应用 |
| 文档站 (VitePress) | 40004 | novelstack-docs | 项目文档 |
| Webhook | 51640 | novelstack-webhook | 自动部署 |

### 快速部署

```bash
# 使用 PM2 启动
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

详见 [部署文档](https://lobeam.docs.vesper36.cc/deployment/)

## Tech Stack

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| 组件库 | Radix UI |
| 编辑器 | CodeMirror 6 |
| 状态管理 | Zustand + TanStack Query |
| 动画 | Framer Motion |
| 数据库 | SQLite (better-sqlite3) |
| ORM | Drizzle ORM |
| 认证 | jose (JWT) + bcryptjs |
| 表单 | React Hook Form + Zod |
| Markdown | remark + rehype + Shiki |
| 图标 | Lucide React |

## Project Structure

```
NovelStack/
├── src/
│   ├── app/              # Next.js App Router (12 页面 + 21 API)
│   ├── components/       # React 组件 (14 个)
│   └── lib/              # 核心库
│       ├── auth/         # JWT 认证 + RBAC 权限
│       ├── config/       # 全局配置
│       ├── db/           # Drizzle ORM (16 张表)
│       ├── mdx/          # MDX 处理流水线
│       └── stores/       # Zustand Store (7 个)
├── docs/                 # VitePress 文档
├── data/                 # SQLite 数据库 (git 忽略)
└── ecosystem.config.cjs  # PM2 部署配置
```

## Roadmap

- [x] 项目基础架构
- [x] UI 组件库 (Radix + Tailwind)
- [x] 六款主题系统
- [x] 作品 CRUD + 卷章结构
- [x] CodeMirror MDX 编辑器
- [x] 双轨草稿系统 (本地 + 云端)
- [x] 阅读器 (主题/字号/进度/TOC)
- [x] JWT 认证 + RBAC 权限
- [x] 评论系统 API
- [x] 收藏系统 API
- [x] 内容举报 API
- [x] 自动部署 (Webhook + PM2)
- [ ] 管理员面板 UI
- [ ] Meilisearch 全文搜索集成
- [ ] 拖拽排序卷章
- [ ] 内容警告 UI
- [ ] 用户个人主页
- [ ] RSS 输出
- [ ] Docker Compose 部署
- [ ] 国际化 (i18n)

## License

本项目基于 [MIT License](LICENSE) 开源。

---

<p align="center">
  Built with Next.js, React, and Tailwind CSS
</p>
