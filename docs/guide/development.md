# 开发指南

## 技术栈概览

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 16 (App Router) | React 全栈框架 |
| UI | React 19 + Tailwind CSS 4 | 组件化 + 原子化 CSS |
| 组件库 | Radix UI | 无样式可访问组件 |
| 状态管理 | Zustand + TanStack Query | 轻量状态 + 服务端缓存 |
| 数据库 | SQLite (better-sqlite3) + Drizzle ORM | 嵌入式 + 类型安全 ORM |
| 搜索引擎 | Meilisearch | 高性能全文搜索 |
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
# 推送 schema 变更
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

- **文件**: 小写 + 短横线 (`work-card.tsx`)
- **组件**: PascalCase (`WorkCard`)
- **函数**: camelCase (`getWorksBySlug`)
- **类型**: PascalCase (`WorkData`)
- **常量**: UPPER_SNAKE_CASE (`MAX_CONTENT_LENGTH`)

### 组件规范

1. 优先使用 Radix UI 无样式组件
2. 样式使用 Tailwind CSS 4 类名
3. 使用 CSS 变量 (`var(--bg-primary)`) 支持多主题
4. 客户端组件必须声明 `'use client'`
5. 服务端组件默认不需要声明

### 数据库规范

1. 所有 schema 定义在 `src/lib/db/schema.ts`
2. 查询函数统一放在 `src/lib/db/queries.ts`
3. 复杂查询使用 Drizzle ORM 的 `sql` 模板
4. SQLite 不支持并发写入，注意事务管理

### 主题系统

添加新主题需在 `src/lib/config/index.ts` 的 `themes` 数组中注册：

```typescript
{
  id: 'my-theme',
  name: '我的主题',
  description: '主题描述',
  variables: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8fafc',
    // ... 其他变量
  },
}
```

## 调试技巧

### Next.js 调试

在 `next.config.ts` 中启用：

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

### 查看 SQL 日志

在 `src/lib/db/index.ts` 中配置：

```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
export const db = drizzle(sqlite, { logger: true }); // 开启 SQL 日志
```
