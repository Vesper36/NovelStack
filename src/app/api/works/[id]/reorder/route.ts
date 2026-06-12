import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { works, volumes, chapters } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { withAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';

// PATCH /api/works/[id]/reorder - 重新排序卷/章
export const PATCH = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    // /api/works/[id]/reorder
    const workId = pathParts[4];

    if (!workId) {
      return NextResponse.json(
        { success: false, error: '缺少作品 ID' },
        { status: 400 }
      );
    }

    // 验证所有权
    const [work] = await db
      .select({ authorId: works.authorId })
      .from(works)
      .where(eq(works.id, workId))
      .limit(1);

    if (!work) {
      return NextResponse.json(
        { success: false, error: '作品不存在' },
        { status: 404 }
      );
    }

    if (work.authorId !== req.user.userId) {
      return NextResponse.json(
        { success: false, error: '无权操作此作品' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { volumes: volumeOrders, chapters: chapterOrders } = body as {
      volumes?: { id: string; sortOrder: number }[];
      chapters?: { id: string; sortOrder: number; volumeId: string }[];
    };

    const updates: Promise<unknown>[] = [];

    if (volumeOrders && Array.isArray(volumeOrders)) {
      for (const item of volumeOrders) {
        updates.push(
          db.update(volumes)
            .set({ sortOrder: item.sortOrder })
            .where(and(eq(volumes.id, item.id), eq(volumes.workId, workId)))
        );
      }
    }

    if (chapterOrders && Array.isArray(chapterOrders)) {
      for (const item of chapterOrders) {
        updates.push(
          db.update(chapters)
            .set({ sortOrder: item.sortOrder, volumeId: item.volumeId })
            .where(and(eq(chapters.id, item.id), eq(chapters.workId, workId)))
        );
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: '无有效的排序数据' },
        { status: 400 }
      );
    }

    await Promise.all(updates);

    return NextResponse.json({ success: true, message: '排序已更新' });
  } catch (error) {
    console.error('[Reorder Error]', error);
    return NextResponse.json(
      { success: false, error: '排序更新失败' },
      { status: 500 }
    );
  }
});
