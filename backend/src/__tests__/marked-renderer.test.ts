import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../services/markedRenderer';

describe('markedRenderer', () => {
  it('should render headings', () => {
    const html = renderMarkdown('# Heading 1\n## Heading 2\n### Heading 3');
    expect(html).toContain('<h1');
    expect(html).toContain('Heading 1');
    expect(html).toContain('<h2');
    expect(html).toContain('Heading 2');
    expect(html).toContain('<h3');
    expect(html).toContain('Heading 3');
  });

  it('should render bold text', () => {
    const html = renderMarkdown('**bold text**');
    expect(html).toContain('<strong>bold text</strong>');
  });

  it('should render italic text', () => {
    const html = renderMarkdown('*italic text*');
    expect(html).toContain('<em>italic text</em>');
  });

  it('should render strikethrough', () => {
    const html = renderMarkdown('~~strikethrough~~');
    expect(html).toContain('<del>strikethrough</del>');
  });

  it('should render blockquotes', () => {
    const html = renderMarkdown('> Blockquote text');
    expect(html).toContain('<blockquote');
    expect(html).toContain('Blockquote text');
  });

  it('should render unordered lists', () => {
    const html = renderMarkdown('- Item 1\n- Item 2');
    expect(html).toContain('<ul');
    expect(html).toContain('<li>Item 1</li>');
    expect(html).toContain('<li>Item 2</li>');
  });

  it('should render ordered lists', () => {
    const html = renderMarkdown('1. First\n2. Second');
    expect(html).toContain('<ol');
    expect(html).toContain('<li>First</li>');
    expect(html).toContain('<li>Second</li>');
  });

  it('should render inline code', () => {
    const html = renderMarkdown('Use `code` inline');
    expect(html).toContain('<code>code</code>');
  });

  it('should render code blocks', () => {
    const html = renderMarkdown('```javascript\nconsole.log("hello");\n```');
    expect(html).toContain('<pre><code');
    expect(html).toContain('console.log');
  });

  it('should render tables', () => {
    const html = renderMarkdown('| Name | Age |\n|------|-----|\n| John | 25  |');
    expect(html).toContain('<table');
    expect(html).toContain('<th>Name</th>');
    expect(html).toContain('<td>John</td>');
  });

  it('should render links', () => {
    const html = renderMarkdown('[Example](https://example.com)');
    expect(html).toContain('<a href="https://example.com"');
    expect(html).toContain('>Example</a>');
  });

  it('should render images', () => {
    const html = renderMarkdown('![Alt](https://example.com/img.png)');
    expect(html).toContain('<img src="https://example.com/img.png" alt="Alt"');
  });

  it('should render horizontal rules', () => {
    const html = renderMarkdown('---');
    expect(html).toContain('<hr');
  });

  it('should escape HTML injection', () => {
    const html = renderMarkdown('<script>alert("xss")</script>');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('alert');
  });

  it('should remove event handlers', () => {
    const html = renderMarkdown('<p onclick="alert(1)">text</p>');
    expect(html).not.toContain('onclick');
  });

  it('should escape HTML in code blocks', () => {
    const html = renderMarkdown('```\n<script>alert("xss")</script>\n```');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
