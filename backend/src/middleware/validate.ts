import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { PDFOptions } from '../types';

const VALID_PAGE_SIZES = ['A4', 'Letter', 'Legal'] as const;
const VALID_ORIENTATIONS = ['portrait', 'landscape'] as const;
const VALID_MARGINS = ['small', 'medium', 'large'] as const;
const VALID_THEMES = ['light', 'dark', 'professional'] as const;
const VALID_FONT_SIZES = ['small', 'medium', 'large'] as const;
const MAX_MARKDOWN_LENGTH = 500000;

const marginMap: Record<string, string> = {
  small: '15mm',
  medium: '25mm',
  large: '35mm',
};

const fontSizeMap: Record<string, string> = {
  small: '12px',
  medium: '16px',
  large: '20px',
};

export function validatePDFRequest(req: Request, _res: Response, next: NextFunction): void {
  const { markdown, options } = req.body;

  if (!markdown || typeof markdown !== 'string') {
    throw new AppError(400, 'INVALID_INPUT', 'Please enter markdown before converting.');
  }

  const trimmed = markdown.trim();
  if (trimmed.length === 0) {
    throw new AppError(400, 'EMPTY_CONTENT', 'Please enter markdown before converting.');
  }

  if (trimmed.length > MAX_MARKDOWN_LENGTH) {
    throw new AppError(400, 'CONTENT_TOO_LARGE', 'Markdown content exceeds maximum length.');
  }

  if (options) {
    const opts = options as Record<string, unknown>;
    if (opts.pageSize && !VALID_PAGE_SIZES.includes(opts.pageSize as typeof VALID_PAGE_SIZES[number])) {
      throw new AppError(400, 'INVALID_OPTIONS', `Invalid page size. Must be one of: ${VALID_PAGE_SIZES.join(', ')}`);
    }
    if (opts.orientation && !VALID_ORIENTATIONS.includes(opts.orientation as typeof VALID_ORIENTATIONS[number])) {
      throw new AppError(400, 'INVALID_OPTIONS', `Invalid orientation. Must be one of: ${VALID_ORIENTATIONS.join(', ')}`);
    }
    if (opts.margins && !VALID_MARGINS.includes(opts.margins as typeof VALID_MARGINS[number])) {
      throw new AppError(400, 'INVALID_OPTIONS', `Invalid margins. Must be one of: ${VALID_MARGINS.join(', ')}`);
    }
    if (opts.theme && !VALID_THEMES.includes(opts.theme as typeof VALID_THEMES[number])) {
      throw new AppError(400, 'INVALID_OPTIONS', `Invalid theme. Must be one of: ${VALID_THEMES.join(', ')}`);
    }
    if (opts.fontSize && !VALID_FONT_SIZES.includes(opts.fontSize as typeof VALID_FONT_SIZES[number])) {
      throw new AppError(400, 'INVALID_OPTIONS', `Invalid font size. Must be one of: ${VALID_FONT_SIZES.join(', ')}`);
    }
  }

  req.body.options = normalizeOptions(options || {});
  next();
}

function normalizeOptions(options: Record<string, unknown>): PDFOptions {
  return {
    pageSize: (options.pageSize as PDFOptions['pageSize']) || 'A4',
    orientation: (options.orientation as PDFOptions['orientation']) || 'portrait',
    margins: marginMap[(options.margins as string) || 'medium'],
    theme: (options.theme as PDFOptions['theme']) || 'light',
    fontSize: fontSizeMap[(options.fontSize as string) || 'medium'],
  } as PDFOptions;
}
