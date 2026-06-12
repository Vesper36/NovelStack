import { RegisterForm } from '@/components/auth/register-form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/common/theme-provider';

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
        </div>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
