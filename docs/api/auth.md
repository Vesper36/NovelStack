# 认证 API

认证系统使用 JWT Token，通过 httpOnly Cookie（`inkweave-token`）自动传递。

## 注册

```http
POST /api/auth/register
```

### 请求体

```json
{
  "name": "创作者",
  "email": "user@example.com",
  "password": "securePassword123"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 用户名 |
| `email` | string | 是 | 邮箱地址 |
| `password` | string | 是 | 密码，至少 8 位 |

### 成功响应 (200)

```json
{
  "success": true,
  "data": {
    "id": "cuid_xxx",
    "name": "创作者",
    "email": "user@example.com",
    "role": "author"
  }
}
```

新注册用户默认角色为 `author`。自动设置 `inkweave-token` Cookie。

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 400 | 缺少必填字段、邮箱格式无效、密码少于 8 位 |
| 409 | 邮箱已被注册 |

---

## 登录

```http
POST /api/auth/login
```

### 请求体

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### 成功响应 (200)

```json
{
  "success": true,
  "data": {
    "id": "cuid_xxx",
    "name": "创作者",
    "email": "user@example.com",
    "role": "author"
  }
}
```

自动设置 `inkweave-token` httpOnly Cookie（7 天有效期）。

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 400 | 缺少邮箱或密码 |
| 401 | 用户不存在、密码错误 |

---

## 获取当前用户

```http
GET /api/auth/me
```

需要认证（Cookie 中携带有效 token）。

### 成功响应 (200)

```json
{
  "success": true,
  "data": {
    "id": "cuid_xxx",
    "name": "创作者",
    "email": "user@example.com",
    "image": null,
    "bio": "个人简介",
    "role": "author",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 401 | 未登录或 token 无效 |
| 404 | 用户记录不存在 |

---

## 登出

```http
POST /api/auth/logout
```

无需请求体，无需认证。

### 成功响应 (200)

```json
{
  "success": true,
  "message": "已登出"
}
```

清除 `inkweave-token` Cookie。

---

## 认证机制

### Token 详情

| 属性 | 值 |
|------|-----|
| 算法 | HS256 |
| 有效期 | 7 天 |
| Cookie 名 | `inkweave-token` |
| Cookie 属性 | httpOnly, sameSite: lax, secure (生产环境) |
| Payload | `{ userId, email, role }` |

### 角色

| 角色 | 说明 |
|------|------|
| `reader` | 读者 |
| `author` | 作者（注册默认） |
| `editor` | 编辑 |
| `moderator` | 管理员 |
| `admin` | 超级管理员 |

### 中间件

| 中间件 | 说明 |
|--------|------|
| `withAuth` | 必须认证，否则返回 401 |
| `withOptionalAuth` | 可选认证，有 token 则解析 |
