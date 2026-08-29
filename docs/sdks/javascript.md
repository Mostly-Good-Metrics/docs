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
  baseURL: 'https://ingest.mostlygoodmetrics.com',
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
| `baseURL` | `https://ingest.mostlygoodmetrics.com` | API endpoint |
| `environment` | `"production"` | Environment name |
| `appVersion` | - | App version (required for install/update tracking) |
| `maxBatchSize` | `100` | Events per batch |
| `flushInterval` | `30` | Auto-flush interval in seconds |
| `enableDebugLogging` | `false` | Enable console output |
| `trackAppLifecycleEvents` | `false` | Auto-track lifecycle events |
| `existingInstallation` | `false` | Baseline lifecycle state on a provider migration without emitting `$app_installed` |
| `contextProvider` | - | Dynamic properties evaluated for every event; precedence is super properties, context, event properties, then MGM system properties |
| `cookieDomain` | - | Cookie domain for cross-subdomain tracking |
| `disableCookies` | `false` | Disable cookies, use only localStorage |
| `persistence` | `'localStorage+cookie'` | Where state persists: `'localStorage+cookie'`, `'localStorage'`, or `'memory'` |
| `respectDoNotTrack` | `false` | Treat browsers with DNT or GPC enabled as opted out ([Privacy](#privacy)) |
| `optedOutByDefault` | `false` | Start opted out until `optIn()` is called ([Privacy](#privacy)) |
| `collectDeviceProperties` | `true` | Collect device properties |

## Automatic Events

When `trackAppLifecycleEvents` is enabled:

| Event | When | Properties |
|-------|------|------------|
| `$app_installed` | First visit (localStorage) | `$version` |
| `$app_updated` | Version change detected | `$version`, `$previous_version` |
| `$app_opened` | Page load / tab visible | - |
| `$app_backgrounded` | Tab hidden / page unload | - |

## Migration and dynamic context

For an existing site moving from another provider, derive `existingInstallation`
from that provider's persisted install marker. Do **not** set it to `true` for
all users: that would suppress genuine new installs.

```typescript
MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
  existingInstallation: legacyAnalytics.hasInstallationMarker(),
  contextProvider: () => ({ active_workspace_id: currentWorkspaceId() }),
});
```

`contextProvider` runs for every event. Its values override super properties;
explicit event properties and MGM system properties take precedence. With
`enableDebugLogging`, MGM warns when custom properties use reserved `$` keys.

## Privacy

The SDK collects no advertising identifiers, no location, and nothing you don't explicitly pass to `track()` or `identify()`. `identify()` is optional — without it, users are tracked under a random, resettable anonymous ID (`$anon_...`).

### Opt-out

```typescript
MostlyGoodMetrics.optOut();      // stop all tracking immediately
MostlyGoodMetrics.optIn();       // resume tracking
MostlyGoodMetrics.isOptedOut();  // current state
```

While opted out, tracking calls are no-ops and queued (unsent) events are purged. The choice is persisted and survives page loads.

For consent-first sites (e.g. GDPR), start opted out and call `optIn()` after consent:

```typescript
MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
  optedOutByDefault: true, // no events until optIn() is called
});
```

A persisted opt-in/opt-out choice always wins over `optedOutByDefault` on later visits.

### Do Not Track / Global Privacy Control

```typescript
MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
  respectDoNotTrack: true,
});
```

When enabled, browsers with Do Not Track (`navigator.doNotTrack === '1'`) or Global Privacy Control (`navigator.globalPrivacyControl === true`) are treated as opted out automatically.

### Persistence modes

```typescript
MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
  persistence: 'memory', // nothing written to disk
});
```

| Mode | Behavior |
|------|----------|
| `'localStorage+cookie'` (default) | localStorage plus a cookie (enables cross-subdomain tracking) |
| `'localStorage'` | No cookies — same as `disableCookies: true` |
| `'memory'` | Nothing persisted; IDs and the event queue live only for the page session |

### Rotating the anonymous ID

Rotate the anonymous ID so future events can't be linked to earlier anonymous activity:

```typescript
const newId = MostlyGoodMetrics.resetAnonymousId();
```

### Forget me

`resetIdentity()` clears the user ID (e.g. on logout); pass `clearAnonymousId: true` for a full local reset:

```typescript
MostlyGoodMetrics.resetIdentity({ clearAnonymousId: true });
```

This clears the user ID, rotates the anonymous ID, purges pending events and super properties, and starts a new session.

### Limiting device properties

```typescript
MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
  collectDeviceProperties: false,
});
```

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
