'use client';

import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorState, type Extension } from '@codemirror/state';
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  lineNumbers,
} from '@codemirror/view';

type MdxEditorProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  minHeight?: number;
  ariaLabel?: string;
};

const editorTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '14px',
    height: '100%',
    minHeight: 'var(--mdx-editor-min-height)',
  },
  '.cm-scroller': {
    fontFamily: 'var(--font-mono)',
    lineHeight: '1.65',
    minHeight: 'var(--mdx-editor-min-height)',
  },
  '.cm-content': {
    caretColor: 'var(--accent)',
    padding: '16px 0',
  },
  '.cm-line': {
    padding: '0 16px',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    color: 'var(--text-tertiary)',
  },
  '.cm-activeLine': {
    backgroundColor: 'color-mix(in srgb, var(--accent) 8%, transparent)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'color-mix(in srgb, var(--accent) 10%, var(--bg-secondary))',
    color: 'var(--accent)',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: 'var(--accent)',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
    backgroundColor: 'color-mix(in srgb, var(--accent) 22%, transparent)',
  },
});

export function MdxEditor({
  id,
  value,
  onChange,
  onBlur,
  minHeight = 560,
  ariaLabel = 'MDX 源码编辑器',
}: MdxEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onBlurRef = useRef(onBlur);
  const valueRef = useRef(value);
  const syncingExternalValueRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onBlurRef.current = onBlur;
  }, [onBlur]);

  const extensions = useMemo<Extension[]>(
    () => [
      lineNumbers(),
      highlightActiveLineGutter(),
      drawSelection(),
      dropCursor(),
      highlightActiveLine(),
      EditorView.lineWrapping,
      EditorState.tabSize.of(2),
      markdown({ codeLanguages: languages }),
      EditorView.contentAttributes.of({
        'aria-label': ariaLabel,
        spellcheck: 'false',
      }),
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) {
          return;
        }

        const nextValue = update.state.doc.toString();
        valueRef.current = nextValue;
        if (syncingExternalValueRef.current) {
          return;
        }

        onChangeRef.current(nextValue);
      }),
      EditorView.domEventHandlers({
        blur: () => {
          onBlurRef.current?.();
        },
      }),
      editorTheme,
    ],
    [ariaLabel]
  );

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const view = new EditorView({
      parent: containerRef.current,
      state: EditorState.create({
        doc: valueRef.current,
        extensions,
      }),
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [extensions]);

  useEffect(() => {
    valueRef.current = value;

    const view = viewRef.current;
    if (!view) {
      return;
    }

    const currentValue = view.state.doc.toString();
    if (currentValue === value) {
      return;
    }

    syncingExternalValueRef.current = true;
    try {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: value,
        },
      });
    } finally {
      syncingExternalValueRef.current = false;
    }
  }, [value]);

  const editorStyle = {
    minHeight,
    '--mdx-editor-min-height': `${minHeight}px`,
  } as CSSProperties;

  return (
    <div
      id={id}
      ref={containerRef}
      className="overflow-hidden bg-transparent"
      style={editorStyle}
    />
  );
}
