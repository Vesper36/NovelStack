# 搜索 API

::: warning 开发中
Meilisearch 集成正在开发中。当前使用 SQLite LIKE 查询作为临时方案。
:::

## 全文搜索

```http
GET /api/search?q=关键词
```

### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `q` | string | - | 搜索关键词（必填） |
| `limit` | number | 20 | 结果数量 |

### 响应

```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "title": "搜索结果",
      "slug": "search-result",
      "description": "匹配内容...",
      "category": "奇幻",
      "wordCount": 50000,
      "viewCount": 100,
      "authorName": "作者"
    }
  ]
}
```

## Meilisearch 搜索 (计划中)

后续版本将支持 Meilisearch 高级搜索功能：

- **模糊搜索** - 容错拼写
- **同义词** - 扩展匹配
- **过滤器** - 按标签/分级/分类过滤
- **排序** - 按相关性/时间/热度
- **高亮** - 搜索结果高亮

## 搜索配额

| 限制 | 值 |
|------|-----|
| 每页最大结果 | 100 |
| 最小关键词长度 | 2 字符 |
