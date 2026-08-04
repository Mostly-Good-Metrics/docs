---
sidebar_position: 3
---

# React Native SDK

A lightweight React Native SDK for iOS and Android.

## Requirements

- React Native 0.71+
- Expo SDK 49+ (if using Expo)

## Installation

### Expo (Recommended)

```bash
npm install @mostly-good-metrics/react-native
```

That's it! Expo includes AsyncStorage by default.

### Bare React Native

```bash
npm install @mostly-good-metrics/react-native @react-native-async-storage/async-storage
cd ios && pod install
```

## Quick Start

### Initialize

```typescript
import MostlyGoodMetrics from '@mostly-good-metrics/react-native';

MostlyGoodMetrics.configure('mgm_proj_your_api_key');
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
// Set user identity
MostlyGoodMetrics.identify('user_123');

// Reset identity (e.g., on logout)
MostlyGoodMetrics.resetIdentity();
```

## Configuration Options

```typescript
import { version } from './package.json';

MostlyGoodMetrics.configure('mgm_proj_your_api_key', {
  baseURL: 'https://ingest.mostlygoodmetrics.com',
  environment: 'production',
  appVersion: version,
  maxBatchSize: 100,
  flushInterval: 30,
  maxStoredEvents: 10000,
  enableDebugLogging: __DEV__,
  trackAppLifecycleEvents: true,
});
```

| Option | Default | Description |
|--------|---------|-------------|
| `baseURL` | `https://ingest.mostlygoodmetrics.com` | API endpoint |
| `environment` | `"production"` | Environment name |
| `appVersion` | - | App version (required for install/update tracking) |
| `maxBatchSize` | `100` | Events per batch |
| `flushInterval` | `30` | Auto-flush interval in seconds |
| `maxStoredEvents` | `10000` | Max cached events |
| `enableDebugLogging` | `false` | Enable console output |
| `trackAppLifecycleEvents` | `true` | Auto-track lifecycle events |
| `optedOutByDefault` | `false` | Start opted out until `optIn()` is called ([Privacy](#privacy)) |
| `collectDeviceProperties` | `true` | Collect device properties |

## Automatic Events

| Event | When | Properties |
|-------|------|------------|
| `$app_installed` | First launch after install | `$version` |
| `$app_updated` | First launch after version change | `$version`, `$previous_version` |
| `$app_opened` | App became active (foreground) | - |
| `$app_backgrounded` | App resigned active (background) | - |

## Privacy

The SDK never collects advertising identifiers, location, or anything you don't explicitly pass to `track()` or `identify()`. `identify()` is optional — without it, users are tracked under a random, resettable anonymous ID (`$anon_...`).

### Opt-out

```typescript
MostlyGoodMetrics.optOut();      // stop all tracking immediately
MostlyGoodMetrics.optIn();       // resume tracking
MostlyGoodMetrics.isOptedOut();  // current state
```

While opted out, tracking calls are no-ops and queued (unsent) events are purged. The choice is persisted in AsyncStorage and survives restarts.

For consent-first apps (e.g. GDPR), start opted out and call `optIn()` after consent:

```typescript
MostlyGoodMetrics.configure('mgm_proj_your_api_key', {
  optedOutByDefault: true, // no events until optIn() is called
});
```

A persisted opt-in/opt-out choice always wins over `optedOutByDefault` on later launches.

### Rotating the anonymous ID

```typescript
const newId = await MostlyGoodMetrics.resetAnonymousId(); // async in React Native
```

### Forget me

`resetIdentity()` clears the user ID; pass `clearAnonymousId: true` for a full local reset:

```typescript
MostlyGoodMetrics.resetIdentity({ clearAnonymousId: true });
```

This clears the user ID, rotates the anonymous ID, purges pending events and super properties, and starts a new session.

### Limiting device properties

```typescript
MostlyGoodMetrics.configure('mgm_proj_your_api_key', {
  collectDeviceProperties: false,
});
```

The JS core's `respectDoNotTrack` and `persistence` options are web-only and are not part of the React Native configuration.

## Manual Flush

```typescript
MostlyGoodMetrics.flush();

// Check pending events
const count = await MostlyGoodMetrics.getPendingEventCount();
console.log(`${count} events pending`);
```
