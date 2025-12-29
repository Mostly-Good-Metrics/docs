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

## Automatic Events

When `trackAppLifecycleEvents` is enabled (default):

| Event | When |
|-------|------|
| `$app_installed` | First launch after install |
| `$app_updated` | First launch after app version change |
| `$app_opened` | App came to foreground |
| `$app_backgrounded` | App went to background |

## Manual Flush

```typescript
MostlyGoodMetrics.flush();
```

## Platform Support

- iOS
- Android
- Web (with limited lifecycle tracking)
