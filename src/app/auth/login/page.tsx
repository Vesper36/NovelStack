import { LoginForm } from '@/components/auth/login-form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/common/theme-provider';

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
        </div>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
