# 代码规范

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件 | kebab-case | `work-card.tsx` |
| 组件 | PascalCase | `WorkCard` |
| 函数 | camelCase | `getWorkBySlug` |
| 类型/接口 | PascalCase | `WorkData` |
| 常量 | UPPER_SNAKE_CASE | `MAX_CONTENT_LENGTH` |
| CSS 类 | kebab-case | `.work-card-container` |

## 文件组织

```
src/
├── app/           # 页面路由（按路由组织）
├── components/    # 组件（按功能域组织）
└── lib/           # 核心库（按职责组织）
```

## TypeScript

- 所有代码使用 TypeScript
- 优先使用 `interface` 而非 `type`
- 避免使用 `any`，使用 `unknown` 或具体类型
- 导出类型与实现放在同一文件

## React 组件

### 函数组件

```typescript
// 使用命名导出
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  return <div>...</div>;
}
```

### Props 接口

```typescript
interface MyComponentProps {
  /** 必填属性说明 */
  required: string;
  /** 可选属性说明 */
  optional?: number;
}
```

## 样式

使用 Tailwind CSS 4 + CSS 变量：

```tsx
<div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4 text-[var(--text-primary)]">
```

## 数据库

- Schema 变更通过 `drizzle-kit push` 同步
- 查询函数统一在 `src/lib/db/queries.ts`
- 复杂查询使用 Drizzle ORM 的 `sql` 模板

## 错误处理

```typescript
// 服务端 - 使用 notFound() 处理 404
import { notFound } from 'next/navigation';
const data = await getData(slug);
if (!data) notFound();
```

## 导入顺序

1. Next.js / React
2. 第三方库
3. 项目内部（绝对路径 `@/`）
4. 相对路径
