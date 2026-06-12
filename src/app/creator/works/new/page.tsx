'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import type { ContentRating, Visibility } from '@/lib/types';

export default function NewWorkPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState<ContentRating>('general');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [tagText, setTagText] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('标题不能为空');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          category: category.trim() || null,
          rating,
          visibility,
          tags: tagText.split(',').map((tag) => tag.trim()).filter(Boolean),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || '创建作品失败');
        return;
      }

      router.push(`/creator/works/${json.data.id}`);
      router.refresh();
    } catch {
      setError('网络错误，创建失败');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/creator/works"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]"
      >
        <ArrowLeft className="h-4 w-4" />
        返回作品列表
      </Link>

      <div>
        <h1 className="text-2xl font-bold">新建作品</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          先建立作品容器，再进入卷册树添加章节与草稿。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-6">
        {error && (
          <div className="mb-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
              标题
            </label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：潮汐档案"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
              简介
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="给读者一个明确的入口：世界观、冲突、更新状态或阅读提示。"
              className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm leading-6 outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium">
              分类
            </label>
            <input
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="同人长篇 / 科幻冒险"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label htmlFor="tags" className="mb-1.5 block text-sm font-medium">
              标签
            </label>
            <input
              id="tags"
              value={tagText}
              onChange={(event) => setTagText(event.target.value)}
              placeholder="同人, 连载中, 群像"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label htmlFor="rating" className="mb-1.5 block text-sm font-medium">
              分级
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(event) => setRating(event.target.value as ContentRating)}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            >
              <option value="general">全年龄</option>
              <option value="teen">青少年</option>
              <option value="mature">成人</option>
              <option value="explicit">限制级</option>
            </select>
          </div>

          <div>
            <label htmlFor="visibility" className="mb-1.5 block text-sm font-medium">
              可见性
            </label>
            <select
              id="visibility"
              value={visibility}
              onChange={(event) => setVisibility(event.target.value as Visibility)}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            >
              <option value="public">公开</option>
              <option value="private">私密</option>
              <option value="link_only">仅链接可见</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-[var(--border)] pt-5">
          <Link
            href="/creator/works"
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-secondary)]"
          >
            取消
          </Link>
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            创建作品
          </button>
        </div>
      </form>
    </div>
  );
}
