---
sidebar_position: 6
---

# Capacitor SDK

The official Capacitor SDK for hybrid mobile apps.

## Requirements

- Capacitor 5+
- iOS and Android support

## Installation

```bash
npm install @mostly-good-metrics/capacitor
```

### Required Peer Dependencies

```bash
npm install @capacitor/core @capacitor/app @capacitor/device @capacitor/preferences
npx cap sync
```

## Quick Start

### Initialize

Initialize as early as possible in your app:

```typescript
import MostlyGoodMetrics from '@mostly-good-metrics/capacitor';

MostlyGoodMetrics.configure('mgm_proj_your_api_key', {
  appVersion: '1.0.0',
  environment: 'production',
});
```

### Track Events

```typescript
MostlyGoodMetrics.track('button_clicked', {
  button_name: 'signup',
  screen: 'home',
});
```

### Identify Users

```typescript
MostlyGoodMetrics.identify('user-123');
```

### Super Properties

Set properties that will be included with every event:

```typescript
// Set a single super property
MostlyGoodMetrics.setSuperProperty('plan', 'premium');

// Set multiple super properties
MostlyGoodMetrics.setSuperProperties({
  plan: 'premium',
  tier: 'gold',
});

// Remove a super property
MostlyGoodMetrics.removeSuperProperty('plan');

// Clear all super properties
MostlyGoodMetrics.clearSuperProperties();
```

## Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `appVersion` | - | App version for install/update tracking |
| `environment` | `'production'` | Environment name |
| `maxBatchSize` | `100` | Max events per batch |
| `flushInterval` | `30` | Seconds between auto-flushes |
| `maxStoredEvents` | `10000` | Max events to store locally |
| `enableDebugLogging` | `false` | Enable console logging |
| `trackAppLifecycleEvents` | `true` | Track app open/background events |
| `optedOutByDefault` | `false` | Start opted out until `optIn()` is called ([Privacy](#privacy)) |
| `collectDeviceProperties` | `true` | Collect device properties |

## Automatic Events

When `trackAppLifecycleEvents` is enabled (default):

| Event | When |
|-------|------|
| `$app_installed` | First launch after install |
| `$app_updated` | First launch after app version change |
| `$app_opened` | App came to foreground |
| `$app_backgrounded` | App went to background |

## Privacy

The SDK never collects advertising identifiers, location, or anything you don't explicitly pass to `track()` or `identify()`. `identify()` is optional — without it, users are tracked under a random, resettable anonymous ID (`$anon_...`).

### Opt-out

```typescript
MostlyGoodMetrics.optOut();      // stop all tracking immediately
MostlyGoodMetrics.optIn();       // resume tracking
MostlyGoodMetrics.isOptedOut();  // current state
```

While opted out, tracking calls are no-ops and queued (unsent) events are purged. The choice is persisted natively via Capacitor Preferences and survives restarts.

For consent-first apps (e.g. GDPR), start opted out and call `optIn()` after consent:

```typescript
MostlyGoodMetrics.configure('mgm_proj_your_api_key', {
  optedOutByDefault: true, // no events until optIn() is called
});
```

A persisted opt-in/opt-out choice always wins over `optedOutByDefault` on later launches.

### Rotating the anonymous ID

```typescript
const newId = MostlyGoodMetrics.resetAnonymousId();
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

The JS core's `respectDoNotTrack` and `persistence` options are web-only and are not part of the Capacitor configuration.

## Manual Flush

```typescript
MostlyGoodMetrics.flush();
```

## Platform Support

- iOS
- Android
- Web (with limited lifecycle tracking)
