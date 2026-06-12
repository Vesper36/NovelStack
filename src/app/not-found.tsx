import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <FileQuestion
          className="mx-auto mb-4 h-12 w-12"
          style={{ color: 'var(--text-tertiary)' }}
        />
        <h1
          className="mb-2 text-3xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          404
        </h1>
        <p
          className="mb-1 text-lg font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          页面不存在
        </p>
        <p
          className="mb-6 text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          你访问的页面可能已被移除或地址有误。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
          style={{ background: 'var(--accent)' }}
        >
          <Home className="h-4 w-4" />
          返回首页
        </Link>
      </div>
    </div>
  );
}
