import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { chapters, draftVersions, works } from '@/lib/db/schema';
import type { JwtPayload } from '@/lib/auth';
import type { UserRole } from '@/lib/types';

const managerRoles = new Set<UserRole>(['admin', 'editor', 'moderator']);

export type ChapterAccess = {
  chapter: typeof chapters.$inferSelect;
  work: typeof works.$inferSelect;
  canEdit: boolean;
  canRead: boolean;
};

export async function getChapterAccess(chapterId: string, user?: JwtPayload): Promise<ChapterAccess | null> {
  const [row] = await db
    .select({
      chapter: chapters,
      work: works,
    })
    .from(chapters)
    .innerJoin(works, eq(chapters.workId, works.id))
    .where(eq(chapters.id, chapterId))
    .limit(1);

  if (!row) {
    return null;
  }

  const role = user?.role as UserRole | undefined;
  const canManage = role ? managerRoles.has(role) : false;
  const canEdit = Boolean(user && (user.userId === row.work.authorId || canManage));
  const isPublishedPublic =
    row.chapter.status === 'published' &&
    row.work.status === 'published' &&
    row.work.visibility !== 'private';

  return {
    ...row,
    canEdit,
    canRead: canEdit || isPublishedPublic,
  };
}

export async function findChapterDraftVersion(chapterId: string, versionId: string) {
  const [version] = await db
    .select()
    .from(draftVersions)
    .where(and(eq(draftVersions.chapterId, chapterId), eq(draftVersions.id, versionId)))
    .limit(1);

  return version ?? null;
}
