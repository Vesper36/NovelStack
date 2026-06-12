import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { withOptionalAuth } from '@/lib/auth/middleware';

// PATCH /api/comments/[id] - 更新评论
export const PATCH = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const [updated] = await db
      .update(comments)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, error: '评论不存在' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update comment error:', error);
    return NextResponse.json({ success: false, error: '更新评论失败' }, { status: 500 });
  }
});

// DELETE /api/comments/[id] - 删除评论
export const DELETE = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const { id } = await params;
    await db.delete(comments).where(eq(comments.id, id));

    return NextResponse.json({ success: true, message: '已删除' });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json({ success: false, error: '删除评论失败' }, { status: 500 });
  }
});
