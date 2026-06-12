import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/common/theme-provider';

export const metadata: Metadata = {
  title: '注册',
  description: '注册 InkWeave 账号，加入创作者社区。',
};

export default function RegisterPage() {
  return (
    <ThemeProvider>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">注册</h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              加入 InkWeave，开始你的创作之旅
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 shadow-sm">
            <RegisterForm />
          </div>
          <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
            已有账号？{' '}
            <Link href="/auth/login" className="font-medium text-[var(--accent)] hover:underline">
              立即登录
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
