import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BookOpen, CalendarClock, Eye, Heart, Library, ShieldAlert, Tag } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/common/theme-provider';
import { getWorkBySlug, incrementViewCount } from '@/lib/db/queries';
import { formatDate, formatNumber } from '@/lib/utils';

const ratingLabels: Record<string, string> = {
  general: '全年龄',
  teen: '青少年',
  mature: '成人',
  explicit: '限制级',
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return { title: '作品未找到' };

  return {
    title: work.title,
    description: work.description ?? `阅读 ${work.title}`,
    openGraph: {
      title: work.title,
      description: work.description ?? undefined,
      type: 'book',
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  await incrementViewCount(work.id);

  const chapters = work.volumes.flatMap((volume) =>
    volume.chapters.map((chapter) => ({ ...chapter, volumeTitle: volume.title })),
  );
  const firstChapter = chapters[0];
  const lastChapter = chapters[chapters.length - 1];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: work.title,
    author: work.authorName,
    inLanguage: work.language ?? 'zh',
    numberOfPages: chapters.length,
    dateModified: work.updatedAt?.toISOString(),
  };

  return (
    <ThemeProvider>
      <Header />
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
            <div className="aspect-[3/4] max-w-[220px] rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-5 shadow-sm lg:max-w-none">
              <div className="flex h-full flex-col justify-between rounded-md border border-dashed border-[var(--border)] p-4">
                <BookOpen className="h-10 w-10 text-[var(--accent)]" />
                <div>
                  <div className="text-sm text-[var(--text-tertiary)]">InkWeave</div>
                  <div className="mt-1 line-clamp-3 text-2xl font-bold leading-tight">{work.title}</div>
                </div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {work.category && (
                  <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-sm font-medium text-[var(--accent)]">
                    {work.category}
                  </span>
                )}
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-sm text-[var(--text-secondary)]">
                  {ratingLabels[work.rating ?? 'general']}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{work.title}</h1>
              <p className="mt-3 text-sm text-[var(--text-tertiary)]">
                作者：{work.authorName ?? '匿名创作者'}
              </p>
              <p className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-8 text-[var(--text-secondary)]">
                {work.description ?? '这位创作者还没有写简介。'}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                    <Library className="h-4 w-4" />
                    章节
                  </div>
                  <div className="mt-1 text-xl font-semibold">{chapters.length}</div>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                    <BookOpen className="h-4 w-4" />
                    字数
                  </div>
                  <div className="mt-1 text-xl font-semibold">{formatNumber(work.wordCount ?? 0)}</div>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                    <Eye className="h-4 w-4" />
                    阅读
                  </div>
                  <div className="mt-1 text-xl font-semibold">{formatNumber((work.viewCount ?? 0) + 1)}</div>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                    <Heart className="h-4 w-4" />
                    收藏
                  </div>
                  <div className="mt-1 text-xl font-semibold">{formatNumber(work.favoriteCount ?? 0)}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {firstChapter ? (
                  <Link
                    href={`/works/${work.slug}/${firstChapter.slug}`}
                    className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    <BookOpen className="h-4 w-4" />
                    从第一章开始
                  </Link>
                ) : null}
                {lastChapter ? (
                  <Link
                    href={`/works/${work.slug}/${lastChapter.slug}`}
                    className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-semibold hover:bg-[var(--bg-primary)]"
                  >
                    阅读最新章
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">卷册目录</h2>
              {work.updatedAt && (
                <span className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)]">
                  <CalendarClock className="h-4 w-4" />
                  {formatDate(work.updatedAt, 'relative')}
                </span>
              )}
            </div>

            {work.volumes.length > 0 ? (
              <div className="space-y-4">
                {work.volumes.map((volume) => (
                  <section key={volume.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)]">
                    <div className="border-b border-[var(--border)] px-5 py-4">
                      <h3 className="font-semibold">{volume.title}</h3>
                      {volume.description && (
                        <p className="mt-1 text-sm text-[var(--text-tertiary)]">{volume.description}</p>
                      )}
                    </div>
                    <div className="divide-y divide-[var(--border)]">
                      {volume.chapters.map((chapter, index) => (
                        <Link
                          key={chapter.id}
                          href={`/works/${work.slug}/${chapter.slug}`}
                          className="grid gap-2 px-5 py-3 transition-colors hover:bg-[var(--bg-secondary)] sm:grid-cols-[48px_1fr_auto]"
                        >
                          <span className="text-sm text-[var(--text-tertiary)]">{String(index + 1).padStart(2, '0')}</span>
                          <span className="font-medium">{chapter.title}</span>
                          <span className="text-sm text-[var(--text-tertiary)]">{formatNumber(chapter.wordCount ?? 0)} 字</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-secondary)] p-10 text-center text-[var(--text-tertiary)]">
                作品尚未发布章节。
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-5">
              <h2 className="mb-3 flex items-center gap-2 font-semibold">
                <Tag className="h-4 w-4 text-[var(--accent)]" />
                标签
              </h2>
              <div className="flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/works?tag=${tag.slug}`}
                    className="rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-sm"
                    style={{ color: tag.color ?? undefined }}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </section>

            {work.rating === 'explicit' || work.rating === 'mature' ? (
              <section className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
                <h2 className="mb-2 flex items-center gap-2 font-semibold">
                  <ShieldAlert className="h-4 w-4 text-[var(--accent)]" />
                  内容提示
                </h2>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  本作品包含较高分级内容。请根据自己的阅读偏好决定是否继续。
                </p>
              </section>
            ) : null}
          </aside>
        </section>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
