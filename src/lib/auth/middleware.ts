import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, type JwtPayload } from './index';

export type AuthenticatedRequest = NextRequest & {
  user: JwtPayload;
};

export type OptionalAuthenticatedRequest = NextRequest & {
  user?: JwtPayload;
};

// 认证中间件 - 用于 Route Handlers
export function withAuth<Context = unknown>(
  handler: (req: AuthenticatedRequest, context: Context) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: Context) => {
    const token = req.cookies.get('inkweave-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Token 无效或已过期' },
        { status: 401 }
      );
    }

    (req as AuthenticatedRequest).user = payload;
    return handler(req as AuthenticatedRequest, context);
  };
}

// 可选认证中间件 - 不强制登录但会解析用户
export function withOptionalAuth<Context = unknown>(
  handler: (req: OptionalAuthenticatedRequest, context: Context) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: Context) => {
    const token = req.cookies.get('inkweave-token')?.value;
    const authenticatedReq = req as OptionalAuthenticatedRequest;

    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        authenticatedReq.user = payload;
      }
    }

    return handler(authenticatedReq, context);
  };
}
