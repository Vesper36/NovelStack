import Link from 'next/link';
import type { Metadata } from 'next';
import { Hash, Layers, Search, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/common/theme-provider';
import { getTagsGrouped } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: '标签浏览',
  description: '按题材、类型、配对与连载状态探索 InkWeave 的结构化故事标签。',
};

export const dynamic = 'force-dynamic';

export default async function TagsPage() {
  const groupedTags = await getTagsGrouped();
  const entries = Object.entries(groupedTags);
  const totalTags = entries.reduce((sum, [, tags]) => sum + tags.length, 0);
  const hotTags = entries
    .flatMap(([, tags]) => tags)
    .sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
    .slice(0, 10);

  return (
    <ThemeProvider>
      <Header />
      <main className="flex-1">
        <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1 text-sm text-[var(--text-secondary)]">
                  <Hash className="h-4 w-4 text-[var(--accent)]" />
                  结构化发现
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                  用标签找到适合今晚的故事
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
                  题材、类型、配对、连载状态会共同构成作品的阅读入口。这里不是简单的关键词堆叠，而是读者筛选长篇叙事的导航地图。
                </p>
              </div>
              <form action="/works" className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4">
                <label htmlFor="tag-search" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                  快速搜索
                </label>
                <div className="flex gap-2">
                  <input
                    id="tag-search"
                    name="q"
                    placeholder="@tag:科幻  时间裂缝"
                    className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                  />
                  <button className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">
                    <Search className="h-4 w-4" />
                    搜索
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4">
              <div className="text-2xl font-bold">{totalTags}</div>
              <div className="mt-1 text-sm text-[var(--text-tertiary)]">可筛选标签</div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4">
              <div className="text-2xl font-bold">{entries.length}</div>
              <div className="mt-1 text-sm text-[var(--text-tertiary)]">标签分组</div>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4">
              <div className="text-2xl font-bold">{hotTags[0]?.name ?? '暂无'}</div>
              <div className="mt-1 text-sm text-[var(--text-tertiary)]">当前热度最高</div>
            </div>
          </div>

          <div className="mb-10 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              热门标签
            </div>
            <div className="flex flex-wrap gap-2">
              {hotTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/works?tag=${tag.slug}`}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-sm font-medium transition-colors hover:border-[var(--accent)]"
                  style={{ color: tag.color ?? undefined }}
                >
                  {tag.name}
                  <span className="ml-2 text-xs opacity-50">{tag.usageCount}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {entries.map(([category, tags]) => (
              <section key={category} className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Layers className="h-5 w-5 text-[var(--accent)]" />
                    {category}
                  </h2>
                  <span className="text-sm text-[var(--text-tertiary)]">{tags.length} 个标签</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/works?tag=${tag.slug}`}
                      className="rounded-full bg-[var(--bg-secondary)] px-3 py-1.5 text-sm transition-colors hover:bg-[var(--bg-tertiary)]"
                      style={{ color: tag.color ?? undefined }}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
