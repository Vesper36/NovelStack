import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { favorites } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { withOptionalAuth } from '@/lib/auth/middleware';

// GET /api/favorites - 获取用户收藏
export const GET = withOptionalAuth(async (req) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const result = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, req.user.userId));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Get favorites error:', error);
    return NextResponse.json({ success: false, error: '获取收藏失败' }, { status: 500 });
  }
});

// POST /api/favorites - 收藏作品
export const POST = withOptionalAuth(async (req) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const body = await req.json();
    const { workId } = body;

    if (!workId) {
      return NextResponse.json({ success: false, error: '作品 ID 不能为空' }, { status: 400 });
    }

    // 检查是否已收藏
    const existing = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, req.user.userId), eq(favorites.workId, workId)));

    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: '已收藏' }, { status: 409 });
    }

    await db.insert(favorites).values({
      userId: req.user.userId,
      workId,
    });

    return NextResponse.json({ success: true, message: '已收藏' }, { status: 201 });
  } catch (error) {
    console.error('Add favorite error:', error);
    return NextResponse.json({ success: false, error: '收藏失败' }, { status: 500 });
  }
});

// DELETE /api/favorites - 取消收藏
export const DELETE = withOptionalAuth(async (req) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const { workId } = await req.json();

    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, req.user.userId), eq(favorites.workId, workId)));

    return NextResponse.json({ success: true, message: '已取消收藏' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    return NextResponse.json({ success: false, error: '取消收藏失败' }, { status: 500 });
  }
});
