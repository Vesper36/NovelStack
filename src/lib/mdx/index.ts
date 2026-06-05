import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { toHtml } from 'hast-util-to-html';
import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { TocItem, MdxMeta } from '@/lib/types';

// ========== rehype 插件：提取 headings ==========
function rehypeExtractToc(toc: TocItem[]) {
  return (tree: import('hast').Root) => {
    visit(tree, 'element', (node) => {
      const match = /^h([1-6])$/.exec(node.tagName);
      if (!match) return;

      const id = node.properties?.id;
      if (typeof id !== 'string') return;

      const level = parseInt(match[1], 10);
      const title = toString(node);

      toc.push({ id, title, level });
    });
  };
}

// ========== 将扁平 toc 列表嵌套为树结构 ==========
function buildTocTree(items: TocItem[]): TocItem[] {
  const root: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const item of items) {
    const node: TocItem = { ...item, children: [] };

    // 找到正确的父节点：栈中最后一个 level 小于当前节点的
    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    }

    stack.push(node);
  }

  return root;
}

// ========== compileMdx：解析 frontmatter + 编译 HTML + 提取 TOC ==========
export interface CompileMdxResult {
  content: string;
  frontmatter: MdxMeta;
  toc: TocItem[];
}

export async function compileMdx(source: string): Promise<CompileMdxResult> {
  const { content, data } = matter(source);

  const toc: TocItem[] = [];

  // 先解析为 mdast，再通过 remark-rehype 转换为 hast，最后序列化为 HTML
  const parser = unified().use(remarkParse);
  const mdastTree = parser.parse(content);

  const processor = unified()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['heading-anchor'],
      },
    })
    .use(rehypeExtractToc, toc);

  const hastTree = await processor.run(mdastTree);

  const html = toHtml(hastTree as Parameters<typeof toHtml>[0], {
    allowDangerousHtml: true,
  });

  return {
    content: html,
    frontmatter: data as MdxMeta,
    toc: buildTocTree(toc),
  };
}

// ========== renderMdx：使用 next-mdx-remote 序列化 ==========
export async function renderMdx(
  source: string,
): Promise<MDXRemoteSerializeResult<Record<string, unknown>, MdxMeta>> {
  return serialize<Record<string, unknown>, MdxMeta>(source, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeHighlight,
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['heading-anchor'],
            },
          },
        ],
      ],
    },
  });
}
