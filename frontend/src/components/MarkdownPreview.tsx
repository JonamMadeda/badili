import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useMemo } from 'react';

interface MarkdownPreviewProps {
  content: string;
}

function CodeBlock({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  const isInline = !className;
  if (isInline) {
    return (
      <code className="bg-gray-100 text-foreground px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  }
  return (
    <pre className="bg-gray-50 border border-border rounded-xl p-4 overflow-x-auto my-4">
      <code className={`${className || ''} text-sm font-mono leading-relaxed`} {...props}>
        {children}
      </code>
    </pre>
  );
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const rendered = useMemo(() => {
    if (!content || !content.trim()) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <p className="text-sm">Preview will appear here</p>
          </div>
        </div>
      );
    }
    return (
      <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-foreground prose-a:text-primary-600 prose-code:text-foreground prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-50 prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-img:rounded-xl prose-blockquote:border-primary-600 prose-blockquote:bg-gray-50 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-4 prose-hr:border-border">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }, [content]);

  return (
    <div className="flex flex-col min-h-0 h-full font-sans bg-slate-50/30">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200/80 bg-white/50 backdrop-blur-sm shrink-0 z-10">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preview</span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-8 scrollbar-thin bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
        {rendered}
      </div>
    </div>
  );
}
