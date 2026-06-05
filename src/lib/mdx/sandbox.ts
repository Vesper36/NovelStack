import DOMPurify from 'dompurify';
import type { Config as DOMPurifyConfig } from 'dompurify';

// ========== 沙箱配置 ==========
const SANDBOX_CSP_POLICY = [
  "default-src 'none'",
  "style-src 'unsafe-inline'",
  "img-src data: https:",
  "font-src data: https:",
  // 禁止 script（除非显式启用 jsContent）
  "script-src 'none'",
  // 禁止表单提交
  "form-action 'none'",
  // 禁止连接
  "connect-src 'none'",
  // 禁止插件
  "plugin-types 'none'",
].join('; ');

const SANDBOX_CSP_POLICY_WITH_JS = [
  "default-src 'none'",
  "style-src 'unsafe-inline'",
  "img-src data: https:",
  "font-src data: https:",
  // 允许内联脚本（已在 try-catch 中沙箱化）
  "script-src 'unsafe-inline'",
  "form-action 'none'",
  "connect-src 'none'",
  "plugin-types 'none'",
].join('; ');

// ========== 危险 API 拦截代码 ==========
// 在用户 JS 执行前注入，拦截并禁止危险操作
const DANGEROUS_API_GUARD = `
  (function() {
    'use strict';

    // 禁止 eval
    window.eval = function() {
      throw new Error('[Sandbox] eval() is not allowed');
    };

    // 禁止 document.cookie 读写
    try {
      Object.defineProperty(document, 'cookie', {
        get: function() { throw new Error('[Sandbox] document.cookie read is not allowed'); },
        set: function() { throw new Error('[Sandbox] document.cookie write is not allowed'); },
        configurable: false,
      });
    } catch(e) { /* 部分浏览器可能不支持 */ }

    // 禁止跨域 fetch
    var originalFetch = window.fetch;
    if (originalFetch) {
      window.fetch = function(url, options) {
        throw new Error('[Sandbox] fetch() is not allowed in sandboxed content');
      };
    }

    // 禁止 XMLHttpRequest
    window.XMLHttpRequest = function() {
      throw new Error('[Sandbox] XMLHttpRequest is not allowed in sandboxed content');
    };

    // 禁止 WebSocket
    window.WebSocket = function() {
      throw new Error('[Sandbox] WebSocket is not allowed in sandboxed content');
    };

    // 禁止 navigator.sendBeacon
    if (navigator.sendBeacon) {
      navigator.sendBeacon = function() {
        throw new Error('[Sandbox] navigator.sendBeacon is not allowed in sandboxed content');
      };
    }

    // 禁止 window.open
    window.open = function() {
      throw new Error('[Sandbox] window.open is not allowed in sandboxed content');
    };

    // 禁止 Function 构造器
    window.Function = function() {
      throw new Error('[Sandbox] Function constructor is not allowed in sandboxed content');
    };

    // 禁止动态 script 注入
    var origCreateElement = document.createElement.bind(document);
    document.createElement = function(tag) {
      if (tag.toLowerCase() === 'script') {
        throw new Error('[Sandbox] Dynamic script creation is not allowed');
      }
      return origCreateElement(tag);
    };
  })();
`;

// ========== HTML 净化选项 ==========
const PURIFY_CONFIG: DOMPurifyConfig = {
  ALLOWED_TAGS: [
    // 文本内容
    'p', 'br', 'hr', 'span', 'div', 'pre', 'code',
    'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup',
    'abbr', 'cite', 'q', 'blockquote',
    // 标题
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // 列表
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    // 链接和媒体
    'a', 'img', 'figure', 'figcaption', 'picture', 'source',
    // 表格
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
    // 语义元素
    'article', 'section', 'nav', 'aside', 'header', 'footer', 'main', 'address', 'time',
    // 代码高亮
    'ruby', 'rt', 'rp',
  ],
  ALLOWED_ATTR: [
    'class', 'id', 'title', 'lang', 'dir', 'role', 'aria-label', 'aria-hidden',
    'tabindex', 'hidden', 'draggable',
    'href', 'target', 'rel',
    'src', 'alt', 'width', 'height', 'loading', 'decoding',
    'colspan', 'rowspan', 'headers', 'scope',
    'type', 'value', 'name', 'placeholder', 'disabled', 'readonly', 'checked',
    'datetime', 'cite',
    'data-*',
  ],
  ALLOW_DATA_ATTR: true,
  // 禁止 javascript: 协议
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\\-]+(?:[^a-z+.\-:]|$))/i,
  // 移除 script 和 style 内容（由沙箱单独处理）
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'noscript'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
};

// ========== createSandboxHtml ==========
export interface SandboxOptions {
  /** 净化后的 HTML 内容 */
  htmlContent: string;
  /** 可选的自定义 CSS（会被包裹在 style 标签中） */
  cssContent?: string;
  /** 可选的自定义 JS（会被包裹在 try-catch 中，受危险 API 拦截保护） */
  jsContent?: string;
  /** iframe 宽度 */
  width?: string;
  /** iframe 高度 */
  height?: string;
  /** 是否自动调整高度 */
  autoResize?: boolean;
}

/**
 * 生成带 CSP 头的 iframe sandbox HTML 字符串。
 * 所有用户自定义 JS 被包裹在 try-catch 中，禁止 eval、document.cookie、跨域 fetch。
 * 使用 DOMPurify 进行 HTML 净化。
 */
export function createSandboxHtml(
  htmlContent: string,
  cssContent?: string,
  jsContent?: string,
): string {
  // 1. 净化 HTML 内容
  const sanitizedHtml = DOMPurify.sanitize(htmlContent, PURIFY_CONFIG);

  // 2. 净化 CSS（移除可能的 expression/url(javascript:) 等）
  const sanitizedCss = cssContent
    ? sanitizeCss(cssContent)
    : '';

  // 3. 包裹用户 JS 在 try-catch 中
  const wrappedJs = jsContent
    ? `\n${DANGEROUS_API_GUARD}\ntry {\n${jsContent}\n} catch(e) {\n  console.error('[Sandbox Error]', e.message);\n  document.body.innerHTML += '<div style="color:red;padding:8px;font-size:12px;">Error: ' + e.message + '</div>';\n}\n`
    : '';

  // 4. 确定 CSP 策略
  const cspPolicy = jsContent ? SANDBOX_CSP_POLICY_WITH_JS : SANDBOX_CSP_POLICY;

  // 5. 构建 sandbox HTML 文档
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="${cspPolicy}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1a1a1a;
      background: #fff;
      padding: 16px;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    @media (prefers-color-scheme: dark) {
      body {
        color: #e5e5e5;
        background: #1a1a1a;
      }
    }
    img { max-width: 100%; height: auto; }
    a { color: #2563eb; }
    code, pre { font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; font-size: 0.9em; }
    pre { overflow-x: auto; padding: 12px; background: #f5f5f5; border-radius: 4px; }
    @media (prefers-color-scheme: dark) {
      pre { background: #2d2d2d; }
    }
    ${sanitizedCss}
  </style>
</head>
<body>
${sanitizedHtml}
${wrappedJs ? `<script>${wrappedJs}</script>` : ''}
</body>
</html>`;
}

/**
 * 使用 SandboxOptions 创建沙箱 HTML（重载版本，支持更多选项）
 */
export function createSandboxHtmlWithOptions(options: SandboxOptions): string {
  const { htmlContent, cssContent, jsContent, autoResize = true } = options;
  const baseHtml = createSandboxHtml(htmlContent, cssContent, jsContent);

  if (!autoResize) return baseHtml;

  // 在 body 末尾添加高度通信脚本
  const resizeScript = `
<script>
try {
  var resizeObserver = new ResizeObserver(function(entries) {
    var height = document.documentElement.scrollHeight;
    window.parent.postMessage({ type: 'sandbox-resize', height: height }, '*');
  });
  resizeObserver.observe(document.body);
  // 初始高度报告
  window.parent.postMessage({ type: 'sandbox-resize', height: document.documentElement.scrollHeight }, '*');
} catch(e) {}
</script>`;

  return baseHtml.replace('</body>', `${resizeScript}\n</body>`);
}

// ========== CSS 净化 ==========
function sanitizeCss(css: string): string {
  // 移除危险的 CSS 模式
  return css
    // 移除 @import
    .replace(/@import\s+[^;]+;/gi, '/* removed @import */')
    // 移除 url() 中的 javascript: 协议
    .replace(/url\s*\(\s*['"]?\s*javascript\s*:/gi, 'url(about:blank')
    // 移除 expression()
    .replace(/expression\s*\([^)]*\)/gi, '/* removed expression */')
    // 移除 -moz-binding
    .replace(/-moz-binding\s*:[^;]+;/gi, '/* removed -moz-binding */')
    // 移除 behavior (IE)
    .replace(/behavior\s*:[^;]+;/gi, '/* removed behavior */');
}

// ========== iframe sandbox 属性 ==========
/**
 * 获取推荐的 iframe sandbox 属性字符串
 * 用于 <iframe sandbox={getSandboxAttributes()}>
 */
export function getSandboxAttributes(): string {
  return [
    'allow-same-origin',
    'allow-popups',
    'allow-popups-to-escape-sandbox',
  ].join(' ');
}
