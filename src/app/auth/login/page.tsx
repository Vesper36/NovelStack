import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/common/theme-provider';

export const metadata: Metadata = {
  title: '登录',
  description: '登录你的 InkWeave 账号，开始创作或阅读。',
};

export default function LoginPage() {
  return (
    <ThemeProvider>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">登录</h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              欢迎回来，继续你的创作之旅
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 shadow-sm">
            <LoginForm />
          </div>
          <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
            还没有账号？{' '}
            <Link href="/auth/register" className="font-medium text-[var(--accent)] hover:underline">
              立即注册
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
