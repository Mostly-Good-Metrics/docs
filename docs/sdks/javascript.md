---
sidebar_position: 4
---

# JavaScript SDK

A lightweight JavaScript/TypeScript SDK for web applications.

## Requirements

- Node.js 16+ (for build tools)
- Modern browser with ES2020 support, or Node.js runtime

## Installation

```bash
npm install @mostly-good-metrics/javascript
```

## Quick Start

### Initialize

```typescript
import { MostlyGoodMetrics } from '@mostly-good-metrics/javascript';

MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
});
```

### Track Events

```typescript
// Simple event
MostlyGoodMetrics.track('button_clicked');

// Event with properties
MostlyGoodMetrics.track('purchase_completed', {
  product_id: 'SKU123',
  price: 29.99,
  currency: 'USD',
});
```

### Identify Users

```typescript
// Set user identity (optional - anonymous ID is auto-generated)
MostlyGoodMetrics.identify('user_123');

// Reset identity (e.g., on logout)
MostlyGoodMetrics.resetIdentity();
```

## User Identification

The SDK automatically generates and persists an anonymous `user_id` (UUID) for each user:

- Auto-generated on first visit
- Persists across sessions (stored in cookies and localStorage)
- Included in every event as `user_id`

When you call `identify()`, the identified user ID takes precedence.

### Cross-Subdomain Tracking

```typescript
MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
  cookieDomain: '.yourdomain.com', // Share across all subdomains
});
```

### Privacy Mode (No Cookies)

```typescript
MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
  disableCookies: true, // Only use localStorage
});
```

## Configuration Options

```typescript
MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
  baseURL: 'https://mostlygoodmetrics.com',
  environment: 'production',
  appVersion: '1.0.0',
  maxBatchSize: 100,
  flushInterval: 30,
  maxStoredEvents: 10000,
  enableDebugLogging: process.env.NODE_ENV === 'development',
  trackAppLifecycleEvents: true,
});
```

| Option | Default | Description |
|--------|---------|-------------|
| `apiKey` | Required | Your API key |
| `baseURL` | `https://mostlygoodmetrics.com` | API endpoint |
| `environment` | `"production"` | Environment name |
| `appVersion` | - | App version (required for install/update tracking) |
| `maxBatchSize` | `100` | Events per batch |
| `flushInterval` | `30` | Auto-flush interval in seconds |
| `enableDebugLogging` | `false` | Enable console output |
| `trackAppLifecycleEvents` | `false` | Auto-track lifecycle events |
| `cookieDomain` | - | Cookie domain for cross-subdomain tracking |
| `disableCookies` | `false` | Disable cookies, use only localStorage |

## Automatic Events

When `trackAppLifecycleEvents` is enabled:

| Event | When | Properties |
|-------|------|------------|
| `$app_installed` | First visit (localStorage) | `$version` |
| `$app_updated` | Version change detected | `$version`, `$previous_version` |
| `$app_opened` | Page load / tab visible | - |
| `$app_backgrounded` | Tab hidden / page unload | - |

## Framework Integration

### React

```typescript
// src/analytics.ts
import { MostlyGoodMetrics } from '@mostly-good-metrics/javascript';

export function initAnalytics() {
  MostlyGoodMetrics.configure({
    apiKey: process.env.REACT_APP_MGM_API_KEY!,
    environment: process.env.NODE_ENV,
    appVersion: process.env.REACT_APP_VERSION,
  });
}

// src/index.tsx
import { initAnalytics } from './analytics';
initAnalytics();
```

### Next.js

```typescript
// lib/analytics.ts
import { MostlyGoodMetrics } from '@mostly-good-metrics/javascript';

export function initAnalytics() {
  if (typeof window !== 'undefined') {
    MostlyGoodMetrics.configure({
      apiKey: process.env.NEXT_PUBLIC_MGM_API_KEY!,
      environment: process.env.NODE_ENV,
    });
  }
}

// app/layout.tsx
'use client';
import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics';

export default function RootLayout({ children }) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return <html>...</html>;
}
```

### Vue

```typescript
// src/plugins/analytics.ts
import { MostlyGoodMetrics } from '@mostly-good-metrics/javascript';

export default {
  install() {
    MostlyGoodMetrics.configure({
      apiKey: import.meta.env.VITE_MGM_API_KEY,
      environment: import.meta.env.MODE,
    });
  }
};

// src/main.ts
import analytics from './plugins/analytics';
app.use(analytics);
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import {
  MostlyGoodMetrics,
  MGMConfiguration,
  MGMEvent,
  EventProperties,
} from '@mostly-good-metrics/javascript';
```
