import type { Metadata } from 'next';
import { Noto_Serif_SC, Noto_Sans_SC, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const notoSerif = Noto_Serif_SC({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const notoSans = Noto_Sans_SC({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'InkWeave - 墨织 | 为创作者而生的叙事平台',
    template: '%s | InkWeave 墨织',
  },
  description: '一个面向创作者与读者的结构化叙事平台，为长篇连载、同人衍生、互动实验型文本提供容器级支持。',
  keywords: ['同人', '小说', '创作', '连载', '文学', 'fanfiction', 'writing'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:50040'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'InkWeave',
  },
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'theme-color': '#fbfaf7',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${notoSerif.variable} ${notoSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
