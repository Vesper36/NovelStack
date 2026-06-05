import Link from 'next/link';
import { Eye, Heart, BookOpen, Clock } from 'lucide-react';
import { cn, formatNumber, formatDate } from '@/lib/utils';

interface WorkCardProps {
  work: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    coverUrl: string | null;
    category: string | null;
    wordCount: number;
    viewCount: number;
    favoriteCount: number;
    rating: string;
    updatedAt: Date | null;
    authorName: string | null;
    tags?: { name: string; slug: string; color: string | null }[];
  };
  variant?: 'default' | 'featured' | 'compact';
}

const ratingColors: Record<string, string> = {
  general: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  teen: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  mature: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  explicit: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const ratingLabels: Record<string, string> = {
  general: '全年龄',
  teen: '青少年',
  mature: '成人',
  explicit: '限制级',
};

export function WorkCard({ work, variant = 'default' }: WorkCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        href={`/works/${work.slug}`}
        className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-[var(--bg-secondary)]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium group-hover:text-[var(--accent)]">{work.title}</h3>
          <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">
            {work.authorName} &middot; {formatNumber(work.wordCount)}字
          </p>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/works/${work.slug}`}
        className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] transition-all hover:shadow-lg hover:-translate-y-0.5"
      >
        {/* Cover placeholder */}
        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5">
          <BookOpen className="h-16 w-16 text-[var(--accent)]/30" />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            {work.category && (
              <span className="text-xs font-medium text-[var(--accent)]">{work.category}</span>
            )}
            {work.rating !== 'general' && (
              <span className={cn('rounded px-1.5 py-0.5 text-xs font-medium', ratingColors[work.rating])}>
                {ratingLabels[work.rating]}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold group-hover:text-[var(--accent)] transition-colors line-clamp-1">
            {work.title}
          </h3>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)] line-clamp-2">
            {work.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {work.tags?.slice(0, 4).map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: tag.color ? `${tag.color}15` : undefined,
                  color: tag.color || undefined,
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-tertiary)]">
            <span>{work.authorName}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatNumber(work.viewCount)}</span>
              <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{formatNumber(work.favoriteCount)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href={`/works/${work.slug}`}
      className="group flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Cover placeholder */}
      <div className="hidden sm:flex h-24 w-18 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5">
        <BookOpen className="h-8 w-8 text-[var(--accent)]/30" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold group-hover:text-[var(--accent)] transition-colors">
            {work.title}
          </h3>
          {work.rating !== 'general' && (
            <span className={cn('shrink-0 rounded px-1.5 py-0.5 text-xs font-medium', ratingColors[work.rating])}>
              {ratingLabels[work.rating]}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">{work.description}</p>
        <div className="mt-2 flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
          <span>{work.authorName}</span>
          {work.category && <span>{work.category}</span>}
          <span>{formatNumber(work.wordCount)}字</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatNumber(work.viewCount)}</span>
          {work.updatedAt && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(work.updatedAt, 'relative')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
