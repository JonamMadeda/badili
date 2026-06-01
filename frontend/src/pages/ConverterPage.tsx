import { useState, useCallback, useEffect, useRef } from 'react';
import Header from '../components/Header';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownPreview from '../components/MarkdownPreview';
import PDFOptionsPanel from '../components/PDFOptions';
import ToastContainer, { type ToastData } from '../components/Toast';
import { convertToPDF, downloadPDF, printPDF, trackEvent, type PDFOptions } from '../lib/api';

const DEFAULT_MARKDOWN = `# Welcome to Badili

Convert your Markdown to PDF in seconds.

## Features

- **Live Preview** - See changes as you type
- *Fast Conversion* - PDFs in seconds
- ~~Strikethrough~~ support
- Professional formatting

## Code Blocks

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet("Badili");
\`\`\`

## Tables

| Feature | Status |
|---------|--------|
| Headings | ✅ |
| Lists | ✅ |
| Tables | ✅ |
| Code | ✅ |

## Blockquotes

> Badili means "change" or "convert" in Swahili.

## Links

[Visit Badili](https://badili.app)

---

Start editing to see the live preview!
`;

const DEFAULT_OPTIONS: PDFOptions = {
  pageSize: 'A4',
  orientation: 'portrait',
  margins: 'medium',
  theme: 'light',
  fontSize: 'medium',
};

interface ConverterPageProps {
  onHome: () => void;
}

export default function ConverterPage({ onHome }: ConverterPageProps) {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [options, setOptions] = useState<PDFOptions>(DEFAULT_OPTIONS);
  const [isConverting, setIsConverting] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  const addToast = useCallback((type: ToastData['type'], message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleConvert = useCallback(async () => {
    if (!markdown.trim()) {
      addToast('error', 'Please enter markdown before converting.');
      return;
    }

    setIsConverting(true);
    try {
      trackEvent('convert_started', { size: markdown.length });
      const blob = await convertToPDF(markdown, options);
      downloadPDF(blob);
      trackEvent('convert_completed', { size: markdown.length });
      addToast('success', 'PDF generated and downloaded successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to generate PDF. Please try again.';
      addToast('error', message);
      trackEvent('convert_error', { error: message });
    } finally {
      setIsConverting(false);
    }
  }, [markdown, options, addToast]);

  const handlePrint = useCallback(async () => {
    if (!markdown.trim()) {
      addToast('error', 'Please enter markdown before converting.');
      return;
    }

    setIsConverting(true);
    try {
      const blob = await convertToPDF(markdown, options);
      printPDF(blob);
      addToast('success', 'PDF opened for printing.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to generate PDF. Please try again.';
      addToast('error', message);
    } finally {
      setIsConverting(false);
    }
  }, [markdown, options, addToast]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleConvert();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleConvert]);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden font-sans">
      <Header onHome={onHome} />

      <main className="flex-1 flex flex-col min-h-0">
        <div className="border-b border-slate-200/80 bg-white shadow-sm shrink-0 relative z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
            <PDFOptionsPanel
              options={options}
              onChange={setOptions}
              disabled={isConverting}
            />
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleConvert}
                disabled={isConverting || !markdown.trim()}
                className="btn-primary whitespace-nowrap"
              >
                {isConverting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Converting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Convert to PDF
                  </>
                )}
              </button>
              <button
                onClick={handlePrint}
                disabled={isConverting || !markdown.trim()}
                className="btn-secondary whitespace-nowrap"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-0" ref={previewRef}>
          <div className="flex-1 flex flex-col border-r border-border min-h-0 overflow-hidden">
            <MarkdownEditor value={markdown} onChange={setMarkdown} />
          </div>
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
            <MarkdownPreview content={markdown} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200/80 shrink-0 z-10 relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Badili. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 hidden sm:block">
            Built with care for Markdown lovers.
          </p>
        </div>
      </footer>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
