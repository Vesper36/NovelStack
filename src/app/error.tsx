'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[InkWeave Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <AlertTriangle
          className="mx-auto mb-4 h-12 w-12"
          style={{ color: 'var(--accent)' }}
        />
        <h1
          className="mb-2 text-xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          出了点问题
        </h1>
        <p
          className="mb-6 text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          页面加载时遇到了错误，请尝试刷新。
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
          style={{ background: 'var(--accent)' }}
        >
          <RefreshCw className="h-4 w-4" />
          重新加载
        </button>
      </div>
    </div>
  );
}
