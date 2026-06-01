import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PDFOptionsPanel from '../src/components/PDFOptions';
import type { PDFOptions } from '../src/lib/api';

const defaultOptions: PDFOptions = {
  pageSize: 'A4',
  orientation: 'portrait',
  margins: 'medium',
  theme: 'light',
  fontSize: 'medium',
};

describe('PDFOptionsPanel', () => {
  it('renders all option groups', () => {
    render(<PDFOptionsPanel options={defaultOptions} onChange={() => {}} />);
    expect(screen.getByLabelText('Page Size')).toBeInTheDocument();
    expect(screen.getByLabelText('Orientation')).toBeInTheDocument();
    expect(screen.getByLabelText('Margins')).toBeInTheDocument();
    expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Font Size')).toBeInTheDocument();
  });

  it('calls onChange when option changes', () => {
    const onChange = vi.fn();
    render(<PDFOptionsPanel options={defaultOptions} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Page Size'), { target: { value: 'Letter' } });
    expect(onChange).toHaveBeenCalledWith({ ...defaultOptions, pageSize: 'Letter' });
  });

  it('disables options when disabled prop is true', () => {
    render(<PDFOptionsPanel options={defaultOptions} onChange={() => {}} disabled />);
    expect(screen.getByLabelText('Page Size')).toBeDisabled();
    expect(screen.getByLabelText('Orientation')).toBeDisabled();
  });
});
