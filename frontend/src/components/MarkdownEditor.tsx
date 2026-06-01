import { useEffect, useRef, useCallback, useState } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const pasteCaptureRef = useRef<HTMLTextAreaElement>(null);
  const [pasted, setPasted] = useState(false);

  const updateLineNumbers = useCallback(() => {
    if (!textareaRef.current || !lineNumbersRef.current) return;
    const lines = textareaRef.current.value.split('\n');
    lineNumbersRef.current.innerHTML = lines
      .map((_, i) => `<span class="block text-gray-400 text-xs leading-6 pr-3 text-right select-none">${i + 1}</span>`)
      .join('');
    const max = String(lines.length);
    lineNumbersRef.current.style.minWidth = `${Math.max(4, max.length + 2)}ch`;
  }, []);

  useEffect(() => {
    updateLineNumbers();
  }, [value, updateLineNumbers]);

  useEffect(() => {
    if (pasted) {
      const timer = setTimeout(() => setPasted(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [pasted]);

  useEffect(() => {
    const el = pasteCaptureRef.current;
    if (!el) return;
    const handler = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain');
      if (text) {
        onChange(text);
        setPasted(true);
      }
      textareaRef.current?.focus();
    };
    el.addEventListener('paste', handler);
    return () => el.removeEventListener('paste', handler);
  }, [onChange]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handlePaste = useCallback(() => {
    const ta = textareaRef.current;
    const capture = pasteCaptureRef.current;
    if (!ta || !capture) return;

    navigator.clipboard.readText()
      .then((text) => {
        if (text) {
          onChange(text);
          setPasted(true);
        }
        ta.focus();
      })
      .catch(() => {
        capture.value = '';
        capture.focus();
      });
  }, [onChange]);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;
  const lineCount = value ? value.split('\n').length : 1;

  return (
    <div className="flex flex-col min-h-0 h-full font-sans">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200/80 bg-white/50 backdrop-blur-sm shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Editor</span>
          <button
            onClick={handlePaste}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
              pasted
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 active:scale-95'
            }`}
            aria-label="Paste from clipboard"
            title="Paste from clipboard"
          >
            {pasted ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            )}
            {pasted ? 'Pasted!' : 'Paste'}
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 shrink-0">
          <span>{lineCount} lines</span>
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
        </div>
      </div>
      <div className="flex flex-1 min-h-0 overflow-hidden relative bg-white">
        <div
          ref={lineNumbersRef}
          className="bg-slate-50/50 border-r border-slate-200/80 py-3 overflow-hidden text-right select-none"
          aria-hidden="true"
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="flex-1 p-3 font-mono text-sm leading-6 text-slate-800 bg-transparent resize-none focus:outline-none scrollbar-thin"
          placeholder="Type or paste your Markdown here..."
          spellCheck={false}
          aria-label="Markdown editor"
          style={{ tabSize: 2 }}
        />
      </div>
      <textarea
        ref={pasteCaptureRef}
        aria-hidden="true"
        tabIndex={-1}
        className="fixed w-px h-px p-0 -m-px border-0"
        style={{ clip: 'rect(0,0,0,0)', overflow: 'hidden' }}
        readOnly
      />
    </div>
  );
}
