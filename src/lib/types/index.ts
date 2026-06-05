// ========== 用户相关类型 ==========
export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  bio: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'reader' | 'author' | 'editor' | 'moderator' | 'admin';

export interface UserPreferences {
  id: string;
  userId: string;
  theme: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  readingWidth: number;
  darkMode: boolean;
  autoSave: boolean;
  emailNotifications: boolean;
}

// ========== 作品相关类型 ==========
export interface Work {
  id: string;
  authorId: string;
  author?: User;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  status: WorkStatus;
  visibility: Visibility;
  category: string | null;
  wordCount: number;
  viewCount: number;
  favoriteCount: number;
  rating: ContentRating;
  language: string;
  publishAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  volumes?: Volume[];
  tags?: Tag[];
  contentWarnings?: ContentWarning[];
  isFavorited?: boolean;
  readingProgress?: ReadingProgress;
}

export type WorkStatus = 'draft' | 'reviewing' | 'published' | 'archived';
export type Visibility = 'public' | 'private' | 'link_only';
export type ContentRating = 'general' | 'teen' | 'mature' | 'explicit';

// ========== 卷相关类型 ==========
export interface Volume {
  id: string;
  workId: string;
  title: string;
  description: string | null;
  sortOrder: number;
  status: 'draft' | 'published';
  createdAt: Date;
  chapters?: Chapter[];
}

// ========== 章节相关类型 ==========
export interface Chapter {
  id: string;
  volumeId: string;
  workId: string;
  title: string;
  slug: string;
  contentMdx: string | null;
  contentHtml: string | null;
  sortOrder: number;
  status: ChapterStatus;
  wordCount: number;
  readTimeEst: number;
  authorNote: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  volume?: Volume;
  work?: Work;
  tags?: Tag[];
}

export type ChapterStatus = 'draft' | 'reviewing' | 'published' | 'archived';

// ========== 标签相关类型 ==========
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  category: string | null;
  usageCount: number;
  createdAt: Date;
}

// ========== 阅读进度类型 ==========
export interface ReadingProgress {
  id: string;
  userId: string;
  chapterId: string;
  workId: string;
  progress: number;
  scrollPosition: number;
  status: 'reading' | 'completed' | 'dropped';
  lastReadAt: Date;
}

// ========== 内容警告类型 ==========
export interface ContentWarning {
  id: string;
  name: string;
  description: string | null;
  severity: 'mild' | 'moderate' | 'severe';
}

// ========== 评论类型 ==========
export interface Comment {
  id: string;
  userId: string;
  user?: User;
  chapterId: string;
  parentId: string | null;
  content: string;
  status: 'active' | 'hidden' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  replies?: Comment[];
}

// ========== 主题类型 ==========
export interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  authorId: string | null;
  config: ThemeConfig | null;
  isDefault: boolean;
  isPublic: boolean;
  usageCount: number;
  createdAt: Date;
}

export interface ThemeConfig {
  variables: Record<string, string>;
  assets?: {
    bgPattern?: string;
    fontFamily?: string;
  };
}

// ========== 草稿版本类型 ==========
export interface DraftVersion {
  id: string;
  chapterId: string;
  contentMdx: string | null;
  title: string | null;
  version: number;
  createdAt: Date;
}

// ========== 搜索相关类型 ==========
export interface SearchParams {
  query: string;
  tags?: string[];
  category?: string;
  rating?: ContentRating;
  status?: WorkStatus;
  language?: string;
  sortBy?: 'relevance' | 'latest' | 'popular' | 'word_count';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  works: Work[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ========== 分页类型 ==========
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ========== 表单类型 ==========
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface WorkForm {
  title: string;
  description: string;
  category: string;
  tags: string[];
  rating: ContentRating;
  visibility: Visibility;
  language: string;
  coverUrl?: string;
}

export interface ChapterForm {
  title: string;
  contentMdx: string;
  authorNote?: string;
  tags?: string[];
}

// ========== 通知类型 ==========
export interface Notification {
  id: string;
  type: 'comment' | 'favorite' | 'follow' | 'system' | 'update';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

// ========== 仪表盘统计类型 ==========
export interface DashboardStats {
  totalWorks: number;
  totalChapters: number;
  totalWords: number;
  totalViews: number;
  totalFavorites: number;
  recentViews: { date: string; count: number }[];
  topWorks: { work: Work; views: number }[];
}

// ========== API 响应类型 ==========
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ========== MDX 相关类型 ==========
export interface MdxMeta {
  title: string;
  description?: string;
  tags?: string[];
  publishedAt?: string;
  author?: string;
  cover?: string;
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

// ========== 事件类型 ==========
export interface WorkEvent {
  type: 'create' | 'update' | 'publish' | 'archive';
  workId: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ChapterEvent {
  type: 'create' | 'update' | 'publish' | 'delete';
  chapterId: string;
  workId: string;
  userId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
