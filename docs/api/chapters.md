# 章节 API

## 获取章节内容

```http
GET /api/works/:workSlug/chapters/:chapterSlug
```

### 响应

```json
{
  "id": "ch_001",
  "title": "第一章",
  "slug": "chapter-1",
  "contentMdx": "# 第一章...",
  "contentHtml": "<h1>第一章...</h1>",
  "wordCount": 2500,
  "readTimeEst": 10,
  "authorNote": "作者的话...",
  "publishedAt": "2026-06-05T12:00:00Z",
  "workTitle": "作品标题",
  "workSlug": "zuo-pin-biao-ti",
  "volumeTitle": "第一卷"
}
```

## 获取作品章节列表

```http
GET /api/works/:workId/chapters
```

### 响应

按卷分组返回所有已发布章节，包含卷章结构。

## 创建章节

```http
POST /api/works/:workId/chapters
Authorization: Bearer <token>
```

::: warning 开发中
此接口正在开发中。
:::

### 请求体

```json
{
  "title": "章节标题",
  "slug": "chapter-slug",
  "contentMdx": "# Markdown 内容",
  "volumeId": "vol_001",
  "sortOrder": 1,
  "authorNote": "可选的作者说明"
}
```

## 更新章节

```http
PATCH /api/chapters/:id
Authorization: Bearer <token>
```

## 章节元数据

| 字段 | 说明 |
|------|------|
| `wordCount` | 字数（自动计算） |
| `readTimeEst` | 预估阅读时间（分钟） |
| `authorNote` | 作者注释 |
| `sortOrder` | 排序位置 |
| `status` | 发布状态 |
