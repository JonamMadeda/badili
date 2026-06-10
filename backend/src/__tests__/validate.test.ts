import { describe, it, expect } from 'vitest';
import { validatePDFRequest } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';
import { Request, Response } from 'express';

function createMockReq(body: unknown): Partial<Request> {
  return { body } as Partial<Request>;
}

function createMockRes(): Partial<Response> {
  return {} as Partial<Response>;
}

describe('validatePDFRequest', () => {
  it('should reject empty markdown', () => {
    const req = createMockReq({ markdown: '' });
    expect(() => validatePDFRequest(req as Request, createMockRes() as Response, () => {})).toThrow(AppError);
  });

  it('should reject missing markdown', () => {
    const req = createMockReq({});
    expect(() => validatePDFRequest(req as Request, createMockRes() as Response, () => {})).toThrow(AppError);
  });

  it('should reject non-string markdown', () => {
    const req = createMockReq({ markdown: 123 });
    expect(() => validatePDFRequest(req as Request, createMockRes() as Response, () => {})).toThrow(AppError);
  });

  it('should reject whitespace-only markdown', () => {
    const req = createMockReq({ markdown: '   ' });
    expect(() => validatePDFRequest(req as Request, createMockRes() as Response, () => {})).toThrow(AppError);
  });

  it('should reject invalid page size', () => {
    const req = createMockReq({ markdown: '# Hello', options: { pageSize: 'Invalid' } });
    expect(() => validatePDFRequest(req as Request, createMockRes() as Response, () => {})).toThrow(AppError);
  });

  it('should reject invalid orientation', () => {
    const req = createMockReq({ markdown: '# Hello', options: { orientation: 'invalid' } });
    expect(() => validatePDFRequest(req as Request, createMockRes() as Response, () => {})).toThrow(AppError);
  });

  it('should pass valid request', () => {
    const req = createMockReq({ markdown: '# Hello World' });
    expect(() => validatePDFRequest(req as Request, createMockRes() as Response, () => {})).not.toThrow();
  });

  it('should pass valid request with options', () => {
    const req = createMockReq({
      markdown: '# Hello',
      options: { pageSize: 'A4', orientation: 'portrait', margins: 'small', theme: 'light', fontSize: 'medium' },
    });
    expect(() => validatePDFRequest(req as Request, createMockRes() as Response, () => {})).not.toThrow();
  });

  it('should normalize options with defaults', () => {
    const req = createMockReq({ markdown: 'Hello' });
    const next = () => {};
    validatePDFRequest(req as Request, createMockRes() as Response, next);
    expect(req.body.options).toBeDefined();
    expect(req.body.options.pageSize).toBe('A4');
    expect(req.body.options.orientation).toBe('portrait');
    expect(req.body.options.theme).toBe('light');
  });
});
