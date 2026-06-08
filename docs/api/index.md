# API 概览

InkWeave 的 API 通过 Next.js API Routes 实现，遵循 RESTful 规范。

::: tip 当前状态
所有 API 均通过 Next.js App Router 的 Route Handlers 实现。FastAPI 后端为未来规划。
:::

## 基础 URL

```
开发环境: http://localhost:50040/api
生产环境: https://novelstack.demo.vesper36.cc/api
```

## API 路由总览

### 认证 (4 个)

| 路由 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/api/auth/register` | POST | 用户注册 | 否 |
| `/api/auth/login` | POST | 用户登录 | 否 |
| `/api/auth/logout` | POST | 用户登出 | 否 |
| `/api/auth/me` | GET | 获取当前用户 | 是 |

### 作品 (5 个)

| 路由 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/api/works` | GET | 获取已发布作品列表 | 否 |
| `/api/works` | POST | 创建新作品 | 是 (author+) |
| `/api/works/my` | GET | 获取当前用户的作品 | 是 |
| `/api/works/[id]` | GET/PATCH/DELETE | 作品详情/更新/删除 | 视操作 |
| `/api/works/[id]/reorder` | POST | 重新排序卷章 | 是 (author+) |

### 卷 (3 个)

| 路由 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/api/works/[id]/volumes` | POST | 创建卷 | 是 (author+) |
| `/api/works/[id]/volumes/[volId]` | PATCH/DELETE | 更新/删除卷 | 是 (author+) |
| `/api/works/[id]/volumes/[volId]/chapters` | POST | 在卷下创建章节 | 是 (author+) |

### 章节 (3 个)

| 路由 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/api/chapters/[id]` | GET/PATCH/DELETE | 章节详情/更新/删除 | 视操作 |
| `/api/chapters/[id]/draft` | PUT | 保存草稿快照 | 是 (author+) |
| `/api/chapters/[id]/versions` | GET | 获取草稿版本历史 | 是 (author+) |

### 社交 (4 个)

| 路由 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/api/comments` | GET/POST | 获取/发表评论 | 视操作 |
| `/api/comments/[id]` | PATCH/DELETE | 更新/删除评论 | 是 |
| `/api/favorites` | GET/POST/DELETE | 收藏管理 | 是 |
| `/api/reports` | POST | 内容举报 | 是 |

### 其他 (3 个)

| 路由 | 方法 | 说明 | 认证 |
|------|------|------|------|
| `/api/search` | GET | 搜索作品 | 否 |
| `/api/tags` | GET/POST | 获取/创建标签 | 视操作 |
| `/api/upload` | POST | 文件上传 | 是 |

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

API 使用 JWT Token 认证，通过 httpOnly Cookie 自动传递：

```http
Cookie: token=<jwt-token>
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
| `sort=latest` | 按更新时间倒序 |
| `sort=popular` | 按浏览量倒序 |
| `sort=word_count` | 按字数倒序 |
