# 标签 API

## 获取所有标签

```http
GET /api/tags
```

无需认证。按使用次数降序排列。

### 响应 (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "tag_xxx",
      "name": "奇幻",
      "slug": "qi-huan",
      "description": null,
      "color": "#6366f1",
      "category": "题材",
      "usageCount": 150,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

---

## 创建标签

```http
POST /api/tags
```

需要认证。

### 请求体

```json
{
  "name": "新标签",
  "description": "标签描述",
  "color": "#6366f1",
  "category": "题材"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 标签名称 |
| `description` | string | 否 | 标签描述 |
| `color` | string | 否 | 展示颜色（hex） |
| `category` | string | 否 | 所属分类 |

### 响应 (201)

```json
{
  "success": true,
  "data": {
    "id": "tag_new",
    "name": "新标签",
    "slug": "xin-biao-qian",
    "description": "标签描述",
    "color": "#6366f1",
    "category": "题材",
    "usageCount": 0,
    "createdAt": "2026-06-05T12:00:00Z"
  }
}
```

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 400 | 缺少 `name` |
| 401 | 未认证 |

---

## 标签分类

| 分类 | 示例标签 |
|------|----------|
| 题材 | 奇幻、科幻、现代、古代、架空、未来、末日、校园、都市、仙侠 |
| 类型 | 言情、悬疑、恐怖、喜剧、悲剧、冒险、推理、日常、热血、治愈 |
| 配对 | BG、BL、GL、无CP、多CP、逆CP |
| 状态 | 连载中、已完结、暂停、弃坑 |

---

## 标签属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识 |
| `name` | string | 标签名称 |
| `slug` | string | URL 友好标识（自动生成） |
| `description` | string | 标签描述 |
| `color` | string | 展示颜色 |
| `category` | string | 所属分类 |
| `usageCount` | number | 使用次数（自动维护） |
| `createdAt` | Date | 创建时间 |
