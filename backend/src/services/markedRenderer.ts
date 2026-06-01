import { marked } from 'marked';

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

renderer.code = ({ text, lang }) => {
  const escaped = escapeHTML(text);
  if (lang) {
    return `<pre><code class="language-${escapeHTML(lang)}">${escaped}</code></pre>`;
  }
  return `<pre><code>${escaped}</code></pre>`;
};

renderer.image = ({ href, title, text }) => {
  const src = href ? escapeHTML(href) : '';
  const alt = text ? escapeHTML(text) : '';
  const titleAttr = title ? ` title="${escapeHTML(title)}"` : '';
  return `<img src="${src}" alt="${alt}"${titleAttr} />`;
};

renderer.link = ({ href, title, text }) => {
  const url = href ? escapeHTML(href) : '';
  const titleAttr = title ? ` title="${escapeHTML(title)}"` : '';
  return `<a href="${url}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

function sanitizeHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'href="#"')
    .replace(/src\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'src="#"');
}

export function renderMarkdown(input: string): string {
  const tokens = marked.lexer(input);
  const html = marked.parser(tokens, { renderer });
  return sanitizeHTML(html);
}
