'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Settings,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  List,
  Plus,
  Minus,
  Type,
} from 'lucide-react';
import { useReadingStore } from '@/lib/stores';
import { themes } from '@/lib/config';
import type { TocItem } from '@/lib/types';

interface ChapterData {
  id: string;
  title: string;
  slug: string;
  wordCount: number | null;
  readTimeEst: number | null;
  authorNote: string | null;
  volumeTitle: string | null;
  workTitle: string | null;
  workSlug: string | null;
}

type AdjacentChapter = {
  slug: string;
  title: string;
} | null;

interface ReadingViewProps {
  chapter: ChapterData;
  contentHtml: string;
  toc: TocItem[];
  workSlug: string;
  workTitle: string;
  prevChapter: AdjacentChapter;
  nextChapter: AdjacentChapter;
}

const THEME_IDS = themes.map((t) => t.id);

function getThemeVariables(themeId: string): Record<string, string> {
  return themes.find((t) => t.id === themeId)?.variables ?? themes[0].variables;
}

function renderTocItems(items: TocItem[], onSelect: () => void) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={onSelect}
            className="block rounded px-2 py-1 text-sm transition-colors hover:bg-[var(--bg-tertiary)]"
            style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
          >
            {item.title}
          </a>
          {item.children && item.children.length > 0 && renderTocItems(item.children, onSelect)}
        </li>
      ))}
    </ul>
  );
}

export function ReadingView({
  chapter,
  contentHtml,
  toc,
  workSlug,
  workTitle,
  prevChapter,
  nextChapter,
}: ReadingViewProps) {
  const router = useRouter();
  const { theme, fontSize, lineHeight, setTheme, setFontSize } = useReadingStore();
  const [progress, setProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Apply theme CSS variables
  const themeVars = getThemeVariables(theme);

  // Scroll progress tracking
  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, currentProgress)));

      // Auto-hide toolbar on scroll down, show on scroll up
      if (scrollY > lastScrollY.current && scrollY > 100) {
        setToolbarVisible(false);
      } else {
        setToolbarVisible(true);
      }
      lastScrollY.current = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowLeft' && prevChapter) {
        router.push(`/works/${workSlug}/${prevChapter.slug}`);
      } else if (e.key === 'ArrowRight' && nextChapter) {
        router.push(`/works/${workSlug}/${nextChapter.slug}`);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, workSlug, prevChapter, nextChapter]);

  const cycleTheme = useCallback(() => {
    const currentIndex = THEME_IDS.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEME_IDS.length;
    setTheme(THEME_IDS[nextIndex]);
  }, [theme, setTheme]);

  const handleTocClose = useCallback(() => {
    setTocOpen(false);
  }, []);

  const wordCountDisplay = chapter.wordCount ?? 0;
  const readTimeMinutes = chapter.readTimeEst ?? 0;
  const readingTimeLabel = readTimeMinutes < 1 ? '不到 1 分钟' : `约 ${readTimeMinutes} 分钟`;

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={themeVars as React.CSSProperties}
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1">
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: 'var(--accent)',
          }}
        />
      </div>

      {/* Chapter Header */}
      <div
        className="border-b"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="mb-3 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <Link
              href={`/works/${workSlug}`}
              className="transition-colors hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              {workTitle}
            </Link>
            {chapter.volumeTitle && (
              <>
                <span className="mx-2">/</span>
                <span>{chapter.volumeTitle}</span>
              </>
            )}
          </div>
          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: 'var(--text-primary)' }}
          >
            {chapter.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {wordCountDisplay.toLocaleString()} 字
            </span>
            <span>{readingTimeLabel}</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div
          ref={contentRef}
          className="reading-content"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            color: 'var(--text-primary)',
          }}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Author Note */}
        {chapter.authorNote && (
          <div
            className="mt-12 rounded-lg border p-6"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
              作者的话
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {chapter.authorNote}
            </p>
          </div>
        )}

        {/* Prev/Next Navigation */}
        <nav
          className="mt-12 flex items-center justify-between border-t pt-8"
          style={{ borderColor: 'var(--border)' }}
        >
          {prevChapter ? (
            <Link
              href={`/works/${workSlug}/${prevChapter.slug}`}
              className="group flex max-w-[45%] items-center gap-2 text-sm transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ChevronLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" style={{ color: 'var(--text-tertiary)' }} />
              <div className="min-w-0">
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>上一章</div>
                <div className="truncate font-medium group-hover:underline" style={{ color: 'var(--text-primary)' }}>
                  {prevChapter.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextChapter ? (
            <Link
              href={`/works/${workSlug}/${nextChapter.slug}`}
              className="group flex max-w-[45%] items-center gap-2 text-right text-sm transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <div className="min-w-0">
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>下一章</div>
                <div className="truncate font-medium group-hover:underline" style={{ color: 'var(--text-primary)' }}>
                  {nextChapter.title}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--text-tertiary)' }} />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>

      {/* Floating Toolbar */}
      <div
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 shadow-lg transition-all duration-300"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--bg-primary)',
          boxShadow: '0 4px 24px var(--shadow)',
          transform: `translateX(-50%) translateY(${toolbarVisible ? '0' : '120%'})`,
        }}
      >
        {/* Theme Switcher */}
        <button
          onClick={cycleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--bg-tertiary)]"
          title={`当前主题: ${themes.find((t) => t.id === theme)?.name ?? theme}`}
        >
          <Settings className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
        </button>

        <div className="mx-1 h-5 w-px" style={{ backgroundColor: 'var(--border)' }} />

        {/* Font Size Controls */}
        <button
          onClick={() => setFontSize(fontSize - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--bg-tertiary)]"
          title="减小字号"
        >
          <Minus className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
        </button>
        <span className="flex items-center gap-1 px-1 text-xs tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
          <Type className="h-3 w-3" />
          {fontSize}
        </span>
        <button
          onClick={() => setFontSize(fontSize + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--bg-tertiary)]"
          title="增大字号"
        >
          <Plus className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
        </button>

        <div className="mx-1 h-5 w-px" style={{ backgroundColor: 'var(--border)' }} />

        {/* TOC Toggle */}
        <button
          onClick={() => setTocOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--bg-tertiary)]"
          title="目录"
        >
          <List className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* TOC Overlay (Mobile Bottom Sheet) */}
      {tocOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleTocClose}
          />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t p-6"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--bg-primary)',
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                目录
              </h3>
              <button
                onClick={handleTocClose}
                className="text-sm"
                style={{ color: 'var(--text-tertiary)' }}
              >
                关闭
              </button>
            </div>
            {toc.length > 0 ? (
              renderTocItems(toc, handleTocClose)
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                本章暂无目录
              </p>
            )}
          </div>
        </div>
      )}

      {/* TOC Sidebar (Desktop) */}
      {tocOpen && (
        <aside
          className="fixed right-0 top-0 z-40 hidden h-full w-72 overflow-y-auto border-l p-6 pt-20 lg:block"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--bg-primary)',
          }}
        >
          <h3 className="mb-4 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            目录
          </h3>
          {toc.length > 0 ? (
            renderTocItems(toc, handleTocClose)
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              本章暂无目录
            </p>
          )}
        </aside>
      )}
    </div>
  );
}
