import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { draftVersions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { withOptionalAuth } from '@/lib/auth/middleware';

// GET /api/chapters/[id]/draft - 获取最新草稿
export const GET = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const [latest] = await db
      .select()
      .from(draftVersions)
      .where(eq(draftVersions.chapterId, id))
      .orderBy(desc(draftVersions.version))
      .limit(1);

    return NextResponse.json({ success: true, data: latest || null });
  } catch (error) {
    console.error('Get draft error:', error);
    return NextResponse.json({ success: false, error: '获取草稿失败' }, { status: 500 });
  }
});

// PUT /api/chapters/[id]/draft - 保存草稿（自动保存）
export const PUT = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { contentMdx, title } = body;

    // 获取当前最新版本号
    const [latest] = await db
      .select()
      .from(draftVersions)
      .where(eq(draftVersions.chapterId, id))
      .orderBy(desc(draftVersions.version))
      .limit(1);

    const nextVersion = (latest?.version || 0) + 1;

    const [draft] = await db.insert(draftVersions).values({
      chapterId: id,
      contentMdx: contentMdx || null,
      title: title || null,
      version: nextVersion,
    }).returning();

    return NextResponse.json({ success: true, data: draft });
  } catch (error) {
    console.error('Save draft error:', error);
    return NextResponse.json({ success: false, error: '保存草稿失败' }, { status: 500 });
  }
});
