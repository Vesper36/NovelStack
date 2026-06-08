# 项目结构

## 目录树

```
NovelStack/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── api/                # API 路由 (21 个端点)
│   │   │   ├── auth/           # 认证 API (login/register/logout/me)
│   │   │   ├── works/          # 作品 CRUD + 卷章管理
│   │   │   ├── chapters/       # 章节 + 草稿版本
│   │   │   ├── comments/       # 评论系统
│   │   │   ├── favorites/      # 收藏管理
│   │   │   ├── reports/        # 内容举报
│   │   │   ├── search/         # 搜索
│   │   │   ├── tags/           # 标签
│   │   │   └── upload/         # 文件上传
│   │   ├── auth/               # 认证页面
│   │   │   ├── login/          # 登录页
│   │   │   └── register/       # 注册页
│   │   ├── creator/            # 创作者中心
│   │   │   ├── works/          # 我的作品列表
│   │   │   │   ├── new/        # 新建作品
│   │   │   │   └── [workId]/   # 作品管理
│   │   │   │       └── chapters/
│   │   │   │           └── [chapterId]/
│   │   │   │               └── edit/  # 章节编辑器
│   │   │   └── page.tsx        # 创作者仪表盘
│   │   ├── works/              # 作品浏览
│   │   │   ├── page.tsx        # 作品列表 (排序/筛选/搜索)
│   │   │   └── [slug]/         # 作品详情
│   │   │       └── [chapterSlug]/  # 章节阅读
│   │   ├── tags/               # 标签浏览
│   │   ├── search/             # 搜索页
│   │   ├── bookshelf/          # 书架 (收藏)
│   │   ├── users/              # 用户页
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   └── globals.css         # 全局样式 + CSS 变量主题
│   ├── components/             # React 组件
│   │   ├── ui/                 # 基础 UI (badge/button/card/input)
│   │   ├── layout/             # 布局 (header/footer/sidebar)
│   │   ├── common/             # 通用 (theme-provider)
│   │   ├── reader/             # 阅读器 (reading-view)
│   │   ├── works/              # 作品 (work-card)
│   │   ├── login-form.tsx      # 登录表单
│   │   ├── register-form.tsx   # 注册表单
│   │   ├── user-menu.tsx       # 用户菜单
│   │   └── mdx-editor.tsx      # CodeMirror 编辑器
│   └── lib/                    # 核心库
│       ├── auth/               # 认证系统
│       │   ├── index.ts        # JWT 签发/验证
│       │   ├── rbac.ts         # 角色权限矩阵
│       │   └── middleware.ts   # 认证中间件
│       ├── config/
│       │   └── index.ts        # 全局配置 (端口/主题/编辑器/阅读)
│       ├── db/                 # 数据库层
│       │   ├── index.ts        # SQLite 连接 + Drizzle 初始化
│       │   ├── queries.ts      # 查询函数
│       │   └── schema.ts       # Drizzle Schema (16 张表)
│       ├── hooks/              # 自定义 React Hooks
│       ├── mdx/                # MDX 处理
│       │   ├── index.ts        # remark/rehype 流水线
│       │   ├── components.tsx  # MDX 组件映射
│       │   └── sandbox.ts      # MDX 沙箱
│       ├── search/             # 搜索相关
│       ├── stores/             # Zustand Store (7 个 store)
│       ├── types/
│       │   └── index.ts        # 全局 TypeScript 类型
│       ├── utils/
│       │   └── index.ts        # 工具函数
│       └── validators/         # Zod 验证 schema
├── public/                     # 静态资源
├── scripts/
│   └── seed.ts                 # 数据库种子数据
├── data/                       # SQLite 数据库 (git 忽略)
├── docs/                       # VitePress 文档
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── drizzle.config.ts
├── eslint.config.mjs
├── ecosystem.config.cjs        # PM2 生产部署配置
└── deploy.sh                   # VPS 自动部署脚本
```

## 核心目录详解

### `src/app/` - 页面路由

使用 Next.js App Router 文件系统路由：

| 路由 | 文件 | 说明 |
|------|------|------|
| `/` | `page.tsx` | 首页，展示统计数据、热门作品、标签发现 |
| `/works` | `works/page.tsx` | 作品浏览，支持排序/筛选/搜索/分页 |
| `/works/[slug]` | `works/[slug]/page.tsx` | 作品详情，卷章目录 |
| `/works/[slug]/[chapterSlug]` | `.../page.tsx` | 章节阅读器 |
| `/tags` | `tags/page.tsx` | 标签浏览 |
| `/search` | `search/page.tsx` | 搜索结果 |
| `/auth/login` | `auth/login/page.tsx` | 登录 |
| `/auth/register` | `auth/register/page.tsx` | 注册 |
| `/creator` | `creator/page.tsx` | 创作者仪表盘 |
| `/creator/works` | `creator/works/page.tsx` | 我的作品管理 |
| `/creator/works/new` | `.../new/page.tsx` | 新建作品表单 |
| `/creator/works/[workId]` | `.../page.tsx` | 作品管理（卷章树） |
| `/creator/works/[workId]/chapters/[chapterId]/edit` | `.../edit/page.tsx` | CodeMirror 编辑器 |

### `src/components/` - 组件

按功能域组织：

| 目录 | 组件 | 说明 |
|------|------|------|
| `ui/` | Badge, Button, Card, Input | 基础 UI 原子组件 |
| `layout/` | Header, Footer, Sidebar | 布局组件 |
| `common/` | ThemeProvider | 主题上下文 |
| `reader/` | ReadingView | 完整阅读体验 |
| `works/` | WorkCard | 作品卡片 |
| 根目录 | LoginForm, RegisterForm | 认证表单 |
| 根目录 | UserMenu | 用户菜单 |
| 根目录 | MdxEditor | CodeMirror 编辑器 |

### `src/lib/` - 核心库

| 模块 | 文件 | 说明 |
|------|------|------|
| `auth/` | index.ts, rbac.ts, middleware.ts | JWT 认证 + RBAC 权限 |
| `config/` | index.ts | 端口/主题/编辑器/阅读/分页配置 |
| `db/` | schema.ts, queries.ts, index.ts | 16 张表的 Schema + 查询函数 |
| `mdx/` | index.ts, components.tsx, sandbox.ts | remark/rehype 流水线 |
| `stores/` | index.ts | 7 个 Zustand Store |
| `types/` | index.ts | 全局 TypeScript 类型 |
| `utils/` | index.ts | slug 生成、格式化等工具 |
| `validators/` | Zod schema | 表单和 API 数据验证 |

## Zustand Store

| Store | 持久化 | 说明 |
|-------|--------|------|
| UserStore | 否 | 当前用户、加载状态、登出 |
| ReadingStore | localStorage | 主题、字号、行高、阅读宽度 |
| EditorStore | 否 | 当前作品/章节、脏标记、保存状态 |
| UIStore | localStorage | 侧边栏/目录/搜索面板开关 |
| ReadingProgressStore | IndexedDB | 每章阅读进度和滚动位置 |
| SearchHistoryStore | localStorage | 最近 20 条搜索记录 |
| DraftStore | IndexedDB | 本地章节草稿（按章节 ID 隔离） |

## 数据库表 (16 张)

| 表名 | 说明 |
|------|------|
| users | 用户账号，含角色 |
| works | 作品，含状态/可见性/分级 |
| volumes | 卷，含排序/状态 |
| chapters | 章节，含 MDX 源码和编译 HTML |
| tags | 标签，含分类和使用次数 |
| work_tags | 作品-标签多对多 |
| chapter_tags | 章节-标签多对多 |
| user_preferences | 用户阅读偏好 |
| reading_progress | 阅读进度 |
| favorites | 收藏 |
| comments | 评论（支持嵌套回复） |
| draft_versions | 草稿版本快照 |
| content_warnings | 内容警告标签 |
| work_content_warnings | 作品-内容警告多对多 |
| themes | 自定义主题 |
| reports | 内容举报 |

## 配置文件

| 文件 | 说明 |
|------|------|
| `next.config.ts` | Next.js 配置，Turbopack |
| `tsconfig.json` | TypeScript 配置，`@/` 路径别名 |
| `postcss.config.mjs` | PostCSS + Tailwind CSS 4 |
| `drizzle.config.ts` | Drizzle ORM 数据库配置 |
| `eslint.config.mjs` | ESLint 代码规范 |
| `ecosystem.config.cjs` | PM2 生产部署（应用 + 文档 + Webhook） |
| `.env.local` | 环境变量（不提交到 Git） |
