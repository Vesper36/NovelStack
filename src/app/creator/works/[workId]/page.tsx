'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Pencil,
  BookOpen,
  FileText,
  Save,
  ArrowLeft,
  FolderOpen,
  GripVertical,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber, formatDate } from '@/lib/utils';
import type {
  Work,
  Volume,
  Chapter,
  WorkStatus,
  Visibility,
  ContentRating,
} from '@/lib/types';

// ========== Status Badge ==========

const STATUS_CONFIG: Record<
  WorkStatus,
  { label: string; bg: string; text: string }
> = {
  draft: { label: '草稿', bg: 'bg-gray-100', text: 'text-gray-700' },
  reviewing: { label: '审核中', bg: 'bg-amber-100', text: 'text-amber-700' },
  published: { label: '已发布', bg: 'bg-green-100', text: 'text-green-700' },
  archived: { label: '已归档', bg: 'bg-red-100', text: 'text-red-700' },
};

function StatusBadge({ status }: { status: WorkStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        cfg.bg,
        cfg.text
      )}
    >
      {cfg.label}
    </span>
  );
}

// ========== Toast ==========

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

let toastId = 0;

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) {
  return (
    <div className="fixed right-4 top-20 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onRemove(t.id)}
          className={cn(
            'cursor-pointer rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all',
            t.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ========== Types for local state ==========

interface WorkData extends Omit<Work, 'tags' | 'volumes'> {
  volumes: (Volume & { chapters: Chapter[] })[];
  tags: { id: string; name: string; slug: string; color?: string | null }[];
}

interface VolumeNode extends Volume {
  chapters: Chapter[];
  expanded: boolean;
  editing: boolean;
  editTitle: string;
  editDescription: string;
}

// ========== Loading Skeleton ==========

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-6 w-24 rounded bg-[var(--bg-secondary)]" />

      {/* Metadata skeleton */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 space-y-4">
        <div className="h-8 w-48 rounded bg-[var(--bg-secondary)]" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-16 rounded bg-[var(--bg-secondary)]" />
              <div className="h-10 w-full rounded bg-[var(--bg-secondary)]" />
            </div>
          ))}
        </div>
      </div>

      {/* Tree skeleton */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-5 w-5 rounded bg-[var(--bg-secondary)]" />
            <div className="h-6 w-40 rounded bg-[var(--bg-secondary)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
// ========== Volume Item ==========

function VolumeItem({
  volume,
  workId,
  onToggleExpand,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDeleteVolume,
  onAddChapter,
  onDeleteChapter,
  volumeEditSaving,
}: {
  volume: VolumeNode;
  workId: string;
  onToggleExpand: (volId: string) => void;
  onStartEdit: (volId: string) => void;
  onCancelEdit: (volId: string) => void;
  onSaveEdit: (volId: string) => void;
  onDeleteVolume: (volId: string, title: string) => void;
  onAddChapter: (volId: string) => void;
  onDeleteChapter: (chapterId: string, title: string) => void;
  volumeEditSaving: boolean;
}) {
  const totalWords = volume.chapters.reduce((sum, ch) => sum + (ch.wordCount || 0), 0);

  return (
    <div className="group">
      {/* Volume header */}
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-[var(--bg-secondary)]">
        {/* Drag handle */}
        <GripVertical className="h-4 w-4 cursor-grab text-[var(--text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Expand/collapse */}
        <button
          onClick={() => onToggleExpand(volume.id)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-secondary)] transition-colors hover:bg-[var(--border)]"
        >
          {volume.expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {/* Volume icon */}
        <FolderOpen className="h-4 w-4 shrink-0 text-[var(--accent)]" />

        {/* Volume title / edit */}
        <div className="flex-1 min-w-0">
          {volume.editing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={volume.editTitle}
                onChange={(e) => {
                  // handled by parent via controlled state - we'll use a different approach
                  // This is managed through the parent component
                  const event = new CustomEvent('vol-edit-title', {
                    detail: { volId: volume.id, value: e.target.value },
                  });
                  window.dispatchEvent(event);
                }}
                className="flex-1 rounded border border-[var(--accent)] bg-[var(--bg-primary)] px-2 py-1 text-sm outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveEdit(volume.id);
                  if (e.key === 'Escape') onCancelEdit(volume.id);
                }}
              />
              <button
                onClick={() => onSaveEdit(volume.id)}
                disabled={volumeEditSaving}
                className="rounded p-1 text-[var(--accent)] hover:bg-[var(--accent)]/10 disabled:opacity-50"
              >
                {volumeEditSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => onCancelEdit(volume.id)}
                className="rounded p-1 text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)]"
              >
                取消
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium text-[var(--text-primary)]">
                {volume.title}
              </span>
              <span className="shrink-0 text-xs text-[var(--text-tertiary)]">
                {volume.chapters.length} 章 / {formatNumber(totalWords)} 字
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {!volume.editing && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => onStartEdit(volume.id)}
              title="编辑卷"
              className="rounded p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onAddChapter(volume.id)}
              title="添加章节"
              className="rounded p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--accent)]"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDeleteVolume(volume.id, volume.title)}
              title="删除卷"
              className="rounded p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Chapters list */}
      {volume.expanded && (
        <div className="ml-10 border-l border-[var(--border)] pl-3">
          {volume.chapters.length === 0 ? (
            <div className="py-3 text-center text-xs text-[var(--text-tertiary)]">
              暂无章节，点击上方 + 添加
            </div>
          ) : (
            volume.chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className="group/ch flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors hover:bg-[var(--bg-secondary)]"
              >
                <GripVertical className="h-3.5 w-3.5 cursor-grab text-[var(--text-tertiary)] opacity-0 transition-opacity group-hover/ch:opacity-100" />

                <FileText className="h-3.5 w-3.5 shrink-0 text-[var(--text-tertiary)]" />

                <span className="w-6 shrink-0 text-xs text-[var(--text-tertiary)] text-right">
                  {index + 1}
                </span>

                <Link
                  href={`/creator/works/${workId}/chapters/${chapter.id}/edit`}
                  className="flex-1 min-w-0 truncate text-sm text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
                >
                  {chapter.title}
                </Link>

                <span className="shrink-0 text-xs text-[var(--text-tertiary)]">
                  {formatNumber(chapter.wordCount || 0)} 字
                </span>

                <StatusBadge status={chapter.status as WorkStatus} />

                <button
                  onClick={() => onDeleteChapter(chapter.id, chapter.title)}
                  title="删除章节"
                  className="rounded p-1 text-[var(--text-tertiary)] opacity-0 transition-all group-hover/ch:opacity-100 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ========== Main Page ==========

export default function WorkDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workId = params.workId as string;

  // ---- Toast state ----
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ---- Loading ----
  const [loading, setLoading] = useState(true);

  // ---- Work metadata form state ----
  const [workTitle, setWorkTitle] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [workCategory, setWorkCategory] = useState('');
  const [workRating, setWorkRating] = useState<ContentRating>('general');
  const [workVisibility, setWorkVisibility] = useState<Visibility>('public');
  const [workTags, setWorkTags] = useState('');
  const [workStatus, setWorkStatus] = useState<WorkStatus>('draft');
  const [workCoverUrl, setWorkCoverUrl] = useState('');
  const [metaSaving, setMetaSaving] = useState(false);

  // ---- Volume tree state ----
  const [volumes, setVolumes] = useState<VolumeNode[]>([]);
  const [volumeEditSaving, setVolumeEditSaving] = useState(false);

  // ---- Fetch work data ----
  const fetchWork = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/works/${workId}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        showToast(json.error || '加载失败', 'error');
        return;
      }

      const data: WorkData = json.data;

      // Populate metadata
      setWorkTitle(data.title || '');
      setWorkDescription(data.description || '');
      setWorkCategory(data.category || '');
      setWorkRating(data.rating || 'general');
      setWorkVisibility(data.visibility || 'public');
      setWorkStatus(data.status || 'draft');
      setWorkCoverUrl(data.coverUrl || '');
      setWorkTags(
        (data.tags || []).map((t: { name: string }) => t.name).join(', ')
      );

      // Populate volumes
      setVolumes(
        (data.volumes || []).map(
          (v: Volume & { chapters: Chapter[] }): VolumeNode => ({
            ...v,
            chapters: v.chapters || [],
            expanded: true,
            editing: false,
            editTitle: v.title,
            editDescription: v.description || '',
          })
        )
      );
    } catch {
      showToast('网络错误，无法加载作品', 'error');
    } finally {
      setLoading(false);
    }
  }, [workId, showToast]);

  useEffect(() => {
    if (workId) fetchWork();
  }, [workId, fetchWork]);

  // Listen for custom events from VolumeItem child inputs
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.volId && detail?.value !== undefined) {
        setVolumes((prev) =>
          prev.map((v) =>
            v.id === detail.volId ? { ...v, editTitle: detail.value } : v
          )
        );
      }
    };
    window.addEventListener('vol-edit-title', handler);
    return () => window.removeEventListener('vol-edit-title', handler);
  }, []);

  // ---- Volume helpers ----

  const toggleVolumeExpand = useCallback((volId: string) => {
    setVolumes((prev) =>
      prev.map((v) =>
        v.id === volId ? { ...v, expanded: !v.expanded } : v
      )
    );
  }, []);

  const startVolumeEdit = useCallback((volId: string) => {
    setVolumes((prev) =>
      prev.map((v) =>
        v.id === volId ? { ...v, editing: true } : v
      )
    );
  }, []);

  const cancelVolumeEdit = useCallback((volId: string) => {
    setVolumes((prev) =>
      prev.map((v) =>
        v.id === volId ? { ...v, editing: false, editTitle: v.title, editDescription: v.description || '' } : v
      )
    );
  }, []);

  const saveVolumeEdit = useCallback(
    async (volId: string) => {
      const vol = volumes.find((v) => v.id === volId);
      if (!vol) return;

      try {
        setVolumeEditSaving(true);
        const res = await fetch(`/api/works/${workId}/volumes/${volId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: vol.editTitle,
            description: vol.editDescription,
          }),
        });

        const json = await res.json();
        if (!res.ok) {
          showToast(json.error || '保存失败', 'error');
          return;
        }

        setVolumes((prev) =>
          prev.map((v) =>
            v.id === volId
              ? {
                  ...v,
                  title: vol.editTitle,
                  description: vol.editDescription,
                  editing: false,
                }
              : v
          )
        );
        showToast('卷标题已更新', 'success');
      } catch {
        showToast('网络错误，保存失败', 'error');
      } finally {
        setVolumeEditSaving(false);
      }
    },
    [volumes, workId, showToast]
  );

  const deleteVolume = useCallback(
    async (volId: string, title: string) => {
      if (!confirm(`确定要删除「${title}」及其所有章节吗？此操作不可撤销。`)) {
        return;
      }

      try {
        const res = await fetch(`/api/works/${workId}/volumes/${volId}`, {
          method: 'DELETE',
        });

        const json = await res.json();
        if (!res.ok) {
          showToast(json.error || '删除失败', 'error');
          return;
        }

        setVolumes((prev) => prev.filter((v) => v.id !== volId));
        showToast('卷已删除', 'success');
      } catch {
        showToast('网络错误，删除失败', 'error');
      }
    },
    [workId, showToast]
  );

  const addVolume = useCallback(async () => {
    try {
      const res = await fetch(`/api/works/${workId}/volumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `第 ${volumes.length + 1} 卷`,
          description: '',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.error || '创建失败', 'error');
        return;
      }

      const newVol: VolumeNode = {
        ...json.data,
        chapters: json.data.chapters || [],
        expanded: true,
        editing: true,
        editTitle: json.data.title,
        editDescription: '',
      };
      setVolumes((prev) => [...prev, newVol]);
      showToast('新卷已创建', 'success');
    } catch {
      showToast('网络错误，创建失败', 'error');
    }
  }, [workId, volumes.length, showToast]);

  // ---- Chapter helpers ----

  const addChapter = useCallback(
    async (volId: string) => {
      try {
        const vol = volumes.find((v) => v.id === volId);
        const chapterIndex = vol ? vol.chapters.length + 1 : 1;

        const res = await fetch(`/api/works/${workId}/volumes/${volId}/chapters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `第 ${chapterIndex} 章`,
            contentMdx: '',
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          showToast(json.error || '创建章节失败', 'error');
          return;
        }

        setVolumes((prev) =>
          prev.map((v) =>
            v.id === volId
              ? { ...v, chapters: [...v.chapters, json.data] }
              : v
          )
        );
        showToast('章节已创建', 'success');
      } catch {
        showToast('网络错误，创建章节失败', 'error');
      }
    },
    [workId, volumes, showToast]
  );

  const deleteChapter = useCallback(
    async (chapterId: string, title: string) => {
      if (!confirm(`确定要删除章节「${title}」吗？此操作不可撤销。`)) {
        return;
      }

      try {
        const res = await fetch(`/api/chapters/${chapterId}`, {
          method: 'DELETE',
        });

        const json = await res.json();
        if (!res.ok) {
          showToast(json.error || '删除章节失败', 'error');
          return;
        }

        setVolumes((prev) =>
          prev.map((v) => ({
            ...v,
            chapters: v.chapters.filter((ch) => ch.id !== chapterId),
          }))
        );
        showToast('章节已删除', 'success');
      } catch {
        showToast('网络错误，删除章节失败', 'error');
      }
    },
    [showToast]
  );

  // ---- Save work metadata ----

  const saveWorkMeta = useCallback(async () => {
    try {
      setMetaSaving(true);
      const tags = workTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`/api/works/${workId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: workTitle,
          description: workDescription,
          category: workCategory,
          rating: workRating,
          visibility: workVisibility,
          status: workStatus,
          coverUrl: workCoverUrl || null,
          tags
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || '保存失败', 'error');
        return;
      }

      showToast('作品信息已保存', 'success');
    } catch {
      showToast('网络错误，保存失败', 'error');
    } finally {
      setMetaSaving(false);
    }
  }, [
    workId,
    workTitle,
    workDescription,
    workCategory,
    workRating,
    workVisibility,
    workStatus,
    workCoverUrl,
    workTags,
    showToast,
  ]);

  // ---- Render ----

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <LoadingSkeleton />
      </div>
    );
  }

  const totalChapters = volumes.reduce(
    (sum, v) => sum + v.chapters.length,
    0
  );
  const totalWords = volumes.reduce(
    (sum, v) => sum + v.chapters.reduce((s, ch) => s + (ch.wordCount || 0), 0),
    0
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Back navigation */}
      <Link
        href="/creator/works"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
      >
        <ArrowLeft className="h-4 w-4" />
        返回作品列表
      </Link>

      {/* ===== Work Metadata Editor ===== */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6">
        <div className="mb-5 flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-[var(--accent)]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            作品信息
          </h2>
          <StatusBadge status={workStatus} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              标题
            </label>
            <input
              type="text"
              value={workTitle}
              onChange={(e) => setWorkTitle(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              简介
            </label>
            <textarea
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              分类
            </label>
            <input
              type="text"
              value={workCategory}
              onChange={(e) => setWorkCategory(e.target.value)}
              placeholder="如: 奇幻, 科幻, 言情..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>


          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              分级
            </label>
            <select
              value={workRating}
              onChange={(e) => setWorkRating(e.target.value as ContentRating)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            >
              <option value="general">全年龄</option>
              <option value="teen">青少年</option>
              <option value="mature">成人</option>
              <option value="explicit">限制级</option>
            </select>
          </div>

          {/* Visibility */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              可见性
            </label>
            <select
              value={workVisibility}
              onChange={(e) => setWorkVisibility(e.target.value as Visibility)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            >
              <option value="public">公开</option>
              <option value="private">私密</option>
              <option value="link_only">仅链接可见</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              状态
            </label>
            <select
              value={workStatus}
              onChange={(e) => setWorkStatus(e.target.value as WorkStatus)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            >
              <option value="draft">草稿</option>
              <option value="reviewing">审核中</option>
              <option value="published">已发布</option>
              <option value="archived">已归档</option>
            </select>
          </div>

          {/* Tags */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              标签
              <span className="ml-2 font-normal text-[var(--text-tertiary)]">
                用逗号分隔
              </span>
            </label>
            <input
              type="text"
              value={workTags}
              onChange={(e) => setWorkTags(e.target.value)}
              placeholder="标签1, 标签2, 标签3"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>

          {/* Cover URL */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
              封面 URL
            </label>
            <input
              type="url"
              value={workCoverUrl}
              onChange={(e) => setWorkCoverUrl(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
        </div>

        {/* Stats + Save */}
        <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
            <span>{formatNumber(totalWords)} 字</span>
            <span>{totalChapters} 章</span>
            <span>{volumes.length} 卷</span>
          </div>
          <button
            onClick={saveWorkMeta}
            disabled={metaSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {metaSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                保存修改
              </>
            )}
          </button>
        </div>
      </section>

      {/* ===== Chapter Tree ===== */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              卷章管理
            </h2>
          </div>
          <button
            onClick={addVolume}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
          >
            <Plus className="h-4 w-4" />
            新建卷
          </button>
        </div>

        {volumes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-secondary)] py-12 text-center">
            <FolderOpen className="mx-auto h-8 w-8 text-[var(--text-tertiary)]" />
            <p className="mt-2 text-sm text-[var(--text-tertiary)]">
              暂无卷，点击上方「新建卷」开始
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {volumes.map((vol) => (
              <VolumeItem
                key={vol.id}
                volume={vol}
                workId={workId}
                onToggleExpand={toggleVolumeExpand}
                onStartEdit={startVolumeEdit}
                onCancelEdit={cancelVolumeEdit}
                onSaveEdit={saveVolumeEdit}
                onDeleteVolume={deleteVolume}
                onAddChapter={addChapter}
                onDeleteChapter={deleteChapter}
                volumeEditSaving={volumeEditSaving}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
