# Architecture

## Overview

Badili follows a client-server architecture with a React frontend and an Express backend API. The frontend handles markdown editing and live preview, while the backend handles PDF generation using Puppeteer.

```
┌─────────────────┐       HTTP/JSON        ┌──────────────────┐
│   React SPA     │ ◄────────────────────► │   Express API    │
│   (Vite build)  │    POST /api/pdf/convert │   (Node.js)     │
│                 │                         │                  │
│  ┌───────────┐  │                         │  ┌────────────┐  │
│  │ Markdown  │  │                         │  │ Validation │  │
│  │ Editor    │  │                         │  │ Middleware  │  │
│  └───────────┘  │                         │  └────────────┘  │
│  ┌───────────┐  │                         │  ┌────────────┐  │
│  │ Live      │  │                         │  │ marked     │  │
│  │ Preview   │  │                         │  │ Renderer   │  │
│  └───────────┘  │                         │  └────────────┘  │
│  ┌───────────┐  │                         │  ┌────────────┐  │
│  │ PDF       │  │                         │  │ Puppeteer  │  │
│  │ Download  │  │                         │  │ PDF Gen    │  │
│  └───────────┘  │                         │  └────────────┘  │
└─────────────────┘                         └──────────────────┘
```

## Frontend Architecture

### Component Tree

```
App
├── LandingPage
│   ├── Header
│   ├── HeroSection
│   ├── FeaturesSection
│   ├── HowItWorks
│   ├── CTASection
│   └── Footer
└── ConverterPage
    ├── Header
    ├── PDFOptionsPanel
    ├── MarkdownEditor (left pane)
    ├── MarkdownPreview (right pane)
    ├── ActionBar (convert/print buttons)
    ├── Footer
    └── ToastContainer
```

### Data Flow

1. User types/pastes markdown in the editor
2. `MarkdownEditor` updates state in `ConverterPage`
3. State is passed to `MarkdownPreview` which renders using `react-markdown`
4. Preview updates in real-time (debounced for performance)
5. User clicks "Convert to PDF"
6. API client sends markdown + options to backend
7. Backend generates PDF and returns it as a blob
8. Frontend triggers download

## PDF Generation Flow

```
1. Request received with markdown + options
2. Validate input (content, page size, orientation, etc.)
3. Parse markdown to HTML using marked (with custom renderer)
4. Wrap HTML in styled template (CSS variables for theme)
5. Launch headless Chrome via Puppeteer
6. Set page content and wait for rendering
7. Generate PDF with Puppeteer's page.pdf()
8. Return PDF buffer to client
```

### PDF Styling

PDF styling is done via inline CSS in the HTML template. CSS custom properties (variables) are used for theming:

- **Light**: White background, dark text, blue links
- **Dark**: Dark background, light text, lighter blue links
- **Professional**: White background, slate text, navy blue accents

The `@page` CSS rule controls margin and page size:

```css
@page {
  margin: var(--margins);
  size: var(--page-size) var(--orientation);
}
```

## Security Architecture

```
Client Request
    │
    ▼
helmet()              ← Security headers (CSP, HSTS, etc.)
    │
    ▼
securityHeaders()     ← Custom headers (X-Content-Type-Options, etc.)
    │
    ▼
rateLimiter()         ← Rate limiting (20 requests/minute by default)
    │
    ▼
validatePDFRequest()  ← Input validation & sanitization
    │
    ▼
sanitizeHTML()        ← Strip script tags, event handlers, javascript: URLs
    │
    ▼
generatePDF()         ← PDF generation
```

## Analytics Architecture

Analytics uses an abstraction layer for future integration with services like PostHog, Plausible, or Google Analytics. Currently uses local in-memory logging with a maximum of 10,000 events.

```
analytics.track('event_name', { metadata })
    │
    ▼
logEvent({ event, metadata, timestamp })
    │
    ├── Store in memory array
    └── Log to console in development
```

## Future Database Integration

The architecture is designed for easy database integration:

1. Add a database client (Prisma, Drizzle, or Mongoose)
2. Replace the in-memory analytics store with DB calls
3. Add a conversion history model
4. Update routes to use database queries

## Performance Considerations

- **Page load**: < 2 seconds (preconnect to fonts, optimized Vite build)
- **PDF generation**: < 5 seconds (reuse browser instance, optimized CSS)
- **Large documents**: Up to 100 pages; Puppeteer handles pagination automatically
- **Editor performance**: No debouncing needed for simple states; could add `useDebounce` for very large documents
