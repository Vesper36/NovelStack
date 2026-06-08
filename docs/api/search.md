# 搜索 API

::: tip 当前实现
当前使用 SQLite LIKE 查询进行搜索。Meilisearch 高性能搜索集成在规划中。
:::

## 全文搜索

```http
GET /api/search?q=关键词
```

无需认证。

### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `q` | string | 是 | - | 搜索关键词（最少 2 字符） |
| `limit` | number | 否 | 20 | 结果数量（最大 100） |

### 响应 (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "work_xxx",
      "title": "匹配的作品标题",
      "slug": "pi-pei-de-zuo-pin",
      "description": "包含关键词的简介...",
      "category": "奇幻",
      "wordCount": 50000,
      "viewCount": 1234,
      "favoriteCount": 56,
      "rating": "teen",
      "status": "published",
      "updatedAt": "2026-06-05T12:00:00Z"
    }
  ]
}
```

### 搜索范围

| 字段 | 权重 | 说明 |
|------|------|------|
| `title` | 高 | 作品标题 |
| `description` | 中 | 作品简介 |

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 400 | 缺少 `q` 参数或少于 2 字符 |

---

## 搜索历史

前端自动保存最近 20 条搜索记录到 localStorage（`inkweave-search-history`）。

---

## Meilisearch 集成（规划中）

后续版本将支持：

- **模糊搜索** - 容错拼写
- **同义词扩展** - 扩展匹配范围
- **过滤器** - 按标签/分级/分类过滤
- **排序** - 按相关性/时间/热度
- **高亮** - 搜索结果关键词高亮
- **分面搜索** - 聚合统计

### 预留配置

```env
MEILI_PORT=51639
MEILI_HOST=http://localhost:51639
MEILI_API_KEY=
```

### 预留索引结构

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
