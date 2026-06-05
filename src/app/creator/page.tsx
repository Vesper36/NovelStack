import Link from 'next/link';
import { BookOpen, Eye, Heart, FileText, PenTool, BarChart3 } from 'lucide-react';
import { getPublishedWorks, getSiteStats } from '@/lib/db/queries';
import { WorkCard } from '@/components/works/work-card';
import { formatNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CreatorDashboardPage() {
  const [works, stats] = await Promise.all([
    getPublishedWorks({ limit: 6, sortBy: 'latest' }),
    getSiteStats(),
  ]);

  const statCards = [
    {
      label: '作品总数',
      value: stats.works,
      icon: BookOpen,
      color: 'text-[var(--accent)]',
      bg: 'bg-[var(--accent)]/10',
    },
    {
      label: '总浏览量',
      value: stats.chapters,
      icon: Eye,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: '总收藏数',
      value: stats.users,
      icon: Heart,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
    {
      label: '总字数',
      value: stats.tags,
      icon: FileText,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          创作中心
        </h1>
        <p className="mt-1 text-[var(--text-secondary)]">
          欢迎回来，这里是你的创作仪表盘
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--text-secondary)]">
                  {card.label}
                </p>
                <div className={`rounded-lg ${card.bg} p-2`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <p className="mt-2 text-3xl font-bold text-[var(--text-primary)]">
                {formatNumber(card.value)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/creator/works/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <PenTool className="h-4 w-4" />
          新建作品
        </Link>
        <Link
          href="/creator/works"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
        >
          <BarChart3 className="h-4 w-4" />
          查看作品
        </Link>
      </div>

      {/* Recent Works */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            最近作品
          </h2>
          <Link
            href="/creator/works"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            查看全部
          </Link>
        </div>

        {works.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} variant="compact" />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-secondary)] p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-[var(--text-tertiary)]" />
            <p className="mt-3 text-[var(--text-secondary)]">
              还没有作品，开始你的创作之旅吧
            </p>
            <Link
              href="/creator/works/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <PenTool className="h-4 w-4" />
              新建作品
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
