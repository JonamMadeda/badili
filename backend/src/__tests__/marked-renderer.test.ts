import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../services/markedRenderer.js';

describe('markedRenderer', () => {
  it('should render headings', async () => {
    const html = await renderMarkdown('# Heading 1\n## Heading 2\n### Heading 3');
    expect(html).toContain('<h1');
    expect(html).toContain('Heading 1');
    expect(html).toContain('<h2');
    expect(html).toContain('Heading 2');
    expect(html).toContain('<h3');
    expect(html).toContain('Heading 3');
  });

  it('should render bold text', async () => {
    const html = await renderMarkdown('**bold text**');
    expect(html).toContain('<strong>bold text</strong>');
  });

  it('should render italic text', async () => {
    const html = await renderMarkdown('*italic text*');
    expect(html).toContain('<em>italic text</em>');
  });

  it('should render strikethrough', async () => {
    const html = await renderMarkdown('~~strikethrough~~');
    expect(html).toContain('<del>strikethrough</del>');
  });

  it('should render blockquotes', async () => {
    const html = await renderMarkdown('> Blockquote text');
    expect(html).toContain('<blockquote');
    expect(html).toContain('Blockquote text');
  });

  it('should render unordered lists', async () => {
    const html = await renderMarkdown('- Item 1\n- Item 2');
    expect(html).toContain('<ul');
    expect(html).toContain('<li>Item 1</li>');
    expect(html).toContain('<li>Item 2</li>');
  });

  it('should render ordered lists', async () => {
    const html = await renderMarkdown('1. First\n2. Second');
    expect(html).toContain('<ol');
    expect(html).toContain('<li>First</li>');
    expect(html).toContain('<li>Second</li>');
  });

  it('should render inline code', async () => {
    const html = await renderMarkdown('Use `code` inline');
    expect(html).toContain('<code>code</code>');
  });

  it('should render code blocks', async () => {
    const html = await renderMarkdown('```javascript\nconsole.log("hello");\n```');
    expect(html).toContain('<pre><code');
    expect(html).toContain('console.log');
  });

  it('should render tables', async () => {
    const html = await renderMarkdown('| Name | Age |\n|------|-----|\n| John | 25  |');
    expect(html).toContain('<table');
    expect(html).toContain('<th>Name</th>');
    expect(html).toContain('<td>John</td>');
  });

  it('should render links', async () => {
    const html = await renderMarkdown('[Example](https://example.com)');
    expect(html).toContain('<a href="https://example.com"');
    expect(html).toContain('>Example</a>');
  });

  it('should render images', async () => {
    const html = await renderMarkdown('![Alt](https://example.com/img.png)');
    expect(html).toContain('<img src="https://example.com/img.png" alt="Alt"');
  });

  it('should render horizontal rules', async () => {
    const html = await renderMarkdown('---');
    expect(html).toContain('<hr');
  });

  it('should escape HTML injection', async () => {
    const html = await renderMarkdown('<script>alert("xss")</script>');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('alert');
  });

  it('should remove event handlers', async () => {
    const html = await renderMarkdown('<p onclick="alert(1)">text</p>');
    expect(html).not.toContain('onclick');
  });

  it('should escape HTML in code blocks', async () => {
    const html = await renderMarkdown('```\n<script>alert("xss")</script>\n```');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
