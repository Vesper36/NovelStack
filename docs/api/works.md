# 作品 API

## 获取作品列表

```http
GET /api/works
```

### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | number | 1 | 页码 |
| `limit` | number | 20 | 每页数量 |
| `sort` | string | `latest` | 排序方式 |
| `tag` | string | - | 标签筛选 |
| `category` | string | - | 分类筛选 |

### 排序选项

- `latest` - 按更新时间倒序
- `popular` - 按浏览量倒序
- `word_count` - 按字数倒序

### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "title": "作品标题",
      "slug": "zuo-pin-biao-ti",
      "description": "作品简介...",
      "coverUrl": null,
      "category": "奇幻",
      "wordCount": 50000,
      "viewCount": 1234,
      "favoriteCount": 56,
      "rating": "teen",
      "updatedAt": "2026-06-05T12:00:00Z",
      "authorName": "作者名",
      "tags": [
        { "name": "标签", "slug": "tag", "color": "#ff0000" }
      ]
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

## 获取作品详情

```http
GET /api/works/:slug
```

### 响应

返回作品完整信息，包含卷章结构和标签。

## 创建作品

```http
POST /api/works
Authorization: Bearer <token>
```

::: warning 开发中
此接口正在开发中。
:::

## 更新作品

```http
PATCH /api/works/:id
Authorization: Bearer <token>
```

## 删除作品

```http
DELETE /api/works/:id
Authorization: Bearer <token>
```
