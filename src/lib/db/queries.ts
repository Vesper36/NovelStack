import { db } from './index';
import { eq, desc, asc, and, sql, count } from 'drizzle-orm';
import * as schema from './schema';

const { works, volumes, chapters, tags, workTags, users, favorites, comments } = schema;

// ========== 作品查询 ==========

/** 获取已发布作品列表（含作者、标签） */
export async function getPublishedWorks(options?: {
  limit?: number;
  offset?: number;
  tag?: string;
  category?: string;
  sortBy?: 'latest' | 'popular' | 'word_count';
}) {
  const { limit = 20, offset = 0, sortBy = 'latest' } = options || {};

  const orderByClause = sortBy === 'popular'
    ? desc(works.viewCount)
    : sortBy === 'word_count'
      ? desc(works.wordCount)
      : desc(works.updatedAt);

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
      authorName: users.name,
      authorId: users.id,
    })
    .from(works)
    .leftJoin(users, eq(works.authorId, users.id))
    .where(eq(works.status, 'published'))
    .orderBy(orderByClause)
    .limit(limit)
    .offset(offset);

  // 获取每个作品的标签
  const workIds = result.map(w => w.id);
  const workTagRows = workIds.length > 0
    ? await db
        .select({ workId: workTags.workId, tagName: tags.name, tagSlug: tags.slug, tagColor: tags.color })
        .from(workTags)
        .leftJoin(tags, eq(workTags.tagId, tags.id))
        .where(sql`${workTags.workId} IN (${sql.join(workIds.map(id => sql`${id}`), sql`, `)})`)
    : [];

  const tagMap = new Map<string, { name: string; slug: string; color: string | null }[]>();
  for (const row of workTagRows) {
    if (!tagMap.has(row.workId)) tagMap.set(row.workId, []);
    tagMap.get(row.workId)!.push({ name: row.tagName!, slug: row.tagSlug!, color: row.tagColor });
  }

  return result.map(w => ({
    ...w,
    tags: tagMap.get(w.id) || [],
  }));
}

/** 获取作品总数 */
export async function getPublishedWorksCount() {
  const [result] = await db
    .select({ count: count() })
    .from(works)
    .where(eq(works.status, 'published'));
  return result?.count ?? 0;
}

/** 根据 slug 获取作品详情（含卷章结构） */
export async function getWorkBySlug(slug: string) {
  const work = await db
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
      language: works.language,
      createdAt: works.createdAt,
      updatedAt: works.updatedAt,
      authorName: users.name,
      authorId: users.id,
      authorBio: users.bio,
    })
    .from(works)
    .leftJoin(users, eq(works.authorId, users.id))
    .where(and(eq(works.slug, slug), eq(works.status, 'published')))
    .limit(1);

  if (!work[0]) return null;

  // 获取卷
  const workVolumes = await db
    .select()
    .from(volumes)
    .where(and(eq(volumes.workId, work[0].id), eq(volumes.status, 'published')))
    .orderBy(asc(volumes.sortOrder));

  // 获取章节
  const volumeIds = workVolumes.map(v => v.id);
  const workChapters = volumeIds.length > 0
    ? await db
        .select()
        .from(chapters)
        .where(
          and(
            sql`${chapters.volumeId} IN (${sql.join(volumeIds.map(id => sql`${id}`), sql`, `)})`,
            eq(chapters.status, 'published')
          )
        )
        .orderBy(asc(chapters.sortOrder))
    : [];

  // 获取标签
  const workTagRows = await db
    .select({ tagName: tags.name, tagSlug: tags.slug, tagColor: tags.color })
    .from(workTags)
    .leftJoin(tags, eq(workTags.tagId, tags.id))
    .where(eq(workTags.workId, work[0].id));

  // 组装卷章树
  const volumesWithChapters = workVolumes.map(v => ({
    ...v,
    chapters: workChapters.filter(c => c.volumeId === v.id),
  }));

  return {
    ...work[0],
    tags: workTagRows.map(t => ({ name: t.tagName!, slug: t.tagSlug!, color: t.tagColor })),
    volumes: volumesWithChapters,
  };
}

/** 增加作品浏览量 */
export async function incrementViewCount(workId: string) {
  await db
    .update(works)
    .set({ viewCount: sql`${works.viewCount} + 1` })
    .where(eq(works.id, workId));
}

// ========== 章节查询 ==========

/** 根据 work slug + chapter slug 获取章节内容 */
export async function getChapterBySlugs(workSlug: string, chapterSlug: string) {
  const result = await db
    .select({
      id: chapters.id,
      title: chapters.title,
      slug: chapters.slug,
      contentMdx: chapters.contentMdx,
      contentHtml: chapters.contentHtml,
      wordCount: chapters.wordCount,
      readTimeEst: chapters.readTimeEst,
      authorNote: chapters.authorNote,
      publishedAt: chapters.publishedAt,
      sortOrder: chapters.sortOrder,
      volumeId: chapters.volumeId,
      workId: chapters.workId,
      workTitle: works.title,
      workSlug: works.slug,
      volumeTitle: volumes.title,
    })
    .from(chapters)
    .leftJoin(works, eq(chapters.workId, works.id))
    .leftJoin(volumes, eq(chapters.volumeId, volumes.id))
    .where(
      and(
        eq(works.slug, workSlug),
        eq(chapters.slug, chapterSlug),
        eq(chapters.status, 'published')
      )
    )
    .limit(1);

  return result[0] || null;
}

/** 获取同作品下的前后章节 */
export async function getAdjacentChapters(workId: string, volumeId: string, sortOrder: number) {
  const allChapters = await db
    .select({ id: chapters.id, title: chapters.title, slug: chapters.slug, sortOrder: chapters.sortOrder, volumeId: chapters.volumeId })
    .from(chapters)
    .where(and(eq(chapters.workId, workId), eq(chapters.status, 'published')))
    .orderBy(asc(chapters.volumeId), asc(chapters.sortOrder));

  const currentIndex = allChapters.findIndex(c => c.sortOrder === sortOrder && c.volumeId === volumeId);
  return {
    prev: currentIndex > 0 ? allChapters[currentIndex - 1] : null,
    next: currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null,
  };
}

// ========== 标签查询 ==========

/** 获取所有标签 */
export async function getAllTags() {
  return db
    .select()
    .from(tags)
    .orderBy(desc(tags.usageCount));
}

/** 获取标签按分类分组 */
export async function getTagsGrouped() {
  const allTags = await getAllTags();
  const grouped: Record<string, typeof allTags> = {};
  for (const tag of allTags) {
    const cat = tag.category || '其他';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(tag);
  }
  return grouped;
}

// ========== 搜索 ==========

/** 全文搜索作品（基于 LIKE，后续替换为 Meilisearch） */
export async function searchWorks(query: string, limit = 20) {
  return db
    .select({
      id: works.id,
      title: works.title,
      slug: works.slug,
      description: works.description,
      category: works.category,
      wordCount: works.wordCount,
      viewCount: works.viewCount,
      authorName: users.name,
    })
    .from(works)
    .leftJoin(users, eq(works.authorId, users.id))
    .where(
      and(
        eq(works.status, 'published'),
        sql`${works.title} LIKE ${'%' + query + '%'} OR ${works.description} LIKE ${'%' + query + '%'}`
      )
    )
    .limit(limit);
}

// ========== 统计 ==========

/** 获取首页统计数据 */
export async function getSiteStats() {
  const [workCount] = await db.select({ count: count() }).from(works).where(eq(works.status, 'published'));
  const [chapterCount] = await db.select({ count: count() }).from(chapters).where(eq(chapters.status, 'published'));
  const [userCount] = await db.select({ count: count() }).from(users);
  const [tagCount] = await db.select({ count: count() }).from(tags);

  return {
    works: workCount?.count ?? 0,
    chapters: chapterCount?.count ?? 0,
    users: userCount?.count ?? 0,
    tags: tagCount?.count ?? 0,
  };
}
