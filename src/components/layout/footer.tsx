import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {siteConfig.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                墨织
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              一个面向创作者与读者的结构化叙事平台，为长篇连载、同人衍生、互动实验型文本提供容器级支持。
            </p>
            {/* Social Links Placeholder */}
            <div className="mt-4 flex gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                WB
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                TW
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                GH
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              链接
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/works"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  发现作品
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  标签浏览
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  成为创作者
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  关于我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              联系方式
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  邮箱: contact@inkweave.dev
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  反馈: feedback@inkweave.dev
                </span>
              </li>
              <li>
                <Link
                  href="/about#faq"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  常见问题
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
