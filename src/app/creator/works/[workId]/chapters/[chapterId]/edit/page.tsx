'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Eye, FileText, Loader2, Save, SplitSquareHorizontal } from 'lucide-react';
import { MdxEditor } from '@/components/editor/mdx-editor';
import { useDraftStore } from '@/lib/stores';
import { countWords, estimateReadingTime } from '@/lib/utils';

type ChapterData = {
  id: string;
  title: string;
  slug: string;
  contentMdx: string | null;
  contentHtml: string | null;
  status: 'draft' | 'reviewing' | 'published' | 'archived';
  authorNote: string | null;
  wordCount: number | null;
  readTimeEst: number | null;
};

export default function ChapterEditPage() {
  const params = useParams<{ workId: string; chapterId: string }>();
  const workId = params.workId;
  const chapterId = params.chapterId;

  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [title, setTitle] = useState('');
  const [contentMdx, setContentMdx] = useState('');
  const [serverContentMdx, setServerContentMdx] = useState('');
  const [authorNote, setAuthorNote] = useState('');
  const [status, setStatus] = useState<ChapterData['status']>('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewing, setPreviewing] = useState(false);
  const [hasStoredDraft, setHasStoredDraft] = useState(false);
  const [usingStoredDraft, setUsingStoredDraft] = useState(false);
  const [lastLocalDraftAt, setLastLocalDraftAt] = useState<Date | null>(null);
  const [cloudDraftSaving, setCloudDraftSaving] = useState(false);
  const [lastCloudDraftAt, setLastCloudDraftAt] = useState<Date | null>(null);
  const [cloudDraftError, setCloudDraftError] = useState('');

  const lastCloudDraftContentRef = useRef('');

  const setDraft = useDraftStore((state) => state.setDraft);
  const getDraft = useDraftStore((state) => state.getDraft);
  const removeDraft = useDraftStore((state) => state.removeDraft);

  const stats = useMemo(() => {
    return {
      words: countWords(contentMdx),
      readTime: estimateReadingTime(contentMdx || title),
    };
  }, [contentMdx, title]);

  const localDraftTime = useMemo(() => {
    if (!lastLocalDraftAt) {
      return '';
    }

    return lastLocalDraftAt.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [lastLocalDraftAt]);

  const cloudDraftTime = useMemo(() => {
    if (!lastCloudDraftAt) {
      return '';
    }

    return lastCloudDraftAt.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [lastCloudDraftAt]);

  const draftStatus = useMemo(() => {
    if (cloudDraftSaving) {
      return '云端草稿同步中';
    }

    if (saving) {
      return '正在同步服务器';
    }

    if (usingStoredDraft || contentMdx !== serverContentMdx) {
      return '本地草稿已保存';
    }

    if (hasStoredDraft) {
      return '发现未同步草稿';
    }

    return '服务器已保存';
  }, [cloudDraftSaving, contentMdx, hasStoredDraft, saving, serverContentMdx, usingStoredDraft]);

  const loadChapter = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/chapters/${chapterId}`, { cache: 'no-store' });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || '章节加载失败');
        return;
      }

      const data: ChapterData = json.data;
      const serverContent = data.contentMdx || '';
      const storedDraft = getDraft(chapterId);
      setChapter(data);
      setTitle(data.title || '');
      setContentMdx(serverContent);
      setServerContentMdx(serverContent);
      setAuthorNote(data.authorNote || '');
      setStatus(data.status || 'draft');
      setPreviewHtml(data.contentHtml || '');
      setUsingStoredDraft(false);
      setLastLocalDraftAt(null);
      setLastCloudDraftAt(null);
      setCloudDraftError('');
      lastCloudDraftContentRef.current = '';

      if (storedDraft && storedDraft !== serverContent) {
        setHasStoredDraft(true);
        setMessage('检测到本地未同步草稿，可选择恢复或丢弃。');
      } else {
        setHasStoredDraft(false);
      }
    } catch {
      setError('网络错误，无法加载章节');
    } finally {
      setLoading(false);
    }
  }, [chapterId, getDraft]);

  useEffect(() => {
    loadChapter();
  }, [loadChapter]);

  const handleContentChange = useCallback(
    (nextContent: string) => {
      setContentMdx(nextContent);

      if (nextContent === serverContentMdx) {
        removeDraft(chapterId);
        setHasStoredDraft(false);
        setUsingStoredDraft(false);
      setLastLocalDraftAt(null);
      setCloudDraftError('');
      return;
      }

      setDraft(chapterId, nextContent);
      setHasStoredDraft(true);
      setUsingStoredDraft(true);
    setLastLocalDraftAt(new Date());
    setCloudDraftError('');
  },
    [chapterId, removeDraft, serverContentMdx, setDraft]
  );

  const restoreLocalDraft = useCallback(() => {
    const storedDraft = getDraft(chapterId);
    if (!storedDraft) {
      setHasStoredDraft(false);
      setMessage('没有可恢复的本地草稿');
      return;
    }

    setContentMdx(storedDraft);
    setHasStoredDraft(true);
    setUsingStoredDraft(true);
    setLastLocalDraftAt(new Date());
    setCloudDraftError('');
    setMessage('已恢复本地草稿，保存后会同步到服务器。');
  }, [chapterId, getDraft]);

  const discardLocalDraft = useCallback(() => {
    removeDraft(chapterId);
    setContentMdx(serverContentMdx);
    setHasStoredDraft(false);
    setUsingStoredDraft(false);
    setLastLocalDraftAt(null);
    setCloudDraftError('');
    setMessage('已丢弃本地草稿，恢复服务器版本。');
  }, [chapterId, removeDraft, serverContentMdx]);

  const saveDraftSnapshot = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (contentMdx === serverContentMdx) {
        return;
      }

      if (lastCloudDraftContentRef.current === contentMdx) {
        return;
      }

      if (silent) {
        setCloudDraftSaving(true);
      } else {
        setPreviewing(true);
        setError('');
        setMessage('');
      }

      setCloudDraftError('');

      try {
        const res = await fetch(`/api/chapters/${chapterId}/draft`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim() || '未命名章节',
            contentMdx,
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          const nextError = json.error || '草稿快照保存失败';
          if (silent) {
            setCloudDraftError(nextError);
          } else {
            setError(nextError);
          }
          return;
        }

        lastCloudDraftContentRef.current = contentMdx;
        setLastCloudDraftAt(new Date());
        if (!silent) {
          setMessage(`已生成草稿版本 v${json.data.version}，本地副本将保留到正式保存。`);
        }
      } catch {
        if (silent) {
          setCloudDraftError('云端草稿同步失败');
        } else {
          setError('网络错误，草稿快照保存失败');
        }
      } finally {
        if (silent) {
          setCloudDraftSaving(false);
        } else {
          setPreviewing(false);
        }
      }
    },
    [chapterId, contentMdx, serverContentMdx, title]
  );

  useEffect(() => {
    if (loading || contentMdx === serverContentMdx) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void saveDraftSnapshot({ silent: true });
    }, 30000);

    return () => window.clearTimeout(timeoutId);
  }, [contentMdx, loading, saveDraftSnapshot, serverContentMdx]);

  async function saveChapter(nextStatus = status) {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/chapters/${chapterId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || '未命名章节',
          contentMdx,
          authorNote: authorNote.trim() || null,
          status: nextStatus,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || '保存失败');
        return;
      }

      setStatus(nextStatus);
      setChapter(json.data);
      setContentMdx(json.data.contentMdx || '');
      setServerContentMdx(json.data.contentMdx || '');
      setPreviewHtml(json.data.contentHtml || '');
      removeDraft(chapterId);
      setHasStoredDraft(false);
      setUsingStoredDraft(false);
      setLastLocalDraftAt(null);
      setLastCloudDraftAt(null);
      setCloudDraftError('');
      lastCloudDraftContentRef.current = '';
      setMessage(nextStatus === 'published' ? '章节已保存并发布' : '章节已保存');
    } catch {
      setError('网络错误，保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function saveDraftVersion() {
    await saveDraftSnapshot();
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-[var(--text-tertiary)]">
        <Loader2 className="h-4 w-4 animate-spin" />
        加载章节中
      </div>
    );
  }

  if (error && !chapter) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-8 text-center">
        <p className="text-rose-600">{error}</p>
        <Link href={`/creator/works/${workId}`} className="mt-4 inline-flex text-sm text-[var(--accent)]">
          返回作品
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            href={`/creator/works/${workId}`}
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-4 w-4" />
            返回卷章管理
          </Link>
          <h1 className="text-2xl font-bold">章节编辑</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            MDX 源码、作者注、发布状态和预览在同一工作台里处理。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveDraftVersion}
            disabled={previewing}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-secondary)] disabled:opacity-60"
          >
            {previewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            草稿快照
          </button>
          <button
            type="button"
            onClick={() => saveChapter(status)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-secondary)] disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            保存
          </button>
          <button
            type="button"
            onClick={() => saveChapter('published')}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Eye className="h-4 w-4" />
            保存并发布
          </button>
        </div>
      </div>

      {(message || error) && (
        <div className={`rounded-md border px-4 py-3 text-sm ${error ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {error || message}
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4">
            <label htmlFor="chapter-title" className="mb-1.5 block text-sm font-medium">
              标题
            </label>
            <input
              id="chapter-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-[var(--bg-secondary)] px-3 py-2 text-sm">
                <span className="text-[var(--text-tertiary)]">字数</span>
                <span className="ml-2 font-semibold">{stats.words}</span>
              </div>
              <div className="rounded-md bg-[var(--bg-secondary)] px-3 py-2 text-sm">
                <span className="text-[var(--text-tertiary)]">预计阅读</span>
                <span className="ml-2 font-semibold">{stats.readTime} 分钟</span>
              </div>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as ChapterData['status'])}
                className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              >
                <option value="draft">草稿</option>
                <option value="reviewing">审核中</option>
                <option value="published">已发布</option>
                <option value="archived">已归档</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)]">
            <div className="flex flex-col gap-3 border-b border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <SplitSquareHorizontal className="h-4 w-4 text-[var(--accent)]" />
                <label htmlFor="chapter-mdx-editor">MDX 源码</label>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]">
                <span className="rounded-full bg-[var(--bg-secondary)] px-2.5 py-1">{draftStatus}</span>
                {localDraftTime && <span>本地保存于 {localDraftTime}</span>}
                {cloudDraftTime && <span>云端快照 {cloudDraftTime}</span>}
                {cloudDraftError && <span className="text-amber-700">{cloudDraftError}</span>}
              </div>
            </div>
            {hasStoredDraft && !usingStoredDraft && (
              <div className="flex flex-col gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
                <span>本机保存着一份未同步草稿，恢复前不会覆盖当前服务器内容。</span>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={restoreLocalDraft}
                    className="rounded-md bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    恢复草稿
                  </button>
                  <button
                    type="button"
                    onClick={discardLocalDraft}
                    className="rounded-md border border-amber-300 px-3 py-1.5 text-xs font-semibold"
                  >
                    丢弃
                  </button>
                </div>
              </div>
            )}
            <MdxEditor
              id="chapter-mdx-editor"
              value={contentMdx}
              onChange={handleContentChange}
              onBlur={() => void saveDraftSnapshot({ silent: true })}
              minHeight={560}
            />
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4">
            <label htmlFor="author-note" className="mb-1.5 block text-sm font-medium">
              作者的话
            </label>
            <textarea
              id="author-note"
              value={authorNote}
              onChange={(event) => setAuthorNote(event.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm leading-6 outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)]">
            <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-medium">
              保存后预览
            </div>
            <div
              className="reading-content max-h-[760px] overflow-auto p-5 text-sm"
              dangerouslySetInnerHTML={{
                __html: previewHtml || '<p>保存章节后会在这里看到安全编译后的 HTML 预览。</p>',
              }}
            />
          </div>
        </aside>
      </section>
    </div>
  );
}
