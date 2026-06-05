# 标签 API

## 获取所有标签

```http
GET /api/tags
```

### 响应

```json
{
  "success": true,
  "data": [
    {
      "id": "tag_001",
      "name": "奇幻",
      "slug": "fantasy",
      "color": "#6366f1",
      "usageCount": 150,
      "category": "题材"
    }
  ]
}
```

## 获取标签详情

```http
GET /api/tags/:slug
```

### 响应

返回标签信息及包含该标签的作品列表。

## 标签分类

| 分类 | 标签示例 |
|------|----------|
| 题材 | 奇幻、科幻、现代、古代、架空 |
| 类型 | 言情、悬疑、恐怖、喜剧、冒险 |
| 配对 | BG、BL、GL、无CP |
| 状态 | 连载中、已完结、暂停 |

## 标签属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `name` | string | 标签名称 |
| `slug` | string | URL 友好标识 |
| `color` | string | 展示颜色（hex） |
| `usageCount` | number | 使用次数 |
| `category` | string | 所属分类 |
