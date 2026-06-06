# API 概览

NovelStack 的 API 设计遵循 RESTful 规范。

::: warning 开发中
API 接口正在开发中，当前版本通过 Next.js API Routes 提供服务。FastAPI 后端计划在后续版本中引入。
:::

## 端口

| 服务 | 端口 | 说明 |
|------|------|------|
| 前端 | 51637 | Next.js 应用 |
| API | 51638 | FastAPI 后端（规划中） |
| 搜索 | 51639 | Meilisearch |

## 基础 URL

```
开发环境: http://localhost:51638
生产环境: https://your-domain.com/api
```

## API 路由

| 路由 | 方法 | 说明 |
|------|------|------|
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/logout` | POST | 用户登出 |
| `/api/auth/me` | GET | 获取当前用户 |
| `/api/works` | GET | 获取作品列表 |
| `/api/works/:slug` | GET | 获取作品详情 |
| `/api/works/:id/chapters` | GET | 获取章节列表 |
| `/api/search` | GET | 搜索 |
| `/api/tags` | GET | 获取标签列表 |
| `/api/tags/:slug` | GET | 获取标签详情 |
| `/api/upload` | POST | 上传文件 |

## 响应格式

### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数无效",
    "details": [...]
  }
}
```

## 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 422 | 数据验证失败 |
| 500 | 服务器内部错误 |

## 认证

API 使用 JWT Token 认证：

```http
Authorization: Bearer <token>
```

详见 [认证 API](/api/auth)

## 分页

列表接口支持分页参数：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | number | 1 | 页码 |
| `limit` | number | 20 | 每页数量 (最大 100) |

## 排序

| 参数 | 说明 |
|------|------|
| `sort=createdAt` | 按创建时间排序 |
| `sort=-updatedAt` | 按更新时间倒序 |
| `sort=-wordCount` | 按字数倒序 |
