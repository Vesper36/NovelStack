import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'NovelStack',
  description: '为创作者而生的叙事平台 - 官方文档',
  lang: 'zh-CN',
  base: '/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'NovelStack Docs',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/what-is-novelstack' },
      { text: 'API', link: '/api/' },
      { text: '部署', link: '/deployment/' },
      { text: 'Demo', link: 'https://novelstack.demo.vesper36.cc' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '什么是 NovelStack', link: '/guide/what-is-novelstack' },
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
            { text: 'Docker 部署', link: '/deployment/docker' },
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
      copyright: 'Copyright 2026 NovelStack',
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
  },
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
  },
});
