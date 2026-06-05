# 什么是 NovelStack

NovelStack 是一个面向创作者与读者的**结构化叙事平台**，为长篇连载、同人衍生、互动实验型文本提供容器级支持。

## 核心理念

创作工具应该专注于创作本身。NovelStack 的设计哲学是：

- **创作者优先** - 所有功能围绕创作流程设计
- **结构化叙事** - 作品 > 章节 > 内容的层级结构
- **沉浸式体验** - 写作和阅读都应该是无干扰的
- **开放可扩展** - 基于标准技术栈，易于定制和扩展

## 功能概览

### 创作端

| 功能 | 说明 |
|------|------|
| 多作品管理 | 一站式管理所有创作 |
| 章节编辑器 | Markdown 支持的沉浸式写作 |
| 自动保存 | 每 30 秒自动保存草稿 |
| 元数据管理 | 标题、简介、封面、标签、分级 |

### 阅读端

| 功能 | 说明 |
|------|------|
| 自定义阅读 | 字体、行高、宽度自由调节 |
| 多主题 | 六款精心设计的主题 |
| 进度追踪 | 自动记录阅读位置 |
| 时长估算 | 智能计算剩余阅读时间 |

### 技术特性

| 特性 | 说明 |
|------|------|
| SSR/SSG | Next.js 服务端渲染 |
| 类型安全 | TypeScript + Zod |
| 响应式 | 桌面端与移动端适配 |
| 全文搜索 | Meilisearch 驱动 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| 组件库 | Radix UI |
| 状态管理 | Zustand + TanStack Query |
| 数据库 | SQLite (better-sqlite3) |
| ORM | Drizzle ORM |
| 搜索引擎 | Meilisearch |
| 表单验证 | React Hook Form + Zod |
| Markdown | remark + rehype + Shiki |
| 动画 | Framer Motion |
| 图标 | Lucide React |

## 下一步

- [快速开始](/guide/getting-started) - 本地运行 NovelStack
- [项目结构](/guide/project-structure) - 了解代码组织方式
- [部署指南](/deployment/) - 将 NovelStack 部署到生产环境
