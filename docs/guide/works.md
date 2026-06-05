# 作品管理

作品是 NovelStack 的核心创作单元。每个作品包含卷、章节、标签、分级等完整元数据。

## 作品属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `title` | string | 作品标题（必填） |
| `slug` | string | URL 友好标识符 |
| `description` | string | 作品简介 |
| `coverUrl` | string | 封面图片 URL |
| `category` | string | 分类（奇幻、科幻、现代等） |
| `wordCount` | number | 总字数（自动计算） |
| `viewCount` | number | 浏览量 |
| `favoriteCount` | number | 收藏数 |
| `rating` | string | 内容分级 |
| `status` | string | 发布状态（published/draft） |
| `language` | string | 语言 |

## 内容分级

| 级别 | 标识 | 说明 |
|------|------|------|
| 全年龄 | `general` | 适合所有读者 |
| 青少年 | `teen` | 13岁以上 |
| 成人 | `mature` | 17岁以上 |
| 限制级 | `explicit` | 18岁以上 |

## 作品状态

| 状态 | 说明 |
|------|------|
| `draft` | 草稿，仅作者可见 |
| `published` | 已发布，公开可见 |
| `archived` | 已归档，只读 |
| `hidden` | 隐藏，不显示在列表中 |

## 作品结构

```
作品 (Work)
├── 卷 1 (Volume)        — 第一卷：序章
│   ├── 章节 1 (Chapter)  — 第1话
│   ├── 章节 2             — 第2话
│   └── 章节 3             — 第3话
├── 卷 2                  — 第二卷：展开
│   ├── 章节 4
│   └── 章节 5
└── ...
```

## 作品浏览

### 列表页

`/works` - 展示所有已发布作品，支持排序和筛选：

| 参数 | 说明 |
|------|------|
| `sort=latest` | 按更新时间 |
| `sort=popular` | 按浏览量 |
| `sort=word_count` | 按字数 |
| `tag=xxx` | 按标签筛选 |
| `category=xxx` | 按分类筛选 |

### 详情页

`/works/[slug]` - 展示作品完整信息，包含：
- 作品元数据
- 卷章目录
- 标签列表
- 作者信息
- 开始阅读按钮
