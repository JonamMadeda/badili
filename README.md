# Badili — Markdown to PDF Converter

**Badili** (Swahili for "change" or "convert") is a modern web application that converts Markdown text into professionally formatted PDF documents.

> Convert Markdown into beautiful PDFs instantly.

## Features

- **Live Preview** — See rendered markdown in real-time as you type
- **PDF Conversion** — Generate high-quality PDFs with a single click
- **Multiple Options** — Configure page size, orientation, margins, theme, and font size
- **Markdown Support** — Headings, lists, tables, code blocks, blockquotes, images, links, bold, italic, strikethrough, and horizontal rules
- **Dark & Professional Themes** — Choose from Light, Dark, or Professional themes
- **Keyboard Shortcut** — Press `Ctrl+Enter` to convert quickly
- **No Sign-up Required** — Start converting immediately
- **Secure** — Files never stored; XSS protection, rate limiting, security headers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| PDF Engine | Puppeteer (headless Chrome) |
| Markdown | marked (backend), react-markdown + rehype + remark (frontend) |
| Testing | Vitest, Playwright (E2E) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/badili/badili.git
cd badili

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Development

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or separately:

```bash
# Backend (port 3001)
npm run dev:backend

# Frontend (port 5173)
npm run dev:frontend
```

### Production Build

```bash
npm run build
```

## Deployment

### Frontend (Vercel / Netlify)

1. Set the build command to: `cd frontend && npm run build`
2. Set the output directory to: `frontend/dist`
3. Set environment variable: `VITE_API_URL=https://your-api.com`

### Backend (Railway / Render / Fly.io)

1. Set the start command to: `cd backend && npm start`
2. Set environment variables:
   - `PORT=3001`
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://your-frontend.com`
   - `RATE_LIMIT_WINDOW_MS=60000`
   - `RATE_LIMIT_MAX=50`

## Project Structure

```
badili/
├── backend/              # Express API server
│   ├── src/
│   │   ├── middleware/   # Rate limiting, validation, error handling, security
│   │   ├── routes/       # PDF conversion and analytics endpoints
│   │   ├── services/     # PDF generation and markdown rendering
│   │   └── __tests__/    # Backend unit tests
│   └── package.json
├── frontend/             # React + Vite web application
│   ├── src/
│   │   ├── components/   # MarkdownEditor, MarkdownPreview, PDFOptions, etc.
│   │   ├── pages/        # LandingPage, ConverterPage
│   │   ├── lib/          # API client
│   │   └── styles/       # Global CSS
│   ├── tests/            # Frontend unit tests
│   └── package.json
├── docs/                 # Documentation
├── e2e/                  # Playwright E2E tests
├── README.md
├── ARCHITECTURE.md
├── API.md
├── CHANGELOG.md
└── PROJECT_REPORT.txt
```

## Testing

```bash
# Run all tests
npm test

# Frontend tests only
npm run test --prefix frontend

# Backend tests only
npm run test --prefix backend

# E2E tests (Playwright)
npm run test:e2e
```

## License

MIT
