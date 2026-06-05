import Link from 'next/link';
import { BookOpen, Feather, Users, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/common/theme-provider';
import { WorkCard } from '@/components/works/work-card';
import { getPublishedWorks, getSiteStats, getAllTags } from '@/lib/db/queries';
import { formatNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featuredWorks, recentWorks, stats, allTags] = await Promise.all([
    getPublishedWorks({ limit: 3, sortBy: 'popular' }),
    getPublishedWorks({ limit: 6, sortBy: 'latest' }),
    getSiteStats(),
    getAllTags(),
  ]);

  return (
    <ThemeProvider>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-[var(--border)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--accent)]/3" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--accent)] mb-4">
                <Sparkles className="h-4 w-4" />
                为创作者而生的叙事平台
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                让故事在合适的
                <span className="text-[var(--accent)]">容器</span>
                里自然生长
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)] max-w-2xl">
                InkWeave 为长篇连载、同人衍生、互动实验型文本提供容器级支持。
                卷册层级管理、多主题阅读引擎、安全的富媒体渲染 -- 我们为故事建造一座可呼吸的数字书房。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/works"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dark)]"
                >
                  开始阅读
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/creator"
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-6 py-3 text-sm font-semibold transition-colors hover:bg-[var(--bg-secondary)]"
                >
                  <Feather className="h-4 w-4" />
                  成为创作者
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
            {[
              { label: '作品', value: stats.works, icon: BookOpen },
              { label: '章节', value: stats.chapters, icon: Feather },
              { label: '创作者', value: stats.users, icon: Users },
              { label: '标签', value: stats.tags, icon: Tag },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-[var(--bg-primary)] px-6 py-5">
                <item.icon className="h-5 w-5 text-[var(--accent)]" />
                <div>
                  <div className="text-2xl font-bold">{formatNumber(item.value)}</div>
                  <div className="text-xs text-[var(--text-tertiary)]">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Works */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">热门作品</h2>
              <p className="mt-1 text-sm text-[var(--text-tertiary)]">读者最爱的故事</p>
            </div>
            <Link
              href="/works?sort=popular"
              className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              查看全部 <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWorks.map((work) => (
              <WorkCard key={work.id} work={work} variant="featured" />
            ))}
          </div>
        </section>

        {/* Tags */}
        <section className="border-y border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">探索标签</h2>
                <p className="mt-1 text-sm text-[var(--text-tertiary)]">按兴趣发现故事</p>
              </div>
              <Link
                href="/tags"
                className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
              >
                全部标签 <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 20).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/works?tag=${tag.slug}`}
                  className="tag-cloud-item border border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--accent)]"
                  style={{
                    borderColor: tag.color ? `${tag.color}40` : undefined,
                    color: tag.color || undefined,
                  }}
                >
                  {tag.name}
                  <span className="ml-1.5 text-xs opacity-50">{tag.usageCount}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Updates */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">最近更新</h2>
              <p className="mt-1 text-sm text-[var(--text-tertiary)]">新鲜出炉的故事</p>
            </div>
            <Link
              href="/works?sort=latest"
              className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              查看全部 <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-3">
            {recentWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[var(--border)] bg-gradient-to-br from-[var(--accent)]/5 to-transparent">
          <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold">准备好开始你的故事了吗?</h2>
            <p className="mx-auto mt-4 max-w-lg text-[var(--text-secondary)]">
              加入 InkWeave，用卷册管理你的长篇连载，用多主题系统打造沉浸式阅读体验。
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/creator"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-dark)]"
              >
                <Feather className="h-4 w-4" />
                立即开始创作
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
