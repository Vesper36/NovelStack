import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/common/theme-provider';
import { WorkCard } from '@/components/works/work-card';
import { getPublishedWorks, getPublishedWorksCount, getAllTags } from '@/lib/db/queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '发现作品',
  description: '浏览 InkWeave 平台上的所有已发布作品。',
};

export const dynamic = 'force-dynamic';

export default async function WorksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; sort?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const tag = params.tag || '';
  const sortBy = (params.sort as 'latest' | 'popular' | 'word_count') || 'latest';
  const page = Math.max(1, parseInt(params.page || '1'));
  const limit = 20;
  const offset = (page - 1) * limit;

  const [works, total, allTags] = await Promise.all([
    getPublishedWorks({ limit, offset, sortBy, tag: tag || undefined }),
    getPublishedWorksCount(),
    getAllTags(),
  ]);

  const totalPages = Math.ceil(total / limit);

  // 如果有搜索词，过滤（临时方案，后续接入 Meilisearch）
  const filteredWorks = query
    ? works.filter(w =>
        w.title.includes(query) ||
        (w.description && w.description.includes(query)) ||
        w.authorName?.includes(query)
      )
    : works;

  return (
    <ThemeProvider>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">
                {query ? `搜索: ${query}` : tag ? `标签: ${tag}` : '发现作品'}
              </h1>
              <p className="mt-1 text-sm text-[var(--text-tertiary)]">
                共 {query ? filteredWorks.length : total} 部作品
              </p>
            </div>

            {/* Sort Tabs */}
            <div className="mb-6 flex gap-1 rounded-lg border border-[var(--border)] p-1 w-fit">
              {[
                { key: 'latest', label: '最新' },
                { key: 'popular', label: '最热' },
                { key: 'word_count', label: '最长' },
              ].map((s) => (
                <Link
                  key={s.key}
                  href={`/works?sort=${s.key}${tag ? `&tag=${tag}` : ''}${query ? `&q=${query}` : ''}`}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                    sortBy === s.key
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>

            {/* Works List */}
            {filteredWorks.length > 0 ? (
              <div className="grid gap-3">
                {filteredWorks.map((work) => (
                  <WorkCard key={work.id} work={work} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-medium text-[var(--text-secondary)]">暂无作品</p>
                <p className="mt-1 text-sm text-[var(--text-tertiary)]">
                  {query ? '换个关键词试试' : '等待创作者们发布精彩内容'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/works?page=${p}&sort=${sortBy}${tag ? `&tag=${tag}` : ''}`}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-[var(--accent)] text-white'
                        : 'border border-[var(--border)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Tags */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="sticky top-24 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4">
              <h2 className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">标签筛选</h2>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((t) => (
                  <Link
                    key={t.id}
                    href={`/works?tag=${t.slug}`}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                      tag === t.slug
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                    style={
                      tag !== t.slug && t.color
                        ? { color: t.color, backgroundColor: `${t.color}10` }
                        : undefined
                    }
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
