# 项目结构

```
NovelStack/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API 路由
│   │   ├── creator/            # 创作者中心
│   │   │   ├── layout.tsx      # 创作者布局
│   │   │   └── page.tsx        # 创作者仪表盘
│   │   ├── works/              # 作品页面
│   │   │   ├── page.tsx        # 作品列表
│   │   │   └── [slug]/         # 动态路由
│   │   │       └── [chapterSlug]/
│   │   │           └── page.tsx
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   └── globals.css         # 全局样式
│   ├── components/             # React 组件
│   │   ├── common/             # 通用组件
│   │   │   └── theme-provider.tsx
│   │   ├── layout/             # 布局组件
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── sidebar.tsx
│   │   ├── reader/             # 阅读器组件
│   │   │   └── reading-view.tsx
│   │   ├── ui/                 # 基础 UI 组件
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   └── works/              # 作品组件
│   │       └── work-card.tsx
│   └── lib/                    # 核心库
│       ├── config/             # 配置管理
│       │   └── index.ts
│       ├── db/                 # 数据库层
│       │   ├── index.ts        # 连接初始化
│       │   ├── queries.ts      # 查询函数
│       │   └── schema.ts       # Drizzle Schema
│       ├── hooks/              # 自定义 Hooks
│       ├── mdx/                # MDX 处理
│       │   ├── components.tsx  # MDX 组件映射
│       │   ├── index.ts        # MDX 工具函数
│       │   └── sandbox.ts      # MDX 沙箱
│       ├── search/             # 搜索相关
│       ├── stores/             # Zustand Store
│       │   └── index.ts
│       ├── types/              # TypeScript 类型
│       │   └── index.ts
│       ├── utils/              # 工具函数
│       │   └── index.ts
│       └── validators/         # Zod 验证
├── public/                     # 静态资源
├── scripts/                    # 工具脚本
│   └── seed.ts                 # 数据库种子数据
├── data/                       # SQLite 数据 (git 忽略)
├── docs/                       # VitePress 文档
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── ecosystem.config.cjs        # PM2 配置
```

## 核心目录说明

### `src/app/` - 页面路由

使用 Next.js App Router，基于文件系统的路由：

- `/` - 首页，展示作品列表
- `/works` - 作品浏览页
- `/works/[slug]` - 作品详情页
- `/works/[slug]/[chapterSlug]` - 章节阅读页
- `/creator` - 创作者中心（仪表盘）
- `/api/*` - API 路由

### `src/components/` - 组件

按功能域组织：

| 目录 | 说明 |
|------|------|
| `ui/` | 基础 UI 组件（Button, Card, Input 等） |
| `layout/` | 布局组件（Header, Footer, Sidebar） |
| `common/` | 通用业务组件（ThemeProvider） |
| `reader/` | 阅读器相关组件 |
| `works/` | 作品相关组件 |

### `src/lib/` - 核心库

| 模块 | 说明 |
|------|------|
| `config/` | 统一配置管理，从环境变量读取 |
| `db/` | 数据库层：Schema 定义、连接管理、查询函数 |
| `hooks/` | 自定义 React Hooks |
| `mdx/` | Markdown/MDX 处理和渲染 |
| `stores/` | Zustand 状态管理 |
| `types/` | 全局 TypeScript 类型定义 |
| `utils/` | 通用工具函数 |
| `validators/` | Zod 数据验证 Schema |

## 配置文件

| 文件 | 说明 |
|------|------|
| `next.config.ts` | Next.js 配置 |
| `tsconfig.json` | TypeScript 配置 |
| `postcss.config.mjs` | PostCSS + Tailwind 配置 |
| `eslint.config.mjs` | ESLint 代码规范 |
| `ecosystem.config.cjs` | PM2 生产部署配置 |
| `.env.local` | 环境变量（不提交到 Git） |
