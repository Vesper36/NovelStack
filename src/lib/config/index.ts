// 网站配置
export const siteConfig = {
  name: 'InkWeave',
  title: 'InkWeave - 墨织 | 为创作者而生的叙事平台',
  description: '一个面向创作者与读者的结构化叙事平台，为长篇连载、同人衍生、互动实验型文本提供容器级支持。',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:51637',
  ogImage: '/og-image.png',
  creator: '@inkweave',
  keywords: ['同人', '小说', '创作', '连载', '文学', 'fanfiction', 'writing'],
};

// 服务端口配置
export const ports = {
  frontend: Number(process.env.FRONTEND_PORT) || 51637,
  backend: Number(process.env.BACKEND_PORT) || 51638,
  meilisearch: Number(process.env.MEILI_PORT) || 51639,
};

// 后端 API 配置
export const backendConfig = {
  baseUrl: process.env.BACKEND_URL || `http://localhost:${ports.backend}`,
  docsUrl: process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}/docs`
    : `http://localhost:${ports.backend}/docs`,
};

// Meilisearch 配置
export const meilisearchConfig = {
  host: process.env.MEILI_HOST || `http://localhost:${ports.meilisearch}`,
  apiKey: process.env.MEILI_API_KEY || '',
};

// 分页配置
export const paginationConfig = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
};

// 编辑器配置
export const editorConfig = {
  autoSaveInterval: 30000, // 30秒
  maxContentLength: 1000000, // 100万字符
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

// 阅读配置
export const readingConfig = {
  minFontSize: 14,
  maxFontSize: 24,
  defaultFontSize: 16,
  minLineHeight: 1.2,
  maxLineHeight: 2.5,
  defaultLineHeight: 1.75,
  defaultReadingWidth: 65, // ch 单位
};

// 主题配置
export const themes = [
  {
    id: 'default',
    name: '默认',
    description: '简洁优雅的默认主题',
    variables: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f8fafc',
      '--bg-tertiary': '#f1f5f9',
      '--text-primary': '#0f172a',
      '--text-secondary': '#475569',
      '--text-tertiary': '#94a3b8',
      '--accent': '#6366f1',
      '--accent-light': '#818cf8',
      '--accent-dark': '#4f46e5',
      '--border': '#e2e8f0',
      '--shadow': 'rgba(0, 0, 0, 0.1)',
    },
  },
  {
    id: 'midnight',
    name: '深夜',
    description: '护眼暗色主题',
    variables: {
      '--bg-primary': '#0f172a',
      '--bg-secondary': '#1e293b',
      '--bg-tertiary': '#334155',
      '--text-primary': '#f1f5f9',
      '--text-secondary': '#cbd5e1',
      '--text-tertiary': '#64748b',
      '--accent': '#818cf8',
      '--accent-light': '#a5b4fc',
      '--accent-dark': '#6366f1',
      '--border': '#334155',
      '--shadow': 'rgba(0, 0, 0, 0.3)',
    },
  },
  {
    id: 'paper',
    name: '羊皮纸',
    description: '复古纸质阅读体验',
    variables: {
      '--bg-primary': '#faf3e0',
      '--bg-secondary': '#f5e6c8',
      '--bg-tertiary': '#efe0b0',
      '--text-primary': '#3e2723',
      '--text-secondary': '#5d4037',
      '--text-tertiary': '#8d6e63',
      '--accent': '#c62828',
      '--accent-light': '#e53935',
      '--accent-dark': '#b71c1c',
      '--border': '#d7ccc8',
      '--shadow': 'rgba(62, 39, 35, 0.1)',
    },
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    description: '未来科技风格',
    variables: {
      '--bg-primary': '#0a0a0f',
      '--bg-secondary': '#12121a',
      '--bg-tertiary': '#1a1a25',
      '--text-primary': '#00ff9d',
      '--text-secondary': '#00cc7a',
      '--text-tertiary': '#009966',
      '--accent': '#ff00ff',
      '--accent-light': '#ff66ff',
      '--accent-dark': '#cc00cc',
      '--border': '#00ff9d33',
      '--shadow': 'rgba(0, 255, 157, 0.1)',
    },
  },
  {
    id: 'forest',
    name: '森林',
    description: '自然清新风格',
    variables: {
      '--bg-primary': '#f0fdf4',
      '--bg-secondary': '#dcfce7',
      '--bg-tertiary': '#bbf7d0',
      '--text-primary': '#14532d',
      '--text-secondary': '#166534',
      '--text-tertiary': '#22c55e',
      '--accent': '#059669',
      '--accent-light': '#10b981',
      '--accent-dark': '#047857',
      '--border': '#86efac',
      '--shadow': 'rgba(5, 150, 105, 0.1)',
    },
  },
  {
    id: 'ocean',
    name: '海洋',
    description: '深邃宁静风格',
    variables: {
      '--bg-primary': '#f0f9ff',
      '--bg-secondary': '#e0f2fe',
      '--bg-tertiary': '#bae6fd',
      '--text-primary': '#0c4a6e',
      '--text-secondary': '#0369a1',
      '--text-tertiary': '#0ea5e9',
      '--accent': '#0284c7',
      '--accent-light': '#38bdf8',
      '--accent-dark': '#0369a1',
      '--border': '#7dd3fc',
      '--shadow': 'rgba(2, 132, 199, 0.1)',
    },
  },
];

// 内容警告等级
export const contentWarningLevels = [
  { id: 'general', name: '全年龄', color: '#22c55e', description: '适合所有读者' },
  { id: 'teen', name: '青少年', color: '#f59e0b', description: '13岁以上' },
  { id: 'mature', name: '成人', color: '#f97316', description: '17岁以上，可能包含暴力、性暗示等' },
  { id: 'explicit', name: '限制级', color: '#ef4444', description: '18岁以上，包含露骨内容' },
];

// 常见标签分类
export const tagCategories = [
  {
    name: '题材',
    tags: ['奇幻', '科幻', '现代', '古代', '架空', '未来', '末日', '校园', '都市', '仙侠'],
  },
  {
    name: '类型',
    tags: ['言情', '悬疑', '恐怖', '喜剧', '悲剧', '冒险', '推理', '日常', '热血', '治愈'],
  },
  {
    name: '配对',
    tags: ['BG', 'BL', 'GL', '无CP', '多CP', '逆CP'],
  },
  {
    name: '状态',
    tags: ['连载中', '已完结', '暂停', '弃坑'],
  },
];

// API 路由
export const apiRoutes = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  works: {
    list: '/api/works',
    detail: (slug: string) => `/api/works/${slug}`,
    chapters: (workId: string) => `/api/works/${workId}/chapters`,
  },
  tags: {
    list: '/api/tags',
    detail: (slug: string) => `/api/tags/${slug}`,
  },
  search: '/api/search',
  upload: '/api/upload',
};

// 本地存储键名
export const storageKeys = {
  theme: 'inkweave-theme',
  fontSize: 'inkweave-font-size',
  lineHeight: 'inkweave-line-height',
  readingWidth: 'inkweave-reading-width',
  readingProgress: 'inkweave-reading-progress',
  draft: 'inkweave-draft',
  searchHistory: 'inkweave-search-history',
  authToken: 'inkweave-auth-token',
};
