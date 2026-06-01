import puppeteer, { Browser } from 'puppeteer';
import { renderMarkdown } from './markedRenderer';
import { PDFOptions } from '../types';

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
  }
  return browser;
}

export async function shutdownBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

function getThemeStyles(theme: string, fontSize: string): string {
  const themes: Record<string, string> = {
    light: `
      --bg: #FFFFFF;
      --text: #0F172A;
      --heading: #0F172A;
      --code-bg: #F1F5F9;
      --code-text: #0F172A;
      --border: #E2E8F0;
      --blockquote-bg: #F8FAFC;
      --blockquote-border: #2563EB;
      --table-border: #E2E8F0;
      --table-header-bg: #F8FAFC;
      --link: #2563EB;
      --hr: #E2E8F0;
    `,
    dark: `
      --bg: #1E293B;
      --text: #E2E8F0;
      --heading: #F8FAFC;
      --code-bg: #0F172A;
      --code-text: #E2E8F0;
      --border: #334155;
      --blockquote-bg: #0F172A;
      --blockquote-border: #3B82F6;
      --table-border: #334155;
      --table-header-bg: #0F172A;
      --link: #60A5FA;
      --hr: #334155;
    `,
    professional: `
      --bg: #FFFFFF;
      --text: #1E293B;
      --heading: #0F172A;
      --code-bg: #F8FAFC;
      --code-text: #1E293B;
      --border: #CBD5E1;
      --blockquote-bg: #F1F5F9;
      --blockquote-border: #1E40AF;
      --table-border: #CBD5E1;
      --table-header-bg: #F8FAFC;
      --link: #1E40AF;
      --hr: #CBD5E1;
    `,
  };

  return themes[theme] || themes.light;
}

function wrapHTML(bodyHTML: string, options: PDFOptions): string {
  const themeStyles = getThemeStyles(options.theme, options.fontSize);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  :root {
    ${themeStyles}
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: ${options.fontSize};
    line-height: 1.7;
    color: var(--text);
    background: var(--bg);
    padding: 0;
    max-width: 100%;
  }
  h1 { font-size: 2em; color: var(--heading); margin: 1em 0 0.5em; font-weight: 700; line-height: 1.3; }
  h2 { font-size: 1.5em; color: var(--heading); margin: 1em 0 0.5em; font-weight: 600; line-height: 1.3; }
  h3 { font-size: 1.25em; color: var(--heading); margin: 1em 0 0.5em; font-weight: 600; }
  h4 { font-size: 1em; color: var(--heading); margin: 1em 0 0.5em; font-weight: 600; }
  p { margin: 0.5em 0; }
  ul, ol { margin: 0.5em 0; padding-left: 2em; }
  li { margin: 0.25em 0; }
  code {
    background: var(--code-bg);
    color: var(--code-text);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 0.875em;
  }
  pre {
    background: var(--code-bg);
    color: var(--code-text);
    padding: 1em;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1em 0;
    border: 1px solid var(--border);
  }
  pre code {
    background: none;
    padding: 0;
    border-radius: 0;
    font-size: 0.875em;
  }
  blockquote {
    margin: 1em 0;
    padding: 0.75em 1em;
    border-left: 4px solid var(--blockquote-border);
    background: var(--blockquote-bg);
    border-radius: 0 8px 8px 0;
    color: var(--text);
  }
  blockquote p { margin: 0.25em 0; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
  }
  th, td {
    border: 1px solid var(--table-border);
    padding: 0.5em 0.75em;
    text-align: left;
  }
  th {
    background: var(--table-header-bg);
    font-weight: 600;
  }
  tr:nth-child(even) {
    background: var(--table-header-bg);
  }
  a {
    color: var(--link);
    text-decoration: underline;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1em 0;
  }
  hr {
    border: none;
    border-top: 2px solid var(--hr);
    margin: 2em 0;
  }
  strong { font-weight: 700; }
  em { font-style: italic; }
  del { text-decoration: line-through; }
  @page {
    margin: ${options.margins};
    size: ${options.pageSize} ${options.orientation};
  }
</style>
</head>
<body>
${bodyHTML}
</body>
</html>`;
}

export async function generatePDF(markdown: string, options: PDFOptions): Promise<Buffer> {
  const page = await (await getBrowser()).newPage();
  try {
    const html = renderMarkdown(markdown);
    const wrappedHTML = wrapHTML(html, options);

    await page.setContent(wrappedHTML, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    const buffer = await page.pdf({
      format: options.pageSize,
      landscape: options.orientation === 'landscape',
      margin: {
        top: options.margins,
        bottom: options.margins,
        left: options.margins,
        right: options.margins,
      },
      printBackground: true,
      preferCSSPageSize: true,
    });

    return Buffer.from(buffer);
  } finally {
    await page.close();
  }
}
