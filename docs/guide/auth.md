# 用户认证

InkWeave 内置完整的用户认证和权限管理系统。

## 认证方式

### JWT Token

- 使用 `jose` 库生成和验证 JWT
- Token 有效期：**7 天**
- 存储方式：**httpOnly Cookie**（防止 XSS 攻击）
- 密码加密：**bcryptjs**（salt rounds: 12）

### 认证流程

```
注册 -> 密码 bcrypt 加密 -> 存入数据库 -> 返回 JWT Cookie
登录 -> 验证邮箱密码 -> 签发 JWT Cookie
登出 -> 清除 Cookie
请求 -> 中间件验证 JWT -> 注入用户信息
```

## 注册

`POST /api/auth/register`

```json
{
  "email": "user@example.com",
  "username": "创作者",
  "password": "securePassword123"
}
```

验证规则：
- 邮箱格式合法
- 用户名 2-30 字符
- 密码至少 8 位

## 登录

`POST /api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

成功后自动设置 httpOnly Cookie。

## 获取当前用户

`GET /api/auth/me`

返回当前登录用户信息（需要认证 Cookie）。

## 登出

`POST /api/auth/logout`

清除认证 Cookie。

## 角色权限系统 (RBAC)

InkWeave 实现了五级角色权限系统：

### 角色层级

| 角色 | 说明 | 典型用户 |
|------|------|----------|
| `reader` | 读者 | 普通浏览用户 |
| `author` | 作者 | 创作者 |
| `editor` | 编辑 | 内容编辑 |
| `moderator` | 管理员 | 社区管理 |
| `admin` | 超级管理员 | 系统管理 |

### 权限矩阵

| 操作 | reader | author | editor | moderator | admin |
|------|--------|--------|--------|-----------|-------|
| 读取作品 | Y | Y | Y | Y | Y |
| 创建作品 | - | Y | Y | Y | Y |
| 编辑自己的作品 | - | Y | Y | Y | Y |
| 编辑任意作品 | - | - | Y | Y | Y |
| 删除作品 | - | - | - | Y | Y |
| 管理章节 | - | Y | Y | Y | Y |
| 发表评论 | Y | Y | Y | Y | Y |
| 删除评论 | - | - | - | Y | Y |
| 管理标签 | - | - | - | Y | Y |
| 管理用户 | - | - | - | - | Y |
| 内容审核 | - | - | - | Y | Y |
| 举报处理 | - | - | - | Y | Y |
| 系统配置 | - | - | - | - | Y |

### 权限检查

权限检查通过 `src/lib/auth/rbac.ts` 实现：

```typescript
import { hasPermission } from '@/lib/auth/rbac';

// 检查用户是否有某操作的权限
const canEdit = hasPermission(user.role, 'work', 'update');
```

## 认证中间件

API 路由通过中间件保护：

```typescript
import { authMiddleware } from '@/lib/auth/middleware';

// 在 API 路由中使用
export async function GET(req: Request) {
  const user = await authMiddleware(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... 业务逻辑
}
```

## 安全特性

| 特性 | 说明 |
|------|------|
| httpOnly Cookie | 防止 JavaScript 访问 Token |
| bcrypt 加密 | 密码不可逆加密存储 |
| JWT 过期 | 7 天自动过期 |
| CORS 配置 | 跨域请求限制 |
| 输入验证 | Zod schema 验证所有输入 |

## 前端状态管理

用户状态通过 Zustand `UserStore` 管理：

```typescript
// 获取当前用户
const { user, isLoading, logout } = useUserStore();

// 登出
await logout();
```

## 用户偏好

每个用户的阅读偏好独立存储在 `user_preferences` 表：

| 偏好 | 说明 |
|------|------|
| theme | 主题选择 |
| fontSize | 字体大小 |
| fontFamily | 字体 |
| lineHeight | 行高 |
| readingWidth | 阅读宽度 |
| darkMode | 暗色模式 |
| autoSave | 自动保存开关 |
| emailNotifications | 邮件通知 |
