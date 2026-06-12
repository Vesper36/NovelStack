import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--accent)]" />
              <span className="text-lg font-bold text-[var(--text-primary)]">
                {siteConfig.name}
              </span>
              <span className="text-sm text-[var(--text-tertiary)]">
                墨织
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              一个面向创作者与读者的结构化叙事平台，为长篇连载、同人衍生、互动实验型文本提供容器级支持。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              链接
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/works"
                  className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                >
                  发现作品
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                >
                  标签浏览
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                >
                  成为创作者
                </Link>
              </li>
              <li>
                <Link
                  href="/creator"
                  className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                >
                  创作中心
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              联系方式
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-[var(--text-secondary)]">
                  邮箱: contact@inkweave.dev
                </span>
              </li>
              <li>
                <span className="text-sm text-[var(--text-secondary)]">
                  反馈: feedback@inkweave.dev
                </span>
              </li>
              <li>
                <Link
                  href="/works"
                  className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                >
                  阅读入口
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-[var(--border)] pt-6">
          <p className="text-center text-xs text-[var(--text-tertiary)]">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
