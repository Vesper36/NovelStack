'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, LogOut, Settings, BookOpen, ChevronDown } from 'lucide-react';

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
}

export function UserMenu() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setOpen(false);
    window.location.href = '/';
  }

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--bg-tertiary)]" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)]"
        >
          登录
        </Link>
        <Link
          href="/auth/register"
          className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          注册
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--bg-secondary)]"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
          {user.image ? (
            <img src={user.image} alt="" className="h-7 w-7 rounded-full" />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>
        <span className="hidden text-sm font-medium sm:block">{user.name || user.email}</span>
        <ChevronDown className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] py-1 shadow-lg">
          <div className="border-b border-[var(--border)] px-3 py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
          </div>
          <Link
            href="/creator"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-secondary)]"
          >
            <BookOpen className="h-4 w-4" /> 创作中心
          </Link>
          <Link
            href="/creator/works"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-secondary)]"
          >
            <Settings className="h-4 w-4" /> 作品管理
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-[var(--bg-secondary)]"
          >
            <LogOut className="h-4 w-4" /> 退出登录
          </button>
        </div>
      )}
    </div>
  );
}
