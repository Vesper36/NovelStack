import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { works, volumes, chapters, workTags, tags } from '@/lib/db/schema';
import { eq, and, or, asc, sql } from 'drizzle-orm';
import { withOptionalAuth } from '@/lib/auth/middleware';
import { generateSlug } from '@/lib/utils';

// GET /api/works/[id] - 获取作品详情
export const GET = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const [work] = await db.select().from(works).where(eq(works.id, id)).limit(1);

    if (!work) {
      return NextResponse.json({ success: false, error: '作品不存在' }, { status: 404 });
    }

    const canEdit = req.user?.userId === work.authorId || ['admin', 'editor', 'moderator'].includes(req.user?.role ?? '');
    if (work.status !== 'published' && !canEdit) {
      return NextResponse.json({ success: false, error: '作品不存在' }, { status: 404 });
    }

    // 获取卷章结构
    const workVolumes = await db
      .select()
      .from(volumes)
      .where(canEdit ? eq(volumes.workId, work.id) : and(eq(volumes.workId, work.id), eq(volumes.status, 'published')))
      .orderBy(asc(volumes.sortOrder));

    const volumeIds = workVolumes.map(v => v.id);
    const workChapters = volumeIds.length > 0
      ? await db.select().from(chapters).where(
          canEdit
            ? sql`${chapters.volumeId} IN (${sql.join(volumeIds.map(id => sql`${id}`), sql`, `)})`
            : and(
                sql`${chapters.volumeId} IN (${sql.join(volumeIds.map(id => sql`${id}`), sql`, `)})`,
                eq(chapters.status, 'published')
              )
        ).orderBy(asc(chapters.sortOrder))
      : [];

    // 获取标签
    const workTagRows = await db
      .select({ id: tags.id, name: tags.name, slug: tags.slug, color: tags.color })
      .from(workTags)
      .leftJoin(tags, eq(workTags.tagId, tags.id))
      .where(eq(workTags.workId, work.id));

    const volumesWithChapters = workVolumes.map(v => ({
      ...v,
      chapters: workChapters.filter(c => c.volumeId === v.id),
    }));

    return NextResponse.json({
      success: true,
      data: {
        ...work,
        tags: workTagRows,
        volumes: volumesWithChapters,
      },
    });
  } catch (error) {
    console.error('Get work detail error:', error);
    return NextResponse.json({ success: false, error: '获取作品详情失败' }, { status: 500 });
  }
});

// PATCH /api/works/[id] - 更新作品
export const PATCH = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
      tags: tagNames,
      title,
      description,
      category,
      rating,
      visibility,
      status,
      coverUrl,
      language,
      publishAt,
    } = body;

    // 检查作品是否存在且属于当前用户
    const [existing] = await db.select().from(works).where(eq(works.id, id)).limit(1);
    if (!existing) {
      return NextResponse.json({ success: false, error: '作品不存在' }, { status: 404 });
    }
    if (existing.authorId !== req.user.userId) {
      return NextResponse.json({ success: false, error: '无权编辑此作品' }, { status: 403 });
    }

    const [updated] = await db
      .update(works)
      .set({
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(rating !== undefined ? { rating } : {}),
        ...(visibility !== undefined ? { visibility } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(coverUrl !== undefined ? { coverUrl } : {}),
        ...(language !== undefined ? { language } : {}),
        ...(publishAt !== undefined ? { publishAt } : {}),
        updatedAt: new Date(),
      })
      .where(eq(works.id, id))
      .returning();

    if (Array.isArray(tagNames)) {
      await db.delete(workTags).where(eq(workTags.workId, id));

      const cleanedNames = [...new Set(tagNames.map((name) => String(name).trim()).filter(Boolean))].slice(0, 10);
      for (const name of cleanedNames) {
        const slug = generateSlug(name);
        const [existingTag] = await db
          .select()
          .from(tags)
          .where(or(eq(tags.name, name), eq(tags.slug, slug)))
          .limit(1);
        const tag = existingTag ?? (await db.insert(tags).values({
          name,
          slug,
          usageCount: 0,
        }).returning())[0];

        await db.insert(workTags).values({ workId: id, tagId: tag.id });
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update work error:', error);
    return NextResponse.json({ success: false, error: '更新作品失败' }, { status: 500 });
  }
});

// DELETE /api/works/[id] - 删除作品
export const DELETE = withOptionalAuth(async (req, { params }: { params: Promise<{ id: string }> }) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const { id } = await params;

    const [existing] = await db.select().from(works).where(eq(works.id, id)).limit(1);
    if (!existing) {
      return NextResponse.json({ success: false, error: '作品不存在' }, { status: 404 });
    }
    if (existing.authorId !== req.user.userId) {
      return NextResponse.json({ success: false, error: '无权删除此作品' }, { status: 403 });
    }

    await db.delete(works).where(eq(works.id, id));

    return NextResponse.json({ success: true, message: '已删除' });
  } catch (error) {
    console.error('Delete work error:', error);
    return NextResponse.json({ success: false, error: '删除作品失败' }, { status: 500 });
  }
});
