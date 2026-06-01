import type { PDFOptions as PDFOptionsType } from '../lib/api';

interface PDFOptionsProps {
  options: PDFOptionsType;
  onChange: (options: PDFOptionsType) => void;
  disabled?: boolean;
}

const pageSizes = [
  { value: 'A4', label: 'A4' },
  { value: 'Letter', label: 'Letter' },
  { value: 'Legal', label: 'Legal' },
] as const;

const orientations = [
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
] as const;

const marginOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
] as const;

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'professional', label: 'Professional' },
] as const;

const fontSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
] as const;

export default function PDFOptionsPanel({ options, onChange, disabled }: PDFOptionsProps) {
  const update = (key: keyof PDFOptionsType, value: string) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <label htmlFor="page-size" className="text-xs font-medium text-slate-500 whitespace-nowrap">Size</label>
        <select
          id="page-size"
          value={options.pageSize}
          onChange={(e) => update('pageSize', e.target.value)}
          disabled={disabled}
          className="select-input py-1.5 px-2 text-xs"
        >
          {pageSizes.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="orientation" className="text-xs font-medium text-slate-500 whitespace-nowrap">Orientation</label>
        <select
          id="orientation"
          value={options.orientation}
          onChange={(e) => update('orientation', e.target.value)}
          disabled={disabled}
          className="select-input py-1.5 px-2 text-xs"
        >
          {orientations.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="margins" className="text-xs font-medium text-slate-500 whitespace-nowrap">Margins</label>
        <select
          id="margins"
          value={options.margins}
          onChange={(e) => update('margins', e.target.value)}
          disabled={disabled}
          className="select-input py-1.5 px-2 text-xs"
        >
          {marginOptions.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="theme" className="text-xs font-medium text-slate-500 whitespace-nowrap">Theme</label>
        <select
          id="theme"
          value={options.theme}
          onChange={(e) => update('theme', e.target.value)}
          disabled={disabled}
          className="select-input py-1.5 px-2 text-xs"
        >
          {themeOptions.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="font-size" className="text-xs font-medium text-slate-500 whitespace-nowrap">Font</label>
        <select
          id="font-size"
          value={options.fontSize}
          onChange={(e) => update('fontSize', e.target.value)}
          disabled={disabled}
          className="select-input py-1.5 px-2 text-xs"
        >
          {fontSizeOptions.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
