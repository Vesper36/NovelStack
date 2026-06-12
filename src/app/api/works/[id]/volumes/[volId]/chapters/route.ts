import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chapters } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { withOptionalAuth } from '@/lib/auth/middleware';
import { generateSlug, countWords, estimateReadingTime } from '@/lib/utils';

// GET /api/works/[id]/volumes/[volId]/chapters - 获取章节列表
export const GET = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string; volId: string }> }) => {
  try {
    const { volId } = await params;
    const result = await db
      .select()
      .from(chapters)
      .where(eq(chapters.volumeId, volId))
      .orderBy(asc(chapters.sortOrder));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Get chapters error:', error);
    return NextResponse.json({ success: false, error: '获取章节列表失败' }, { status: 500 });
  }
});

// POST /api/works/[id]/volumes/[volId]/chapters - 创建章节
export const POST = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string; volId: string }> }) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const { id: workId, volId } = await params;
    const body = await req.json();
    const { title, contentMdx, authorNote } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: '章节标题不能为空' }, { status: 400 });
    }

    const slug = generateSlug(title);
    const wordCount = contentMdx ? countWords(contentMdx) : 0;
    const readTimeEst = contentMdx ? estimateReadingTime(contentMdx) : 0;

    // 获取当前最大排序
    const existing = await db
      .select()
      .from(chapters)
      .where(eq(chapters.volumeId, volId))
      .orderBy(asc(chapters.sortOrder));

    const sortOrder = existing.length;

    const [newChapter] = await db.insert(chapters).values({
      workId,
      volumeId: volId,
      title,
      slug,
      contentMdx: contentMdx || null,
      contentHtml: null, // 编译后更新
      sortOrder,
      status: 'draft',
      wordCount,
      readTimeEst,
      authorNote: authorNote || null,
    }).returning();

    return NextResponse.json({ success: true, data: newChapter }, { status: 201 });
  } catch (error) {
    console.error('Create chapter error:', error);
    return NextResponse.json({ success: false, error: '创建章节失败' }, { status: 500 });
  }
});
