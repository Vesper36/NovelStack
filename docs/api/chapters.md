# 章节 API

## 获取章节内容

```http
GET /api/chapters/:id
```

无需认证。

### 响应 (200)

```json
{
  "success": true,
  "data": {
    "id": "ch_xxx",
    "volumeId": "vol_xxx",
    "workId": "work_xxx",
    "title": "第一章",
    "slug": "chapter-1",
    "contentMdx": "# 第一章\n\n正文内容...",
    "contentHtml": "<h1>第一章</h1><p>正文内容...</p>",
    "sortOrder": 0,
    "status": "published",
    "wordCount": 2500,
    "readTimeEst": 10,
    "authorNote": "作者的话...",
    "publishedAt": "2026-06-05T12:00:00Z",
    "createdAt": "2026-06-01T00:00:00Z",
    "updatedAt": "2026-06-05T12:00:00Z"
  }
}
```

| 字段 | 说明 |
|------|------|
| `contentMdx` | Markdown 源码 |
| `contentHtml` | 编译后的 HTML |
| `wordCount` | 字数（自动计算） |
| `readTimeEst` | 预估阅读时间（分钟） |
| `authorNote` | 作者有话说 |

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 404 | 章节不存在 |

---

## 更新章节

```http
PATCH /api/chapters/:id
```

需要认证。

### 请求体

支持更新章节表的任意字段。如果提供 `contentMdx`，会自动重新计算 `wordCount` 和 `readTimeEst`，并重新编译 `contentHtml`。

```json
{
  "title": "新标题",
  "contentMdx": "# 更新后的内容...",
  "status": "published",
  "sortOrder": 1,
  "authorNote": "更新的作者笔记"
}
```

### 响应 (200)

```json
{ "success": true, "data": { ...updated chapter } }
```

---

## 删除章节

```http
DELETE /api/chapters/:id
```

需要认证。

### 响应 (200)

```json
{ "success": true, "message": "已删除" }
```

---

## 保存草稿快照

```http
PUT /api/chapters/:id/draft
```

需要认证。创建一个新的版本化草稿快照。

### 请求体

```json
{
  "contentMdx": "# 草稿内容...",
  "title": "草稿标题"
}
```

### 行为

1. 查询该章节当前最大版本号
2. 版本号 +1
3. 插入新的 `draftVersions` 记录

### 响应 (200)

```json
{
  "success": true,
  "data": {
    "id": "dv_xxx",
    "chapterId": "ch_xxx",
    "contentMdx": "# 草稿内容...",
    "title": "草稿标题",
    "version": 5,
    "createdAt": "2026-06-05T12:00:00Z"
  }
}
```

---

## 获取最新草稿

```http
GET /api/chapters/:id/draft
```

无需认证。

### 响应 (200)

返回最新版本的草稿快照，或 `null`（无草稿时）。

```json
{
  "success": true,
  "data": {
    "id": "dv_xxx",
    "chapterId": "ch_xxx",
    "contentMdx": "# 最新草稿...",
    "title": "草稿标题",
    "version": 5,
    "createdAt": "2026-06-05T12:00:00Z"
  }
}
```

---

## 获取草稿版本历史

```http
GET /api/chapters/:id/versions
```

无需认证。

### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `limit` | number | 20 | 返回版本数量 |

按版本号倒序排列。

### 响应 (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "dv_xxx",
      "version": 5,
      "title": "草稿标题",
      "createdAt": "2026-06-05T12:00:00Z"
    },
    {
      "id": "dv_yyy",
      "version": 4,
      "title": "旧草稿",
      "createdAt": "2026-06-04T12:00:00Z"
    }
  ]
}
```

---

## 章节状态

| 状态 | 说明 | 可见性 |
|------|------|--------|
| `draft` | 草稿 | 仅作者 |
| `reviewing` | 审核中 | 仅作者 |
| `published` | 已发布 | 公开 |
| `archived` | 已归档 | 只读 |
