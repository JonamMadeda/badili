export interface PDFOptions {
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margins: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'professional';
  fontSize: 'small' | 'medium' | 'large';
}

export interface ConvertResponse {
  success: boolean;
  error?: string;
}

const API_BASE = '/api';

export async function convertToPDF(
  markdown: string,
  options: PDFOptions
): Promise<Blob> {
  const response = await fetch(`${API_BASE}/pdf/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ markdown, options }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: 'Unable to generate PDF. Please try again.',
    }));
    throw new Error(errorData.error || 'Unable to generate PDF. Please try again.');
  }

  return response.blob();
}

export function downloadPDF(blob: Blob, filename = 'badili-document.pdf'): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printPDF(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '-10000px';
  iframe.style.bottom = '-10000px';
  iframe.style.width = '1px';
  iframe.style.height = '1px';
  document.body.appendChild(iframe);
  iframe.src = url;
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.print();
    }, 500);
  };
}

export function trackEvent(event: string, metadata?: Record<string, unknown>): void {
  fetch(`${API_BASE}/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, metadata }),
    keepalive: true,
  }).catch(() => {
    // Silent fail for analytics
  });
}
