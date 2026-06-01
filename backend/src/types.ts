export interface PDFOptions {
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margins: string;
  theme: 'light' | 'dark' | 'professional';
  fontSize: string;
}

export interface PDFRequest {
  markdown: string;
  options: PDFOptions;
}

export interface AnalyticsEvent {
  event: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}
