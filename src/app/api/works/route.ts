import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { works, workTags, tags } from '@/lib/db/schema';
import { eq, desc, and, or, sql, count } from 'drizzle-orm';
import { withOptionalAuth } from '@/lib/auth/middleware';
import { generateSlug } from '@/lib/utils';
import type { ContentRating, WorkStatus } from '@/lib/types';

const WORK_STATUSES: WorkStatus[] = ['draft', 'reviewing', 'published', 'archived'];
const CONTENT_RATINGS: ContentRating[] = ['general', 'teen', 'mature', 'explicit'];

// GET /api/works - 获取作品列表
export const GET = withOptionalAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const sortBy = searchParams.get('sort') || 'latest';
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');
    const rating = searchParams.get('rating');
    const statusParam = searchParams.get('status');
    const status: WorkStatus = WORK_STATUSES.includes(statusParam as WorkStatus)
      ? (statusParam as WorkStatus)
      : 'published';
    const ratingFilter = CONTENT_RATINGS.includes(rating as ContentRating)
      ? (rating as ContentRating)
      : null;
    const offset = (page - 1) * limit;

    let whereClause = eq(works.status, status);
    if (category) whereClause = and(whereClause, eq(works.category, category))!;
    if (ratingFilter) whereClause = and(whereClause, eq(works.rating, ratingFilter))!;

    const orderByClause = sortBy === 'popular'
      ? desc(works.viewCount)
      : sortBy === 'word_count'
        ? desc(works.wordCount)
        : desc(works.updatedAt);

    const [totalResult] = await db.select({ count: count() }).from(works).where(whereClause);
    const total = totalResult?.count ?? 0;

    const result = await db
      .select({
        id: works.id,
        title: works.title,
        slug: works.slug,
        description: works.description,
        coverUrl: works.coverUrl,
        category: works.category,
        wordCount: works.wordCount,
        viewCount: works.viewCount,
        favoriteCount: works.favoriteCount,
        rating: works.rating,
        status: works.status,
        updatedAt: works.updatedAt,
      })
      .from(works)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: result,
      meta: { page, limit, total, hasMore: offset + limit < total },
    });
  } catch (error) {
    console.error('Get works error:', error);
    return NextResponse.json({ success: false, error: '获取作品列表失败' }, { status: 500 });
  }
});

// POST /api/works - 创建作品（需要认证）
export const POST = withOptionalAuth(async (req) => {
  try {
    if (!req.user) {
      return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, rating, visibility, language, coverUrl, tagIds, tags: tagNames } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: '标题不能为空' }, { status: 400 });
    }

    const slug = generateSlug(title);

    const newWork = db.transaction((tx) => {
      const createdWork = tx.insert(works).values({
        authorId: req.user!.userId,
        title,
        slug,
        description: description || null,
        category: category || null,
        rating: rating || 'general',
        visibility: visibility || 'public',
        language: language || 'zh',
        coverUrl: coverUrl || null,
        status: 'draft',
      }).returning().get();

      // 关联标签
      if (tagIds && tagIds.length > 0) {
        tx.insert(workTags).values(
          tagIds.map((tagId: string) => ({
            workId: createdWork.id,
            tagId,
          }))
        ).run();
      }

      if (Array.isArray(tagNames) && tagNames.length > 0) {
        const cleanedNames = [...new Set(tagNames.map((name) => String(name).trim()).filter(Boolean))].slice(0, 10);
        for (const name of cleanedNames) {
          const tagSlug = generateSlug(name);
          const existingTag = tx
            .select()
            .from(tags)
            .where(or(eq(tags.name, name), eq(tags.slug, tagSlug)))
            .limit(1)
            .get();
          const tag = existingTag ?? tx.insert(tags).values({
            name,
            slug: tagSlug,
            usageCount: 0,
          }).returning().get();

          tx.insert(workTags).values({
            workId: createdWork.id,
            tagId: tag.id,
          }).run();
        }
      }

      return createdWork;
    });

    return NextResponse.json({ success: true, data: newWork }, { status: 201 });
  } catch (error) {
    console.error('Create work error:', error);
    return NextResponse.json({ success: false, error: '创建作品失败' }, { status: 500 });
  }
});
