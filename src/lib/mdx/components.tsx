'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// ========== Callout 组件 ==========
export type CalloutVariant = 'info' | 'warning' | 'danger' | 'tip' | 'note';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CalloutVariant;
  title?: string;
}

const calloutVariantStyles: Record<CalloutVariant, string> = {
  info: 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/30',
  warning: 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30',
  danger: 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30',
  tip: 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30',
  note: 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/30',
};

const calloutIconMap: Record<CalloutVariant, string> = {
  info: 'i',
  warning: '!',
  danger: 'x',
  tip: '*',
  note: 'n',
};

export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ variant = 'info', title, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="note"
        className={cn(
          'my-6 rounded-r border-l-4 p-4',
          calloutVariantStyles[variant],
          className,
        )}
        {...props}
      >
        {(title || variant) && (
          <div className="mb-1 flex items-center gap-2 font-semibold">
            <span
              className={cn(
                'inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold uppercase',
                variant === 'info' && 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
                variant === 'warning' && 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200',
                variant === 'danger' && 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200',
                variant === 'tip' && 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200',
                variant === 'note' && 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
              )}
            >
              {calloutIconMap[variant]}
            </span>
            {title && <span>{title}</span>}
          </div>
        )}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    );
  },
);
Callout.displayName = 'Callout';

// ========== Spoiler 组件 ==========
export interface SpoilerProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
}

export const Spoiler = React.forwardRef<HTMLSpanElement, SpoilerProps>(
  ({ label = '点击查看', children, className, ...props }, ref) => {
    const [revealed, setRevealed] = React.useState(false);

    return (
      <span
        ref={ref}
        role="button"
        tabIndex={0}
        aria-expanded={revealed}
        onClick={() => setRevealed((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setRevealed((v) => !v);
          }
        }}
        className={cn(
          'cursor-pointer select-none rounded px-1 transition-colors',
          revealed
            ? 'bg-transparent'
            : 'bg-gray-800 text-gray-800 hover:bg-gray-700 hover:text-gray-700 dark:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-300 dark:hover:text-gray-300',
          className,
        )}
        title={revealed ? undefined : label}
        {...props}
      >
        {children}
      </span>
    );
  },
);
Spoiler.displayName = 'Spoiler';

// ========== ImageFigure 组件 ==========
export interface ImageFigureProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  alt?: string;
  caption?: string;
  width?: number | string;
  height?: number | string;
}

export const ImageFigure = React.forwardRef<HTMLElement, ImageFigureProps>(
  ({ src, alt = '', caption, width, height, className, ...props }, ref) => {
    return (
      <figure
        ref={ref}
        className={cn('my-6 flex flex-col items-center', className)}
        {...props}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          className="max-w-full rounded-md shadow-sm"
        />
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
);
ImageFigure.displayName = 'ImageFigure';

// ========== CodeBlock 组件 ==========
export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  ({ language, filename, showLineNumbers = false, children, className, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = React.useCallback(() => {
      const text = typeof children === 'string' ? children : '';
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }, [children]);

    return (
      <div className="group relative my-4">
        {filename && (
          <div className="rounded-t-md border-b border-gray-200 bg-gray-100 px-4 py-1.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            {filename}
          </div>
        )}
        <pre
          ref={ref}
          className={cn(
            'overflow-x-auto rounded-md bg-gray-900 p-4 text-sm leading-relaxed dark:bg-gray-950',
            filename && 'rounded-t-none',
            showLineNumbers && 'pl-12',
            className,
          )}
          {...props}
        >
          {language && (
            <span className="absolute right-2 top-2 select-none text-xs text-gray-500">
              {language}
            </span>
          )}
          <code className={language ? `language-${language}` : undefined}>
            {children}
          </code>
        </pre>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? '已复制' : '复制代码'}
          className={cn(
            'absolute rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 opacity-0 transition-opacity hover:bg-gray-600 group-hover:opacity-100',
            language ? 'right-14 top-2' : 'right-2 top-2',
          )}
        >
          {copied ? '已复制' : '复制'}
        </button>
      </div>
    );
  },
);
CodeBlock.displayName = 'CodeBlock';

// ========== ChapterBreak 组件 ==========
export interface ChapterBreakProps extends React.HTMLAttributes<HTMLDivElement> {
  symbol?: string;
}

export const ChapterBreak = React.forwardRef<HTMLDivElement, ChapterBreakProps>(
  ({ symbol = '*', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        className={cn(
          'my-12 flex items-center justify-center gap-4 text-gray-400 dark:text-gray-600',
          className,
        )}
        {...props}
      >
        <span className="h-px flex-1 bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
        <span className="select-none text-lg tracking-[0.5em]">{symbol}</span>
        <span className="h-px flex-1 bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
      </div>
    );
  },
);
ChapterBreak.displayName = 'ChapterBreak';

// ========== MDX 组件映射 ==========
export const mdxComponents = {
  // 自定义组件
  Callout,
  Spoiler,
  ImageFigure,
  CodeBlock,
  ChapterBreak,

  // 覆盖默认 HTML 元素，增强样式
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="mb-4 mt-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    >
      {children}
    </h1>
  ),

  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mb-3 mt-7 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100"
      {...props}
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mb-2 mt-6 text-xl font-semibold text-gray-800 dark:text-gray-200"
      {...props}
    >
      {children}
    </h3>
  ),

  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="mb-2 mt-5 text-lg font-medium text-gray-800 dark:text-gray-200"
      {...props}
    >
      {children}
    </h4>
  ),

  a: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-blue-600 underline decoration-blue-300 underline-offset-2 transition-colors hover:text-blue-800 dark:text-blue-400 dark:decoration-blue-700 dark:hover:text-blue-300"
      {...props}
    >
      {children}
    </a>
  ),

  blockquote: ({ children, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-4 border-l-4 border-gray-300 pl-4 italic text-gray-700 dark:border-gray-600 dark:text-gray-300"
      {...props}
    >
      {children}
    </blockquote>
  ),

  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <figure className="my-6 flex flex-col items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ''}
        loading="lazy"
        className="max-w-full rounded-md shadow-sm"
        {...props}
      />
      {alt && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 overflow-x-auto">
      <table
        className="w-full border-collapse text-sm"
        {...props}
      >
        {children}
      </table>
    </div>
  ),

  th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border-b-2 border-gray-200 bg-gray-50 px-4 py-2 text-left font-semibold dark:border-gray-700 dark:bg-gray-800"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border-b border-gray-100 px-4 py-2 dark:border-gray-800"
      {...props}
    >
      {children}
    </td>
  ),
} as const;

export type MdxComponents = typeof mdxComponents;
