import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getChapterBySlugs, getAdjacentChapters, getWorkBySlug } from '@/lib/db/queries';
import { compileMdx } from '@/lib/mdx';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/common/theme-provider';
import { ReadingView } from '@/components/reader/reading-view';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapterSlug: string }>;
}): Promise<Metadata> {
  const { slug, chapterSlug } = await params;
  const chapter = await getChapterBySlugs(slug, chapterSlug);
  if (!chapter) return { title: '章节未找到' };

  return {
    title: `${chapter.title} - ${chapter.workTitle}`,
    description: `阅读 ${chapter.workTitle} 的章节「${chapter.title}」`,
  };
}

export default async function ChapterReadPage({
  params,
}: {
  params: Promise<{ slug: string; chapterSlug: string }>;
}) {
  const { slug, chapterSlug } = await params;

  const chapter = await getChapterBySlugs(slug, chapterSlug);
  if (!chapter) notFound();

  const mdxSource = chapter.contentMdx || '';
  const { content: contentHtml, toc } = await compileMdx(mdxSource);

  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  const { prev, next } = await getAdjacentChapters(
    chapter.workId,
    chapter.volumeId,
    chapter.sortOrder ?? 0,
  );

  return (
    <ThemeProvider>
      <Header />
      <main className="flex-1">
        <ReadingView
          chapter={chapter}
          contentHtml={contentHtml}
          toc={toc}
          workSlug={slug}
          workTitle={chapter.workTitle ?? ''}
          prevChapter={prev}
          nextChapter={next}
        />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
