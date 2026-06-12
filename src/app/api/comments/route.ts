import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { withOptionalAuth } from '@/lib/auth/middleware';

// GET /api/comments?chapterId=xxx - 获取评论列表
export const GET = withOptionalAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get('chapterId');

    if (!chapterId) {
      return NextResponse.json({ success: false, error: '缺少章节 ID' }, { status: 400 });
    }

    const result = await db
      .select()
      .from(comments)
      .where(and(eq(comments.chapterId, chapterId), eq(comments.status, 'active')))
      .orderBy(desc(comments.createdAt));

    // 构建嵌套评论树
    const rootComments = result.filter(c => !c.parentId);
    const commentTree = rootComments.map(root => ({
      ...root,
      replies: result.filter(c => c.parentId === root.id),
    }));

    return NextResponse.json({ success: true, data: commentTree });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json({ success: false, error: '获取评论失败' }, { status: 500 });
  }
});

// POST /api/comments - 发表评论
export const POST = withOptionalAuth(async (req) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const body = await req.json();
    const { chapterId, content, parentId } = body;

    if (!chapterId || !content) {
      return NextResponse.json({ success: false, error: '评论内容不能为空' }, { status: 400 });
    }

    const [newComment] = await db.insert(comments).values({
      userId: req.user.userId,
      chapterId,
      content,
      parentId: parentId || null,
    }).returning();

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ success: false, error: '发表评论失败' }, { status: 500 });
  }
});
