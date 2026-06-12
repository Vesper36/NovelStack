import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

// ========== 用户表 ==========
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash'),
  emailVerified: integer('email_verified', { mode: 'timestamp' }),
  image: text('image'),
  bio: text('bio'),
  role: text('role', { enum: ['reader', 'author', 'editor', 'moderator', 'admin'] }).default('reader'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ========== 作品表 ==========
export const works = sqliteTable('works', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  authorId: text('author_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  coverUrl: text('cover_url'),
  status: text('status', { enum: ['draft', 'reviewing', 'published', 'archived'] }).default('draft'),
  visibility: text('visibility', { enum: ['public', 'private', 'link_only'] }).default('public'),
  category: text('category'),
  wordCount: integer('word_count').default(0),
  viewCount: integer('view_count').default(0),
  favoriteCount: integer('favorite_count').default(0),
  rating: text('rating', { enum: ['general', 'teen', 'mature', 'explicit'] }).default('general'),
  language: text('language').default('zh'),
  publishAt: integer('publish_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ========== 卷表 ==========
export const volumes = sqliteTable('volumes', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  workId: text('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').default(0),
  status: text('status', { enum: ['draft', 'published'] }).default('draft'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ========== 章节表 ==========
export const chapters = sqliteTable('chapters', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  volumeId: text('volume_id').notNull().references(() => volumes.id, { onDelete: 'cascade' }),
  workId: text('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  contentMdx: text('content_mdx'),
  contentHtml: text('content_html'),
  sortOrder: integer('sort_order').default(0),
  status: text('status', { enum: ['draft', 'reviewing', 'published', 'archived'] }).default('draft'),
  wordCount: integer('word_count').default(0),
  readTimeEst: integer('read_time_est').default(0),
  authorNote: text('author_note'),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ========== 标签表 ==========
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').unique().notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  color: text('color'),
  category: text('category'),
  usageCount: integer('usage_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ========== 作品-标签关联表 ==========
export const workTags = sqliteTable('work_tags', {
  workId: text('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
});

// ========== 章节-标签关联表 ==========
export const chapterTags = sqliteTable('chapter_tags', {
  chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
});

// ========== 用户偏好表 ==========
export const userPreferences = sqliteTable('user_preferences', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').unique().notNull().references(() => users.id),
  theme: text('theme').default('default'),
  fontSize: integer('font_size').default(16),
  fontFamily: text('font_family').default('serif'),
  lineHeight: real('line_height').default(1.75),
  readingWidth: integer('reading_width').default(65),
  darkMode: integer('dark_mode', { mode: 'boolean' }).default(false),
  autoSave: integer('auto_save', { mode: 'boolean' }).default(true),
  emailNotifications: integer('email_notifications', { mode: 'boolean' }).default(true),
});

// ========== 阅读进度表 ==========
export const readingProgress = sqliteTable('reading_progress', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id),
  chapterId: text('chapter_id').notNull().references(() => chapters.id),
  workId: text('work_id').notNull().references(() => works.id),
  progress: real('progress').default(0),
  scrollPosition: integer('scroll_position').default(0),
  status: text('status', { enum: ['reading', 'completed', 'dropped'] }).default('reading'),
  lastReadAt: integer('last_read_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ========== 收藏表 ==========
export const favorites = sqliteTable('favorites', {
  userId: text('user_id').notNull().references(() => users.id),
  workId: text('work_id').notNull().references(() => works.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ========== 评论表 ==========
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id),
  chapterId: text('chapter_id').notNull().references(() => chapters.id),
  parentId: text('parent_id'),
  content: text('content').notNull(),
  status: text('status', { enum: ['active', 'hidden', 'deleted'] }).default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ========== 草稿版本表 ==========
export const draftVersions = sqliteTable('draft_versions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  chapterId: text('chapter_id').notNull().references(() => chapters.id),
  contentMdx: text('content_mdx'),
  title: text('title'),
  version: integer('version').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ========== 内容警告表 ==========
export const contentWarnings = sqliteTable('content_warnings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').unique().notNull(),
  description: text('description'),
  severity: text('severity', { enum: ['mild', 'moderate', 'severe'] }).default('mild'),
});

// ========== 作品-内容警告关联表 ==========
export const workContentWarnings = sqliteTable('work_content_warnings', {
  workId: text('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
  warningId: text('warning_id').notNull().references(() => contentWarnings.id),
});

// ========== 主题表 ==========
export const themes = sqliteTable('themes', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  authorId: text('author_id').references(() => users.id),
  config: text('config'), // JSON string
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
  isPublic: integer('is_public', { mode: 'boolean' }).default(true),
  usageCount: integer('usage_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ========== 举报表 ==========
export const reports = sqliteTable('reports', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  reporterId: text('reporter_id').notNull().references(() => users.id),
  targetType: text('target_type', { enum: ['work', 'chapter', 'comment', 'user'] }).notNull(),
  targetId: text('target_id').notNull(),
  reason: text('reason').notNull(),
  description: text('description'),
  status: text('status', { enum: ['pending', 'reviewing', 'resolved', 'dismissed'] }).default('pending'),
  resolvedBy: text('resolved_by').references(() => users.id),
  resolvedAt: integer('resolved_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
