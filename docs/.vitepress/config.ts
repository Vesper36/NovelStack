import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'InkWeave',
  description: '为创作者而生的叙事平台 - 官方文档',
  lang: 'zh-CN',
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#6366f1' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'InkWeave - 墨织' }],
    ['meta', { property: 'og:description', content: '为创作者而生的叙事平台' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'InkWeave Docs',
    nav: [
      { text: '首页', link: '/' },
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '项目结构', link: '/guide/project-structure' },
          { text: '开发指南', link: '/guide/development' },
        ],
      },
      {
        text: '功能',
        items: [
          { text: '作品管理', link: '/guide/works' },
          { text: '章节编辑器', link: '/guide/editor' },
          { text: '阅读器', link: '/guide/reader' },
          { text: '主题系统', link: '/guide/themes' },
          { text: '用户认证', link: '/guide/auth' },
          { text: '搜索', link: '/guide/search' },
        ],
      },
      { text: 'API', link: '/api/' },
      { text: '部署', link: '/deployment/' },
      {
        text: '链接',
        items: [
          { text: 'Demo 演示', link: 'https://novelstack.demo.vesper36.cc' },
          { text: 'GitHub', link: 'https://github.com/Vesper36/NovelStack' },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '什么是 InkWeave', link: '/guide/what-is-novelstack' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '项目结构', link: '/guide/project-structure' },
          ],
        },
        {
          text: '核心功能',
          items: [
            { text: '作品管理', link: '/guide/works' },
            { text: '章节编辑器', link: '/guide/editor' },
            { text: '阅读器', link: '/guide/reader' },
            { text: '主题系统', link: '/guide/themes' },
            { text: '用户认证', link: '/guide/auth' },
            { text: '搜索', link: '/guide/search' },
          ],
        },
        {
          text: '开发',
          items: [
            { text: '开发指南', link: '/guide/development' },
            { text: '代码规范', link: '/guide/code-style' },
            { text: '贡献指南', link: '/guide/contributing' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '概览', link: '/api/' },
            { text: '认证', link: '/api/auth' },
            { text: '作品', link: '/api/works' },
            { text: '章节', link: '/api/chapters' },
            { text: '搜索', link: '/api/search' },
            { text: '标签', link: '/api/tags' },
          ],
        },
      ],
      '/deployment/': [
        {
          text: '部署指南',
          items: [
            { text: '部署概览', link: '/deployment/' },
            { text: 'VPS 部署', link: '/deployment/vps' },
            { text: 'Nginx 配置', link: '/deployment/nginx' },
            { text: 'SSL 证书', link: '/deployment/ssl' },
            { text: 'CI/CD', link: '/deployment/ci-cd' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Vesper36/NovelStack' },
    ],
    footer: {
      message: '基于 MIT 许可证发布',
      copyright: 'Copyright 2026 InkWeave',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
    outline: {
      label: '页面导航',
      level: [2, 3],
    },
    lastUpdated: {
      text: '最后更新于',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    editLink: {
      pattern: 'https://github.com/Vesper36/NovelStack/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
  },
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
  },
});
