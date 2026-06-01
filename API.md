# API Documentation

Base URL: `http://localhost:3001/api` (development) or `https://your-api.com/api` (production)

## Endpoints

### Health Check

```
GET /api/health
```

Returns the API status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Convert Markdown to PDF

```
POST /api/pdf/convert
```

Converts markdown text to a PDF document.

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "markdown": "# Hello World\n\nThis is a **markdown** document.",
  "options": {
    "pageSize": "A4",
    "orientation": "portrait",
    "margins": "medium",
    "theme": "light",
    "fontSize": "medium"
  }
}
```

**Options:**

| Field | Type | Default | Allowed Values |
|-------|------|---------|----------------|
| pageSize | string | "A4" | "A4", "Letter", "Legal" |
| orientation | string | "portrait" | "portrait", "landscape" |
| margins | string | "medium" | "small", "medium", "large" |
| theme | string | "light" | "light", "dark", "professional" |
| fontSize | string | "medium" | "small", "medium", "large" |

**Success Response:**
- Status: `200 OK`
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="badili-<uuid>.pdf"`
- Body: Binary PDF data

**Error Responses:**

```json
// 400 Bad Request - Empty content
{
  "error": "Please enter markdown before converting.",
  "code": "EMPTY_CONTENT"
}

// 400 Bad Request - Invalid options
{
  "error": "Invalid page size. Must be one of: A4, Letter, Legal",
  "code": "INVALID_OPTIONS"
}

// 400 Bad Request - Content too large
{
  "error": "Markdown content exceeds maximum length.",
  "code": "CONTENT_TOO_LARGE"
}

// 429 Too Many Requests
{
  "error": "Too many requests, please try again later.",
  "code": "RATE_LIMIT_EXCEEDED"
}

// 500 Internal Server Error
{
  "error": "Unable to generate PDF. Please try again.",
  "code": "CONVERSION_FAILED"
}
```

---

### Track Analytics Event

```
POST /api/analytics/track
```

Records an analytics event. No-op in production if no analytics service is configured.

**Request Body:**
```json
{
  "event": "convert_completed",
  "metadata": {
    "size": 1234
  }
}
```

**Response:**
```json
{
  "status": "ok"
}
```

---

### Get Analytics Events (Development Only)

```
GET /api/analytics/events
```

Returns stored analytics events.

**Response:**
```json
[
  {
    "event": "convert_completed",
    "metadata": { "size": 1234 },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Clear Analytics Events (Development Only)

```
DELETE /api/analytics/events
```

Clears all stored analytics events.

**Response:**
```json
{
  "status": "cleared"
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_INPUT | 400 | Missing or invalid markdown |
| EMPTY_CONTENT | 400 | Empty markdown after trimming |
| CONTENT_TOO_LARGE | 400 | Markdown exceeds 500KB limit |
| INVALID_OPTIONS | 400 | Invalid PDF option value |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| CONVERSION_FAILED | 500 | PDF generation failed |
| INTERNAL_ERROR | 500 | Unexpected server error |

## Rate Limiting

- Default: 20 requests per 60-second window
- Configurable via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX` environment variables
- Headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`
