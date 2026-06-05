'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BookOpen, Search, PenTool, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/works', label: '发现作品' },
  { href: '/tags', label: '标签' },
  { href: '/creator', label: '创作中心' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <BookOpen className="h-6 w-6 text-[var(--accent)]" />
          <span className="text-lg font-bold">InkWeave</span>
          <span className="hidden text-xs text-[var(--text-tertiary)] sm:inline">墨织</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                  ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            aria-label="搜索"
          >
            <Search className="h-4 w-4" />
          </button>
          <Link
            href="/creator/works/new"
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-dark)]"
          >
            <PenTool className="h-3.5 w-3.5" />
            开始创作
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] md:hidden"
            aria-label="菜单"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3">
          <form action="/works" method="get" className="mx-auto max-w-2xl">
            <input
              type="text"
              name="q"
              placeholder="搜索作品、标签、作者..."
              autoFocus
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            />
          </form>
        </div>
      )}

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/creator/works/new"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white"
            >
              <PenTool className="h-3.5 w-3.5" />
              开始创作
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
