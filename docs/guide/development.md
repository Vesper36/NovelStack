# 开发指南

## 技术栈概览

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 16 (App Router) | React 全栈框架 |
| UI | React 19 + Tailwind CSS 4 | 组件化 + 原子化 CSS |
| 组件库 | Radix UI | 无样式可访问组件 |
| 编辑器 | CodeMirror 6 | 高性能代码编辑器 |
| 状态管理 | Zustand + TanStack Query | 轻量状态 + 服务端缓存 |
| 数据库 | SQLite (better-sqlite3) + Drizzle ORM | 嵌入式 + 类型安全 ORM |
| 认证 | jose + bcryptjs | JWT + 密码加密 |
| 验证 | Zod + React Hook Form | 前后端数据验证 |

## 本地开发

### 环境要求

- Node.js >= 20.9.0
- npm >= 9

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:50040`

### 数据库操作

```bash
# 推送 schema 变更到数据库
npm run db:push

# 启动数据库管理界面 (Drizzle Studio)
npm run db:studio
```

### 代码检查

```bash
npm run lint
```

## 项目规范

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | kebab-case | `work-card.tsx` |
| 组件名 | PascalCase | `WorkCard` |
| 函数名 | camelCase | `getWorksBySlug` |
| 类型/接口 | PascalCase | `WorkData` |
| 常量 | UPPER_SNAKE_CASE | `MAX_CONTENT_LENGTH` |
| CSS 类 | kebab-case | `.work-card-container` |

### 组件规范

1. 优先使用 Radix UI 无样式组件作为基础
2. 样式使用 Tailwind CSS 4 类名
3. 使用 CSS 变量 (`var(--bg-primary)`) 支持多主题切换
4. 客户端组件必须声明 `'use client'`
5. 服务端组件默认不需要声明
6. 使用命名导出 `export function MyComponent()`

### 数据库规范

1. 所有 schema 定义在 `src/lib/db/schema.ts`
2. 查询函数统一放在 `src/lib/db/queries.ts`
3. 复杂查询使用 Drizzle ORM 的 `sql` 模板
4. SQLite 不支持并发写入，注意事务管理
5. Schema 变更通过 `drizzle-kit push` 同步

### 状态管理规范

| Store | 用途 | 持久化 |
|-------|------|--------|
| UserStore | 当前用户 | 否 |
| ReadingStore | 阅读设置 | localStorage |
| EditorStore | 编辑器状态 | 否 |
| UIStore | UI 开关 | localStorage |
| ReadingProgressStore | 阅读进度 | IndexedDB |
| SearchHistoryStore | 搜索历史 | localStorage |
| DraftStore | 本地草稿 | IndexedDB |

### 导入顺序

1. Next.js / React 内置
2. 第三方库
3. 项目内部（绝对路径 `@/`）
4. 相对路径

```typescript
import { notFound } from 'next/navigation';
import { useState } from 'react';

import { z } from 'zod';
import { motion } from 'framer-motion';

import { db } from '@/lib/db';
import { WorkCard } from '@/components/works/work-card';

import { formatDate } from './utils';
```

## 调试技巧

### Next.js 调试

在 `next.config.ts` 中启用详细日志：

```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: { fullUrl: true },
  },
};
```

### 数据库调试

```bash
# 使用 Drizzle Studio 可视化数据库
npm run db:studio
```

在代码中开启 SQL 日志：

```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
export const db = drizzle(sqlite, { logger: true });
```

### Zustand 调试

使用浏览器 DevTools 查看 localStorage 和 IndexedDB 中的持久化状态。

## 添加新功能的流程

### 新增页面

1. 在 `src/app/` 下创建目录和 `page.tsx`
2. 如需布局，在同目录创建 `layout.tsx`
3. 如需认证，在页面中调用 `authMiddleware`

### 新增 API

1. 在 `src/app/api/` 下创建目录和 `route.ts`
2. 导出 `GET`/`POST`/`PATCH`/`DELETE` 函数
3. 使用 Zod 验证请求体
4. 使用 `authMiddleware` 保护需认证的路由

### 新增组件

1. 在 `src/components/` 对应目录下创建文件
2. 使用命名导出
3. Props 接口定义在同文件中
4. 使用 Tailwind CSS + CSS 变量

### 新增主题

在 `src/lib/config/index.ts` 的 `themes` 数组中注册：

```typescript
{
  id: 'my-theme',
  name: '我的主题',
  description: '主题描述',
  variables: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8fafc',
    '--bg-tertiary': '#f1f5f9',
    '--text-primary': '#0f172a',
    '--text-secondary': '#475569',
    '--text-tertiary': '#94a3b8',
    '--accent': '#6366f1',
    '--accent-light': '#818cf8',
    '--accent-dark': '#4f46e5',
    '--border': '#e2e8f0',
    '--shadow': 'rgba(0, 0, 0, 0.1)',
  },
}
```

### 新增数据库表

1. 在 `src/lib/db/schema.ts` 中定义表
2. 运行 `npm run db:push` 同步到数据库
3. 在 `src/lib/db/queries.ts` 中添加查询函数
