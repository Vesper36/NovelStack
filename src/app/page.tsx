import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Braces,
  CalendarClock,
  CheckCircle2,
  Eye,
  Feather,
  FileText,
  Hash,
  Layers3,
  LibraryBig,
  ListTree,
  Palette,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  SplitSquareHorizontal,
  Tags,
  UploadCloud,
  Users,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/common/theme-provider';
import { WorkCard } from '@/components/works/work-card';
import { getPublishedWorks, getSiteStats, getAllTags } from '@/lib/db/queries';
import { formatNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const statsMeta = [
  { label: '作品容器', key: 'works', icon: BookOpen },
  { label: '已建章节', key: 'chapters', icon: FileText },
  { label: '创作者', key: 'users', icon: Users },
  { label: '标签索引', key: 'tags', icon: Hash },
] as const;

const volumeRows = [
  { title: '前置剧情', meta: '2 章', state: 'published' },
  { title: '卷一 雨夜档案', meta: '8 章', state: 'active' },
  { title: '卷二 回声城市', meta: '12 章', state: 'draft' },
  { title: '附录 设定集', meta: '5 条', state: 'locked' },
];

const editorLines = [
  '# 第三章 回声',
  '',
  '> 这座城会记住每一次告别。',
  '',
  '<details>',
  '  <summary>读者注释</summary>',
  '  时间线从雨夜开始重叠。',
  '</details>',
  '',
  '```js',
  "trigger('chapter-progress', 42)",
  '```',
];

const readingThemes = [
  { name: '纸页', bg: '#f5efe1', text: '#3a2b24', accent: '#9b2f2b' },
  { name: '深夜', bg: '#18211e', text: '#dbe4d9', accent: '#b98b54' },
  { name: '清晨', bg: '#edf3e7', text: '#24352b', accent: '#4f7d64' },
  { name: '终端', bg: '#141817', text: '#9fd4ae', accent: '#c76f3f' },
];

const platformPillars = [
  {
    title: '卷册级叙事容器',
    description: '作品、卷、章、前置剧情、附录和设定集共享一棵结构树，适合长篇连载和同人世界观沉淀。',
    icon: Layers3,
  },
  {
    title: 'MDX 与沙箱渲染',
    description: 'Markdown、HTML、CSS 与互动脚本分层进入处理管道，可表达复杂内容，也不牺牲安全边界。',
    icon: ShieldCheck,
  },
  {
    title: '多主题阅读引擎',
    description: '字号、行距、宽度、夜间模式和进度条都围绕长时间阅读调校，偏好可本地持久化。',
    icon: Palette,
  },
  {
    title: '标签与全文发现',
    description: '标签、分级、作者、字数和更新时间形成筛选入口，后续可平滑接入 Meilisearch。',
    icon: Search,
  },
];

const workflowSteps = [
  { label: 'IndexedDB 草稿', detail: '离线也能写', icon: Feather },
  { label: '云端版本树', detail: '发布前可回滚', icon: CalendarClock },
  { label: '沙箱预览', detail: '互动组件隔离', icon: Braces },
  { label: 'RSS/SEO 输出', detail: '章节可被发现', icon: UploadCloud },
];

const fallbackTags = [
  { id: 'fallback-longform', name: '长篇连载', slug: 'longform', color: '#9b2f2b', usageCount: 0 },
  { id: 'fallback-worldbuilding', name: '世界观', slug: 'worldbuilding', color: '#4f7d64', usageCount: 0 },
  { id: 'fallback-cw', name: '内容警告', slug: 'content-warning', color: '#b7791f', usageCount: 0 },
  { id: 'fallback-mdx', name: '互动 MDX', slug: 'interactive-mdx', color: '#5b5f74', usageCount: 0 },
  { id: 'fallback-appendix', name: '设定集', slug: 'appendix', color: '#7c4a32', usageCount: 0 },
  { id: 'fallback-complete', name: '已完结', slug: 'completed', color: '#2f6f55', usageCount: 0 },
];

export default async function HomePage() {
  const [featuredWorks, recentWorks, stats, allTags] = await Promise.all([
    getPublishedWorks({ limit: 3, sortBy: 'popular' }),
    getPublishedWorks({ limit: 6, sortBy: 'latest' }),
    getSiteStats(),
    getAllTags(),
  ]);

  const topTags = allTags.slice(0, 18);
  const displayTags = topTags.length > 0 ? topTags : fallbackTags;
  const statValues = {
    works: stats.works,
    chapters: stats.chapters,
    users: stats.users,
    tags: stats.tags,
  };

  return (
    <ThemeProvider>
      <Header />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden border-b border-[var(--border)] bg-[var(--bg-primary)]">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--border)_44%,transparent)_1px,transparent_1px),linear-gradient(180deg,color-mix(in_srgb,var(--border)_44%,transparent)_1px,transparent_1px)] bg-[size:72px_72px]" />
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-10 overflow-hidden px-4 py-8 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-8">
            <div className="min-w-0 max-w-3xl py-8">
              <div className="mb-5 inline-flex items-center gap-2 border-l-2 border-[var(--accent)] bg-[var(--bg-secondary)] px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)]">
                <LibraryBig className="h-4 w-4 text-[var(--accent)]" />
                结构化叙事平台
              </div>
              <h1 className="w-full max-w-[22rem] text-[1.9rem] font-bold leading-[1.12] text-[var(--text-primary)] sm:max-w-3xl sm:text-5xl lg:text-6xl">
                <span className="block">为长篇故事建一间</span>
                <span className="block">可工作的数字书房</span>
              </h1>
              <p className="mt-6 w-full max-w-[22rem] break-words text-base leading-8 text-[var(--text-secondary)] sm:max-w-2xl sm:text-lg">
                InkWeave 把卷册树、MDX 编辑、沙箱渲染、多主题阅读和标签发现放在同一条链路里。它不是轻量博客外壳，而是为连载、同人衍生和互动文本准备的叙事容器。
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/works"
                  className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <BookOpen className="h-4 w-4" />
                  进入书架
                </Link>
                <Link
                  href="/creator/works/new"
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-primary)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
                >
                  <Feather className="h-4 w-4" />
                  新建作品
                </Link>
              </div>

              <div className="mt-10 grid w-full max-w-[22rem] grid-cols-2 border border-[var(--border)] bg-[var(--bg-primary)] sm:max-w-2xl sm:grid-cols-4">
                {statsMeta.map((item) => (
                  <div key={item.key} className="border-b border-r border-[var(--border)] p-4 last:border-r-0 sm:border-b-0">
                    <item.icon className="h-4 w-4 text-[var(--accent)]" />
                    <div className="mt-3 text-2xl font-bold text-[var(--text-primary)]">
                      {formatNumber(statValues[item.key])}
                    </div>
                    <div className="mt-1 text-xs text-[var(--text-tertiary)]">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 pb-8 lg:pb-0">
              <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] shadow-[0_28px_80px_rgba(23,32,27,0.16)]">
                <div className="grid border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                    <SplitSquareHorizontal className="h-4 w-4 text-[var(--accent)]" />
                    叙事工作台
                    <span className="truncate text-xs font-normal text-[var(--text-tertiary)]">
                      MDX 草稿到阅读预览
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-tertiary)] sm:mt-0">
                    <CheckCircle2 className="h-4 w-4 text-[#4f7d64]" />
                    本地自动保存
                  </div>
                </div>

                <div className="grid lg:grid-cols-[220px_1fr]">
                  <aside className="border-b border-[var(--border)] bg-[var(--bg-secondary)] p-4 lg:border-b-0 lg:border-r">
                    <div className="mb-3 flex items-center justify-between text-xs font-semibold text-[var(--text-tertiary)]">
                      <span>卷册树</span>
                      <ListTree className="h-4 w-4" />
                    </div>
                    <div className="space-y-2">
                      {volumeRows.map((row) => (
                        <div
                          key={row.title}
                          className={`rounded-md border px-3 py-2 ${
                            row.state === 'active'
                              ? 'border-[var(--accent)] bg-[var(--bg-primary)]'
                              : 'border-transparent bg-transparent'
                          }`}
                        >
                          <div className="text-sm font-semibold text-[var(--text-primary)]">{row.title}</div>
                          <div className="mt-1 flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                            <span>{row.meta}</span>
                            <span>{row.state === 'locked' ? '仅链接' : row.state === 'draft' ? '草稿' : '公开'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 border-t border-[var(--border)] pt-4">
                      <div className="mb-3 text-xs font-semibold text-[var(--text-tertiary)]">发布检查</div>
                      <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                        {['CW 已标注', 'SEO 摘要已生成', '沙箱组件通过'].map((item) => (
                          <div key={item} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#4f7d64]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </aside>

                  <div className="grid min-w-0 bg-[var(--border)] md:grid-cols-2">
                    <section className="min-w-0 bg-[var(--bg-primary)] p-4 md:border-r md:border-[var(--border)]">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Braces className="h-4 w-4 text-[var(--accent)]" />
                          MDX 源码
                        </div>
                        <span className="text-xs text-[var(--text-tertiary)]">v12</span>
                      </div>
                      <pre className="min-h-[286px] max-w-full overflow-hidden whitespace-pre-wrap rounded-md bg-[#17201b] p-4 font-mono text-xs leading-6 text-[#dce8d9]">
                        {editorLines.join('\n')}
                      </pre>
                    </section>

                    <section className="min-w-0 bg-[var(--bg-primary)] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Eye className="h-4 w-4 text-[var(--accent)]" />
                          阅读预览
                        </div>
                        <span className="rounded-md bg-[#e4efe4] px-2 py-0.5 text-xs font-medium text-[#2f6f55]">
                          sandbox
                        </span>
                      </div>
                      <article className="min-h-[286px] rounded-md border border-[var(--border)] bg-[#fbfaf7] p-5 font-serif leading-8 text-[#2d2a25]">
                        <div className="mb-3 text-xs text-[#8a7661]">卷一 雨夜档案</div>
                        <h2 className="text-xl font-bold">第三章 回声</h2>
                        <p className="mt-4">
                          这座城会记住每一次告别。窗外的雨像被切成细线，落在旧书房的玻璃上。
                        </p>
                        <details className="mt-4 rounded-md border border-[#ded3c2] bg-[#f3ecdc] p-3 text-sm">
                          <summary className="cursor-pointer font-semibold">读者注释</summary>
                          <p className="mt-2 text-[#6f6256]">时间线从雨夜开始重叠。</p>
                        </details>
                      </article>
                    </section>
                  </div>
                </div>

                <div className="grid border-t border-[var(--border)] bg-[var(--bg-primary)] sm:grid-cols-4">
                  {readingThemes.map((theme) => (
                    <div key={theme.name} className="border-b border-r border-[var(--border)] p-4 last:border-r-0 sm:border-b-0">
                      <div className="flex h-8 overflow-hidden rounded-md border border-[var(--border)]">
                        <span className="flex-1" style={{ backgroundColor: theme.bg }} />
                        <span className="flex-1" style={{ backgroundColor: theme.text }} />
                        <span className="flex-1" style={{ backgroundColor: theme.accent }} />
                      </div>
                      <div className="mt-3 text-sm font-semibold">{theme.name}</div>
                      <div className="mt-1 text-xs text-[var(--text-tertiary)]">CSS Variables</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="mx-auto grid max-w-7xl gap-px px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {platformPillars.map((pillar) => (
              <div key={pillar.title} className="bg-[var(--bg-primary)] p-6">
                <pillar.icon className="h-5 w-5 text-[var(--accent)]" />
                <h2 className="mt-4 font-semibold text-[var(--text-primary)]">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                <SlidersHorizontal className="h-4 w-4" />
                核心闭环
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">先让作者能发布，读者能舒服读。</h2>
            </div>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              MVP 不追求一次做满主题市场和推荐算法，先把作品容器、章节编辑、沙箱预览、阅读偏好和可检索标签跑通。后续功能都挂在这条主线上扩展。
            </p>
          </div>
          <div className="grid gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div key={step.label} className="bg-[var(--bg-primary)] p-5">
                <div className="flex items-center justify-between">
                  <step.icon className="h-5 w-5 text-[var(--accent)]" />
                  <span className="text-xs font-semibold text-[var(--text-tertiary)]">0{index + 1}</span>
                </div>
                <h3 className="mt-5 font-semibold text-[var(--text-primary)]">{step.label}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                <Tags className="h-4 w-4" />
                标签入口
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">让同人、长篇和实验文本有路径可循。</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                标签不是装饰。它负责把 CP、世界观、分级、字数和连载状态变成读者能组合筛选的发现路径。
              </p>
              <Link
                href="/tags"
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold hover:bg-[var(--bg-tertiary)]"
              >
                浏览全部标签
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-wrap content-start gap-2">
              {displayTags.map((tag) => {
                const usageCount = tag.usageCount ?? 0;

                return (
                  <Link
                    key={tag.id}
                    href={`/works?tag=${tag.slug}`}
                    className="rounded-md border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm font-semibold transition-colors hover:border-[var(--accent)]"
                    style={{ color: tag.color ?? undefined }}
                  >
                    {tag.name}
                    {usageCount > 0 && <span className="ml-2 text-xs opacity-55">{usageCount}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">热门作品</h2>
              <p className="mt-1 text-sm text-[var(--text-tertiary)]">从真实发布数据进入阅读。</p>
            </div>
            <Link
              href="/works?sort=popular"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              查看全部 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {featuredWorks.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredWorks.map((work) => (
                <WorkCard key={work.id} work={work} variant="featured" />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[var(--border)] bg-[var(--bg-secondary)] p-10 text-center text-sm text-[var(--text-tertiary)]">
              还没有已发布作品。可以先进入创作中心新建作品，跑通第一条发布链路。
            </div>
          )}
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--bg-primary)]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.36fr_0.64fr] lg:px-8">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">最近更新</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                读者追连载需要稳定的更新节奏，作者也需要看到发布后的作品进入真实列表。
              </p>
              <Link
                href="/works?sort=latest"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white"
              >
                发现更多
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {recentWorks.length > 0 ? (
              <div className="grid gap-3">
                {recentWorks.map((work) => (
                  <WorkCard key={work.id} work={work} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[var(--border)] bg-[var(--bg-secondary)] p-10 text-sm text-[var(--text-secondary)]">
                当前没有最近更新。发布章节后，这里会按更新时间展示连载动态。
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--text-primary)] text-[var(--bg-primary)]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm opacity-75">
                <ShieldCheck className="h-4 w-4" />
                安全底线
              </div>
              <h2 className="text-3xl font-bold">互动文本可以自由，但运行边界必须清楚。</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 opacity-80">
                自定义 HTML/CSS/JS 不直接污染主页面。脚本进入 iframe sandbox，内容经过净化，主题通过 CSS Variables 作用域化，后续再接 CSP 白名单和审核队列。
              </p>
            </div>
            <Link
              href="/creator"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--bg-primary)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)]"
            >
              进入创作中心
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
