# 认证 API

::: warning 开发中
用户认证系统正在开发中。当前版本暂无认证功能。
:::

## 计划中的 API

### 注册

```http
POST /api/auth/register
```

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

### 登录

```http
POST /api/auth/login
```

```json
{
  "email": "string",
  "password": "string"
}
```

响应：

```json
{
  "token": "jwt-token",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "avatarUrl": "string | null",
    "bio": "string | null"
  }
}
```

### 获取当前用户

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 登出

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

## 认证方式

采用 JWT (JSON Web Token) 认证：

- Token 存储在 localStorage
- 请求时通过 `Authorization: Bearer <token>` 头传递
- Token 过期时间: 7 天

## 预计时间线

认证系统将在 v0.3.0 版本中推出。
