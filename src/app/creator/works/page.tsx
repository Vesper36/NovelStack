'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, CalendarClock, Eye, FileText, Heart, Loader2, Plus, Search } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/utils';

type CreatorWork = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: 'draft' | 'reviewing' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'link_only';
  category: string | null;
  wordCount: number | null;
  viewCount: number | null;
  favoriteCount: number | null;
  rating: string | null;
  updatedAt: string | Date | null;
  volumeCount: number;
  chapterCount: number;
  publishedChapterCount: number;
  tags: { name: string; slug: string; color: string | null }[];
};

const statusLabels: Record<CreatorWork['status'], string> = {
  draft: '草稿',
  reviewing: '审核中',
  published: '已发布',
  archived: '已归档',
};

const statusClassNames: Record<CreatorWork['status'], string> = {
  draft: 'bg-slate-100 text-slate-700',
  reviewing: 'bg-amber-100 text-amber-700',
  published: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-rose-100 text-rose-700',
};

export default function CreatorWorksPage() {
  const [works, setWorks] = useState<CreatorWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const loadWorks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/works/my?limit=100', { cache: 'no-store' });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || '作品加载失败');
        return;
      }

      setWorks(json.data || []);
    } catch {
      setError('网络错误，无法加载作品');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorks();
  }, [loadWorks]);

  const filteredWorks = useMemo(() => {
    const keyword = query.trim();
    if (!keyword) return works;

    return works.filter((work) => {
      return (
        work.title.includes(keyword) ||
        work.description?.includes(keyword) ||
        work.category?.includes(keyword) ||
        work.tags.some((tag) => tag.name.includes(keyword))
      );
    });
  }, [query, works]);

  const totals = useMemo(() => {
    return works.reduce(
      (acc, work) => ({
        works: acc.works + 1,
        chapters: acc.chapters + work.chapterCount,
        words: acc.words + (work.wordCount ?? 0),
        views: acc.views + (work.viewCount ?? 0),
      }),
      { works: 0, chapters: 0, words: 0, views: 0 },
    );
  }, [works]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">我的作品</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            管理卷册结构、章节草稿、发布状态与作品元数据。
          </p>
        </div>
        <Link
          href="/creator/works/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          新建作品
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4">
          <div className="text-2xl font-bold">{totals.works}</div>
          <div className="mt-1 text-sm text-[var(--text-tertiary)]">作品</div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4">
          <div className="text-2xl font-bold">{totals.chapters}</div>
          <div className="mt-1 text-sm text-[var(--text-tertiary)]">章节</div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4">
          <div className="text-2xl font-bold">{formatNumber(totals.words)}</div>
          <div className="mt-1 text-sm text-[var(--text-tertiary)]">字数</div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4">
          <div className="text-2xl font-bold">{formatNumber(totals.views)}</div>
          <div className="mt-1 text-sm text-[var(--text-tertiary)]">阅读</div>
        </div>
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="border-b border-[var(--border)] p-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题、标签、分类"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-[var(--text-tertiary)]">
            <Loader2 className="h-4 w-4 animate-spin" />
            加载作品中
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-rose-600">{error}</p>
            <Link
              href="/auth/login"
              className="mt-4 inline-flex rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium"
            >
              去登录
            </Link>
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-[var(--text-tertiary)]" />
            <p className="mt-3 font-medium text-[var(--text-secondary)]">还没有匹配的作品</p>
            <p className="mt-1 text-sm text-[var(--text-tertiary)]">新建作品后可以在这里管理卷章。</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {filteredWorks.map((work) => (
              <article key={work.id} className="p-4 transition-colors hover:bg-[var(--bg-secondary)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClassNames[work.status]}`}>
                        {statusLabels[work.status]}
                      </span>
                      <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--text-tertiary)]">
                        {work.visibility === 'public' ? '公开' : work.visibility === 'private' ? '私密' : '仅链接'}
                      </span>
                      {work.category && (
                        <span className="rounded-full bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs text-[var(--accent)]">
                          {work.category}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/creator/works/${work.id}`}
                      className="text-lg font-semibold text-[var(--text-primary)] hover:text-[var(--accent)]"
                    >
                      {work.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                      {work.description || '暂无简介'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {work.tags.slice(0, 6).map((tag) => (
                        <span
                          key={tag.slug}
                          className="rounded-full bg-[var(--bg-tertiary)] px-2.5 py-1 text-xs"
                          style={{ color: tag.color ?? undefined }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid shrink-0 grid-cols-2 gap-2 text-sm text-[var(--text-tertiary)] sm:grid-cols-4 lg:min-w-[360px]">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      {work.publishedChapterCount}/{work.chapterCount} 章
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      {formatNumber(work.viewCount ?? 0)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-4 w-4" />
                      {formatNumber(work.favoriteCount ?? 0)}
                    </span>
                    {work.updatedAt && (
                      <span className="flex items-center gap-1.5">
                        <CalendarClock className="h-4 w-4" />
                        {formatDate(work.updatedAt, 'relative')}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
