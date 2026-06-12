import Link from 'next/link';
import { Eye, Heart, Clock, Bookmark, LibraryBig } from 'lucide-react';
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

function getBookInitial(title: string) {
  return title.trim().slice(0, 1).toUpperCase() || '书';
}

function CoverFrame({
  work,
  size = 'default',
}: {
  work: WorkCardProps['work'];
  size?: 'compact' | 'default' | 'featured';
}) {
  const sizeClass = {
    compact: 'h-11 w-9',
    default: 'h-24 w-[72px]',
    featured: 'h-52 w-full',
  }[size];

  if (work.coverUrl) {
    return (
      <div
        aria-hidden="true"
        className={cn('relative shrink-0 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] bg-cover bg-center', sizeClass)}
        style={{ backgroundImage: `url(${JSON.stringify(work.coverUrl)})` }}
      >
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/35 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--bg-secondary)]',
        'before:absolute before:inset-y-0 before:left-0 before:w-2 before:bg-[var(--accent)]',
        sizeClass
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_52%),linear-gradient(90deg,color-mix(in_srgb,var(--text-primary)_6%,transparent)_1px,transparent_1px)] bg-[size:auto,18px_18px]" />
      <div className="relative flex h-full flex-col justify-between p-3 pl-4">
        <div className="text-[10px] font-semibold text-[var(--text-tertiary)]">{work.category || 'InkWeave'}</div>
        <div className="font-serif text-3xl font-bold leading-none text-[var(--accent)]">{getBookInitial(work.title)}</div>
        {size === 'featured' && (
          <div className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--text-primary)]">
            {work.title}
          </div>
        )}
      </div>
    </div>
  );
}

export function WorkCard({ work, variant = 'default' }: WorkCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        href={`/works/${work.slug}`}
        className="group flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-[var(--bg-secondary)]"
      >
        <CoverFrame work={work} size="compact" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold group-hover:text-[var(--accent)]">{work.title}</h3>
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
        className="group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        <CoverFrame work={work} size="featured" />
        <div className="p-5">
          <div className="mb-2 flex items-center gap-2">
            {work.category && (
              <span className="text-xs font-semibold text-[var(--accent)]">{work.category}</span>
            )}
            {work.rating !== 'general' && (
              <span className={cn('rounded px-1.5 py-0.5 text-xs font-semibold', ratingColors[work.rating])}>
                {ratingLabels[work.rating]}
              </span>
            )}
          </div>
          <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-[var(--accent)]">
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
            <span className="min-w-0 truncate">{work.authorName}</span>
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
      className="group flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="hidden sm:block">
        <CoverFrame work={work} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 overflow-hidden">
          <h3 className="truncate font-semibold transition-colors group-hover:text-[var(--accent)]">
            {work.title}
          </h3>
          {work.rating !== 'general' && (
            <span className={cn('shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold', ratingColors[work.rating])}>
              {ratingLabels[work.rating]}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">{work.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1"><LibraryBig className="h-3 w-3" />{work.authorName}</span>
          {work.category && <span className="flex items-center gap-1"><Bookmark className="h-3 w-3" />{work.category}</span>}
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
