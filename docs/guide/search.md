# 搜索

NovelStack 的搜索系统基于 Meilisearch，提供高性能全文搜索体验。

::: info 当前状态
当前版本使用 SQLite LIKE 查询作为临时方案，Meilisearch 集成正在开发中。
:::

## 搜索功能

- **全文搜索** - 搜索作品标题和简介
- **实时结果** - 输入即搜索
- **标签筛选** - 按标签过滤结果
- **分类筛选** - 按题材分类过滤

## 搜索 API

```http
GET /api/search?q=关键词&limit=20
```

## 搜索范围

| 字段 | 权重 | 说明 |
|------|------|------|
| `title` | 高 | 作品标题 |
| `description` | 中 | 作品简介 |
| `tags` | 低 | 作品标签 |

## Meilisearch 配置

Meilisearch 服务运行在端口 **50042**：

```env
MEILI_PORT=50042
MEILI_HOST=http://localhost:50042
MEILI_API_KEY=
```

### 索引结构

```json
{
  "id": "string",
  "title": "string",
  "slug": "string",
  "description": "string",
  "category": "string",
  "wordCount": 0,
  "viewCount": 0,
  "tags": ["tag1", "tag2"],
  "authorName": "string",
  "updatedAt": "timestamp"
}
```

### 搜索参数

| 参数 | 说明 |
|------|------|
| `q` | 搜索关键词 |
| `limit` | 结果数量 |
| `offset` | 偏移量 |
| `filter` | Meilisearch 过滤表达式 |
| `sort` | 排序字段 |

## 搜索历史

- 自动保存最近 10 次搜索
- 存储在 `localStorage` (key: `inkweave-search-history`)
- 可在搜索框中快速清除
