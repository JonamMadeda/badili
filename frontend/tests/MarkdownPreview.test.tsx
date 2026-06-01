import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MarkdownPreview from '../src/components/MarkdownPreview';

describe('MarkdownPreview', () => {
  it('shows placeholder when empty', () => {
    render(<MarkdownPreview content="" />);
    expect(screen.getByText('Preview will appear here')).toBeInTheDocument();
  });

  it('renders markdown h1 heading', () => {
    const { container } = render(<MarkdownPreview content="# Heading 1" />);
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
  });

  it('renders markdown h2 heading', () => {
    const { container } = render(<MarkdownPreview content="## Heading 2" />);
    expect(container.querySelector('h2')).toBeInTheDocument();
  });

  it('renders bold text', () => {
    render(<MarkdownPreview content="**bold text**" />);
    const bold = screen.getByText('bold text');
    expect(bold.tagName).toBe('STRONG');
  });

  it('renders italic text', () => {
    render(<MarkdownPreview content="*italic text*" />);
    const italic = screen.getByText('italic text');
    expect(italic.tagName).toBe('EM');
  });

  it('renders inline code', () => {
    render(<MarkdownPreview content="Use `code` here" />);
    expect(screen.getByText('code')).toBeInTheDocument();
  });

  it('renders links', () => {
    render(<MarkdownPreview content="[Example](https://example.com)" />);
    const link = screen.getByText('Example');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders blockquotes', () => {
    const { container } = render(<MarkdownPreview content="> Quote text" />);
    expect(container.querySelector('blockquote')).toBeInTheDocument();
    expect(screen.getByText('Quote text')).toBeInTheDocument();
  });

  it('renders unordered lists', () => {
    const { container } = render(<MarkdownPreview content={'- Item A\n- Item B'} />);
    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    expect(list?.querySelectorAll('li').length).toBeGreaterThanOrEqual(1);
  });

  it('renders code blocks', () => {
    const { container } = render(<MarkdownPreview content={'```\ncode block\n```'} />);
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.querySelector('code')).toBeInTheDocument();
  });

  it('renders horizontal rules', () => {
    const { container } = render(<MarkdownPreview content="---" />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders tables', () => {
    const { container } = render(<MarkdownPreview content={'| A | B |\n|---|---|\n| 1 | 2 |'} />);
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(container.querySelector('th')).toBeInTheDocument();
    expect(container.querySelector('td')).toBeInTheDocument();
  });
});
