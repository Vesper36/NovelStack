import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { works, volumes, chapters, users, tags, workTags } from '@/lib/db/schema';
import { eq, desc, count, sql } from 'drizzle-orm';
import { withAuth, type AuthenticatedRequest } from '@/lib/auth/middleware';

// GET /api/works/my - 获取当前用户的所有作品（含统计）
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;

    // 查询作品
    const userWorks = await db
      .select({
        id: works.id,
        title: works.title,
        slug: works.slug,
        description: works.description,
        coverUrl: works.coverUrl,
        status: works.status,
        visibility: works.visibility,
        category: works.category,
        wordCount: works.wordCount,
        viewCount: works.viewCount,
        favoriteCount: works.favoriteCount,
        rating: works.rating,
        language: works.language,
        publishAt: works.publishAt,
        createdAt: works.createdAt,
        updatedAt: works.updatedAt,
      })
      .from(works)
      .where(eq(works.authorId, req.user.userId))
      .orderBy(desc(works.updatedAt))
      .limit(limit)
      .offset(offset);

    // 统计总数
    const [{ total }] = await db
      .select({ total: count() })
      .from(works)
      .where(eq(works.authorId, req.user.userId));

    // 获取每个作品的卷章统计和标签
    const workIds = userWorks.map(w => w.id);

    const volumeCounts = workIds.length > 0
      ? await db
          .select({ workId: volumes.workId, count: count() })
          .from(volumes)
          .where(sql`${volumes.workId} IN (${sql.join(workIds.map(id => sql`${id}`), sql`, `)})`)
          .groupBy(volumes.workId)
      : [];

    const chapterCounts = workIds.length > 0
      ? await db
          .select({
            workId: chapters.workId,
            total: count(),
            published: sql<number>`SUM(CASE WHEN ${chapters.status} = 'published' THEN 1 ELSE 0 END)`,
          })
          .from(chapters)
          .where(sql`${chapters.workId} IN (${sql.join(workIds.map(id => sql`${id}`), sql`, `)})`)
          .groupBy(chapters.workId)
      : [];

    const workTagRows = workIds.length > 0
      ? await db
          .select({ workId: workTags.workId, tagName: tags.name, tagSlug: tags.slug, tagColor: tags.color })
          .from(workTags)
          .leftJoin(tags, eq(workTags.tagId, tags.id))
          .where(sql`${workTags.workId} IN (${sql.join(workIds.map(id => sql`${id}`), sql`, `)})`)
      : [];

    const volumeMap = new Map(volumeCounts.map(r => [r.workId, r.count]));
    const chapterMap = new Map(chapterCounts.map(r => [r.workId, { total: r.total, published: Number(r.published) }]));
    const tagMap = new Map<string, { name: string; slug: string; color: string | null }[]>();
    for (const row of workTagRows) {
      if (!tagMap.has(row.workId)) tagMap.set(row.workId, []);
      tagMap.get(row.workId)!.push({ name: row.tagName!, slug: row.tagSlug!, color: row.tagColor });
    }

    const data = userWorks.map(w => ({
      ...w,
      volumeCount: volumeMap.get(w.id) || 0,
      chapterCount: chapterMap.get(w.id)?.total || 0,
      publishedChapterCount: chapterMap.get(w.id)?.published || 0,
      tags: tagMap.get(w.id) || [],
    }));

    return NextResponse.json({
      success: true,
      data,
      meta: { page, limit, total, hasMore: offset + limit < total },
    });
  } catch (error) {
    console.error('[My Works Error]', error);
    return NextResponse.json(
      { success: false, error: '获取作品列表失败' },
      { status: 500 }
    );
  }
});
