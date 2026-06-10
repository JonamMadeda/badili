let _marked: any;
let _renderer: any;

async function init() {
  if (_marked) return;
  const { marked } = await import('marked');
  _marked = marked;

  marked.use({
    breaks: true,
    gfm: true,
  });

  function escapeHTML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const renderer = new marked.Renderer();
  _renderer = renderer;

  renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
    const escaped = escapeHTML(text);
    if (lang) {
      return `<pre><code class="language-${escapeHTML(lang)}">${escaped}</code></pre>`;
    }
    return `<pre><code>${escaped}</code></pre>`;
  };

  renderer.image = ({ href, title, text }: { href?: string; title?: string; text?: string }) => {
    const src = href ? escapeHTML(href) : '';
    const alt = text ? escapeHTML(text) : '';
    const titleAttr = title ? ` title="${escapeHTML(title)}"` : '';
    return `<img src="${src}" alt="${alt}"${titleAttr} />`;
  };

  renderer.link = ({ href, title, text }: { href?: string; title?: string; text?: string }) => {
    const url = href ? escapeHTML(href) : '';
    const titleAttr = title ? ` title="${escapeHTML(title)}"` : '';
    return `<a href="${url}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
  };
}

function sanitizeHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'href="#"')
    .replace(/src\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'src="#"');
}

export async function renderMarkdown(input: string): Promise<string> {
  await init();
  const tokens = _marked.lexer(input);
  const html = _marked.parser(tokens, { renderer: _renderer });
  return sanitizeHTML(html);
}
