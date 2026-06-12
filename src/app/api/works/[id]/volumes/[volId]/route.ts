import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { volumes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { withOptionalAuth } from '@/lib/auth/middleware';

// PATCH /api/works/[id]/volumes/[volId] - 更新卷
export const PATCH = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string; volId: string }> }) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const { volId } = await params;
    const body = await req.json();

    const [updated] = await db
      .update(volumes)
      .set(body)
      .where(eq(volumes.id, volId))
      .returning();

    if (!updated) {
      return NextResponse.json({ success: false, error: '卷不存在' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update volume error:', error);
    return NextResponse.json({ success: false, error: '更新卷失败' }, { status: 500 });
  }
});

// DELETE /api/works/[id]/volumes/[volId] - 删除卷
export const DELETE = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string; volId: string }> }) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const { volId } = await params;
    await db.delete(volumes).where(eq(volumes.id, volId));

    return NextResponse.json({ success: true, message: '已删除' });
  } catch (error) {
    console.error('Delete volume error:', error);
    return NextResponse.json({ error: '删除卷失败' }, { status: 500 });
  }
});
