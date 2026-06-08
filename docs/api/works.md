# 作品 API

## 获取作品列表

```http
GET /api/works
```

无需认证。

### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | number | 1 | 页码 |
| `limit` | number | 20 | 每页数量（最大 100） |
| `sort` | string | `latest` | 排序：`latest` / `popular` / `word_count` |
| `category` | string | - | 按分类筛选 |
| `rating` | string | - | 按分级筛选：`general` / `teen` / `mature` / `explicit` |
| `status` | string | `published` | 按状态筛选 |

### 响应 (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "cuid_xxx",
      "title": "作品标题",
      "slug": "zuo-pin-biao-ti",
      "description": "作品简介...",
      "coverUrl": null,
      "category": "奇幻",
      "wordCount": 50000,
      "viewCount": 1234,
      "favoriteCount": 56,
      "rating": "teen",
      "status": "published",
      "updatedAt": "2026-06-05T12:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasMore": true
  }
}
```

---

## 创建作品

```http
POST /api/works
```

需要认证。

### 请求体

```json
{
  "title": "新作品标题",
  "description": "作品简介",
  "category": "奇幻",
  "rating": "general",
  "visibility": "public",
  "language": "zh",
  "coverUrl": "https://example.com/cover.jpg",
  "tags": ["奇幻", "冒险"]
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | string | 是 | - | 作品标题 |
| `description` | string | 否 | - | 作品简介 |
| `category` | string | 否 | - | 分类 |
| `rating` | string | 否 | `general` | 内容分级 |
| `visibility` | string | 否 | `public` | 可见性：`public` / `private` / `link` |
| `language` | string | 否 | `zh` | 语言 |
| `coverUrl` | string | 否 | - | 封面 URL |
| `tagIds` | string[] | 否 | - | 已有标签 ID |
| `tags` | string[] | 否 | - | 标签名，自动创建（最多 10 个） |

### 响应 (201)

```json
{
  "success": true,
  "data": { "id": "cuid_xxx", "title": "新作品标题", "status": "draft", ... }
}
```

新作品默认状态为 `draft`。

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 400 | 缺少 `title` |
| 401 | 未认证 |

---

## 获取作品详情

```http
GET /api/works/:id
```

无需认证。非公开作品仅作者和 editor/moderator/admin 可见。

### 响应 (200)

```json
{
  "success": true,
  "data": {
    "id": "cuid_xxx",
    "title": "作品标题",
    "slug": "zuo-pin-biao-ti",
    "description": "作品简介",
    "coverUrl": null,
    "category": "奇幻",
    "rating": "teen",
    "visibility": "public",
    "status": "published",
    "wordCount": 50000,
    "viewCount": 1234,
    "favoriteCount": 56,
    "tags": [
      { "id": "tag_xxx", "name": "奇幻", "slug": "qi-huan", "color": "#6366f1" }
    ],
    "volumes": [
      {
        "id": "vol_xxx",
        "title": "第一卷",
        "sortOrder": 0,
        "chapters": [
          {
            "id": "ch_xxx",
            "title": "第一章",
            "slug": "chapter-1",
            "wordCount": 2500,
            "status": "published"
          }
        ]
      }
    ]
  }
}
```

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 404 | 作品不存在，或未发布且无权限 |

---

## 更新作品

```http
PATCH /api/works/:id
```

需要认证，必须是作品作者。

### 请求体（所有字段可选）

```json
{
  "title": "新标题",
  "description": "新简介",
  "category": "科幻",
  "rating": "mature",
  "visibility": "public",
  "status": "published",
  "coverUrl": "https://...",
  "tags": ["科幻", "冒险"]
}
```

`tags` 字段会替换所有已有标签，按名称自动创建（最多 10 个）。

### 响应 (200)

```json
{ "success": true, "data": { ...updated work } }
```

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 401 | 未认证 |
| 403 | 非作者 |
| 404 | 作品不存在 |

---

## 删除作品

```http
DELETE /api/works/:id
```

需要认证，必须是作品作者。

### 响应 (200)

```json
{ "success": true, "message": "已删除" }
```

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 401 | 未认证 |
| 403 | 非作者 |
| 404 | 作品不存在 |

---

## 获取我的作品

```http
GET /api/works/my
```

需要认证。返回当前用户的所有作品（不限状态）。

### 响应 (200)

```json
{
  "success": true,
  "data": [ { ...work, tags: [...] } ]
}
```
