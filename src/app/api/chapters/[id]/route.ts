import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { withOptionalAuth } from '@/lib/auth/middleware';
import { countWords, estimateReadingTime } from '@/lib/utils';
import { compileMdx } from '@/lib/mdx';

// GET /api/chapters/[id] - 获取章节详情
export const GET = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const [chapter] = await db.select().from(chapters).where(eq(chapters.id, id)).limit(1);

    if (!chapter) {
      return NextResponse.json({ success: false, error: '章节不存在' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: chapter });
  } catch (error) {
    console.error('Get chapter error:', error);
    return NextResponse.json({ success: false, error: '获取章节失败' }, { status: 500 });
  }
});

// PATCH /api/chapters/[id] - 更新章节
export const PATCH = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const [existing] = await db.select().from(chapters).where(eq(chapters.id, id)).limit(1);
    if (!existing) {
      return NextResponse.json({ success: false, error: '章节不存在' }, { status: 404 });
    }

    const updates: Record<string, unknown> = { ...body, updatedAt: new Date() };

    // 如果更新了内容，重新计算字数和编译
    if (body.contentMdx) {
      updates.wordCount = countWords(body.contentMdx);
      updates.readTimeEst = estimateReadingTime(body.contentMdx);

      try {
        const { content } = await compileMdx(body.contentMdx);
        updates.contentHtml = content;
      } catch {
        // 编译失败不阻塞保存
      }
    }

    const [updated] = await db
      .update(chapters)
      .set(updates)
      .where(eq(chapters.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update chapter error:', error);
    return NextResponse.json({ success: false, error: '更新章节失败' }, { status: 500 });
  }
});

// DELETE /api/chapters/[id] - 删除章节
export const DELETE = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const { id } = await params;
    await db.delete(chapters).where(eq(chapters.id, id));

    return NextResponse.json({ success: true, message: '已删除' });
  } catch (error) {
    console.error('Delete chapter error:', error);
    return NextResponse.json({ success: false, error: '删除章节失败' }, { status: 500 });
  }
});
