// 网站配置
export const siteConfig = {
  name: 'InkWeave',
  title: 'InkWeave - 墨织 | 为创作者而生的叙事平台',
  description: '一个面向创作者与读者的结构化叙事平台，为长篇连载、同人衍生、互动实验型文本提供容器级支持。',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:50040',
  ogImage: '/og-image.png',
  creator: '@inkweave',
  keywords: ['同人', '小说', '创作', '连载', '文学', 'fanfiction', 'writing'],
};

// 服务端口配置
export const ports = {
  frontend: Number(process.env.FRONTEND_PORT) || 50040,
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
      '--bg-primary': '#fbfaf7',
      '--bg-secondary': '#f1eee6',
      '--bg-tertiary': '#e6dfd2',
      '--text-primary': '#17201b',
      '--text-secondary': '#526157',
      '--text-tertiary': '#8a9389',
      '--accent': '#9b2f2b',
      '--accent-light': '#c76f3f',
      '--accent-dark': '#6f2421',
      '--border': '#ddd6c9',
      '--shadow': 'rgba(23, 32, 27, 0.14)',
    },
  },
  {
    id: 'midnight',
    name: '深夜',
    description: '护眼暗色主题',
    variables: {
      '--bg-primary': '#151c19',
      '--bg-secondary': '#1f2823',
      '--bg-tertiary': '#2b362f',
      '--text-primary': '#edf2e9',
      '--text-secondary': '#c8d1c3',
      '--text-tertiary': '#869184',
      '--accent': '#b98b54',
      '--accent-light': '#d9ae73',
      '--accent-dark': '#8a6238',
      '--border': '#344139',
      '--shadow': 'rgba(0, 0, 0, 0.34)',
    },
  },
  {
    id: 'paper',
    name: '羊皮纸',
    description: '复古纸质阅读体验',
    variables: {
      '--bg-primary': '#f6eedc',
      '--bg-secondary': '#eee0c5',
      '--bg-tertiary': '#e3d0aa',
      '--text-primary': '#3a2b24',
      '--text-secondary': '#6f5948',
      '--text-tertiary': '#927964',
      '--accent': '#9b2f2b',
      '--accent-light': '#c76f3f',
      '--accent-dark': '#74241f',
      '--border': '#d8c7a9',
      '--shadow': 'rgba(58, 43, 36, 0.13)',
    },
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    description: '未来科技风格',
    variables: {
      '--bg-primary': '#111614',
      '--bg-secondary': '#171e1b',
      '--bg-tertiary': '#202923',
      '--text-primary': '#d5ead5',
      '--text-secondary': '#a9c9ae',
      '--text-tertiary': '#71917a',
      '--accent': '#c76f3f',
      '--accent-light': '#e0a46f',
      '--accent-dark': '#8e4c2e',
      '--border': '#314238',
      '--shadow': 'rgba(199, 111, 63, 0.14)',
    },
  },
  {
    id: 'forest',
    name: '森林',
    description: '自然清新风格',
    variables: {
      '--bg-primary': '#f4f7ed',
      '--bg-secondary': '#e8eee0',
      '--bg-tertiary': '#d7e2cd',
      '--text-primary': '#20352a',
      '--text-secondary': '#4c6656',
      '--text-tertiary': '#7e947f',
      '--accent': '#4f7d64',
      '--accent-light': '#6fa284',
      '--accent-dark': '#315840',
      '--border': '#c9d8bf',
      '--shadow': 'rgba(49, 88, 64, 0.13)',
    },
  },
  {
    id: 'ocean',
    name: '海洋',
    description: '深邃宁静风格',
    variables: {
      '--bg-primary': '#eef4f2',
      '--bg-secondary': '#dde8e5',
      '--bg-tertiary': '#cadbd7',
      '--text-primary': '#203236',
      '--text-secondary': '#48666a',
      '--text-tertiary': '#799194',
      '--accent': '#3f7478',
      '--accent-light': '#5d9aa0',
      '--accent-dark': '#2d565a',
      '--border': '#bed1cd',
      '--shadow': 'rgba(45, 86, 90, 0.13)',
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
