import type { UserRole } from '@/lib/types';

// 角色权限矩阵
const ROLE_HIERARCHY: Record<UserRole, number> = {
  reader: 0,
  author: 1,
  editor: 2,
  moderator: 3,
  admin: 4,
};

// 检查角色是否满足最低要求
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// 资源操作权限
export function canPerformAction(
  userRole: UserRole,
  action: 'create' | 'read' | 'update' | 'delete' | 'moderate' | 'admin',
  resourceType: 'work' | 'chapter' | 'comment' | 'user' | 'tag' | 'report'
): boolean {
  const permissions: Record<string, Record<string, UserRole[]>> = {
    work: {
      create: ['author', 'editor', 'moderator', 'admin'],
      read: ['reader', 'author', 'editor', 'moderator', 'admin'],
      update: ['author', 'editor', 'moderator', 'admin'],
      delete: ['moderator', 'admin'],
    },
    chapter: {
      create: ['author', 'editor', 'moderator', 'admin'],
      read: ['reader', 'author', 'editor', 'moderator', 'admin'],
      update: ['author', 'editor', 'moderator', 'admin'],
      delete: ['moderator', 'admin'],
    },
    comment: {
      create: ['reader', 'author', 'editor', 'moderator', 'admin'],
      read: ['reader', 'author', 'editor', 'moderator', 'admin'],
      update: ['moderator', 'admin'],
      delete: ['moderator', 'admin'],
      moderate: ['moderator', 'admin'],
    },
    user: {
      read: ['reader', 'author', 'editor', 'moderator', 'admin'],
      update: ['admin'],
      delete: ['admin'],
      moderate: ['moderator', 'admin'],
    },
    tag: {
      create: ['author', 'editor', 'moderator', 'admin'],
      read: ['reader', 'author', 'editor', 'moderator', 'admin'],
      update: ['moderator', 'admin'],
      delete: ['admin'],
    },
    report: {
      create: ['reader', 'author', 'editor', 'moderator', 'admin'],
      read: ['moderator', 'admin'],
      moderate: ['moderator', 'admin'],
    },
  };

  const allowedRoles = permissions[resourceType]?.[action];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
}

// 资源所有者检查
export function isOwner(userId: string, resourceOwnerId: string): boolean {
  return userId === resourceOwnerId;
}

// 所有者或管理员
export function isOwnerOrHasRole(
  userId: string,
  resourceOwnerId: string,
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  return isOwner(userId, resourceOwnerId) || hasRole(userRole, requiredRole);
}
