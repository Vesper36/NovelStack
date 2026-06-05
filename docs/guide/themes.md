# 主题系统

NovelStack 内置六款精心设计的主题，通过 CSS 变量实现切换。

## 内置主题

### 默认
简洁优雅的默认主题，适合日常阅读。

```css
--bg-primary: #ffffff
--text-primary: #0f172a
--accent: #6366f1
```

### 深夜
护眼暗色主题，适合夜间阅读。

```css
--bg-primary: #0f172a
--text-primary: #f1f5f9
--accent: #818cf8
```

### 羊皮纸
复古纸质阅读体验。

```css
--bg-primary: #faf3e0
--text-primary: #3e2723
--accent: #c62828
```

### 赛博朋克
未来科技风格，绿色终端美学。

```css
--bg-primary: #0a0a0f
--text-primary: #00ff9d
--accent: #ff00ff
```

### 森林
自然清新风格。

```css
--bg-primary: #f0fdf4
--text-primary: #14532d
--accent: #059669
```

### 海洋
深邃宁静的蓝色调。

```css
--bg-primary: #f0f9ff
--text-primary: #0c4a6e
--accent: #0284c7
```

## CSS 变量体系

所有组件使用 CSS 变量，确保主题切换即时生效：

```css
/* 背景色 */
--bg-primary     /* 主背景 */
--bg-secondary   /* 次要背景 */
--bg-tertiary    /* 三级背景 */

/* 文字色 */
--text-primary   /* 主文字 */
--text-secondary /* 次要文字 */
--text-tertiary  /* 辅助文字 */

/* 强调色 */
--accent         /* 主强调色 */
--accent-light   /* 亮强调色 */
--accent-dark    /* 暗强调色 */

/* 边框 */
--border         /* 边框色 */

/* 阴影 */
--shadow         /* 阴影色 */
```

## 添加自定义主题

在 `src/lib/config/index.ts` 中注册：

```typescript
{
  id: 'custom',
  name: '自定义',
  description: '我的自定义主题',
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

## 主题切换

主题通过 Zustand store 管理，使用 `ThemeProvider` 组件包裹应用：

```tsx
import { ThemeProvider } from '@/components/common/theme-provider';

export default function Layout({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
```
