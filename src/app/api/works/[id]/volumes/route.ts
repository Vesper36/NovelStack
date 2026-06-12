import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { volumes } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { withOptionalAuth } from '@/lib/auth/middleware';

// GET /api/works/[id]/volumes - 获取卷列表
export const GET = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const result = await db
      .select()
      .from(volumes)
      .where(eq(volumes.workId, id))
      .orderBy(asc(volumes.sortOrder));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Get volumes error:', error);
    return NextResponse.json({ success: false, error: '获取卷列表失败' }, { status: 500 });
  }
});

// POST /api/works/[id]/volumes - 创建卷
export const POST = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, description, status } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: '卷标题不能为空' }, { status: 400 });
    }

    // 获取当前最大排序
    const existing = await db
      .select()
      .from(volumes)
      .where(eq(volumes.workId, id))
      .orderBy(asc(volumes.sortOrder));

    const sortOrder = existing.length;

    const [newVolume] = await db.insert(volumes).values({
      workId: id,
      title,
      description: description || null,
      sortOrder,
      status: status === 'draft' ? 'draft' : 'published',
    }).returning();

    return NextResponse.json({ success: true, data: newVolume }, { status: 201 });
  } catch (error) {
    console.error('Create volume error:', error);
    return NextResponse.json({ success: false, error: '创建卷失败' }, { status: 500 });
  }
});
