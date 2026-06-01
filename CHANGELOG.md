# Changelog

## [1.0.0] - 2024-01-01

### Added
- Initial release of Badili
- Markdown editor with line numbers, word count, and character count
- Live preview with full Markdown rendering (headings, lists, tables, code blocks, blockquotes, links, images)
- PDF conversion with configurable options:
  - Page size: A4, Letter, Legal
  - Orientation: Portrait, Landscape
  - Margins: Small, Medium, Large
  - Theme: Light, Dark, Professional
  - Font size: Small, Medium, Large
- Keyboard shortcut: Ctrl+Enter to convert
- Print PDF support
- Landing page with hero, features, and how-it-works sections
- Mobile responsive design
- Security features:
  - Input validation and sanitization
  - XSS protection
  - HTML injection prevention
  - Rate limiting
  - Security headers (Helmet)
- Analytics abstraction layer (local logging)
- Toast notifications for user feedback
- Backend API with CORS support
- Comprehensive test coverage:
  - 25 backend unit tests
  - 15 frontend unit tests
- Documentation:
  - README with setup and deployment guide
  - Architecture documentation
  - API documentation
  - Changelog
