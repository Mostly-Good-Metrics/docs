---
sidebar_position: 5
---

# Flutter SDK

A lightweight Flutter SDK with full cross-platform support.

## Requirements

- Flutter 3.10+
- Dart 3.0+

## Platform Support

| Platform | Supported |
|----------|-----------|
| iOS      | Yes       |
| Android  | Yes       |
| Web      | Yes       |
| macOS    | Yes       |
| Windows  | Yes       |
| Linux    | Yes       |

## Installation

Add to your `pubspec.yaml`:

```yaml
dependencies:
  mostly_good_metrics_flutter: ^0.2.5
```

Then run:

```bash
flutter pub get
```

## Quick Start

### Initialize

Initialize once at app startup (typically in `main.dart`):

```dart
import 'package:flutter/material.dart';
import 'package:mostly_good_metrics_flutter/mostly_good_metrics_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await MostlyGoodMetrics.configure(
    MGMConfiguration(apiKey: 'mgm_proj_your_api_key'),
  );

  runApp(MyApp());
}
```

### Track Events

```dart
// Simple event
MostlyGoodMetrics.track('button_clicked');

// Event with properties
MostlyGoodMetrics.track('purchase_completed', properties: {
  'product_id': 'SKU123',
  'price': 29.99,
  'currency': 'USD',
});
```

### Identify Users

```dart
// Set user identity
await MostlyGoodMetrics.identify('user_123');

// Reset identity (e.g., on logout)
await MostlyGoodMetrics.resetIdentity();
```

## Configuration Options

```dart
await MostlyGoodMetrics.configure(
  MGMConfiguration(
    apiKey: 'mgm_proj_your_api_key',
    baseUrl: 'https://mostlygoodmetrics.com',
    environment: 'production',
    appVersion: '1.0.0',
    maxBatchSize: 100,
    flushInterval: 30,
    maxStoredEvents: 10000,
    enableDebugLogging: kDebugMode,
    trackAppLifecycleEvents: true,
  ),
);
```

| Option | Default | Description |
|--------|---------|-------------|
| `apiKey` | Required | Your API key |
| `baseUrl` | `https://mostlygoodmetrics.com` | API endpoint |
| `environment` | `"production"` | Environment name |
| `appVersion` | - | App version (required for install/update tracking) |
| `maxBatchSize` | `100` | Events per batch |
| `flushInterval` | `30` | Auto-flush interval in seconds |
| `maxStoredEvents` | `10000` | Max cached events |
| `enableDebugLogging` | `false` | Enable debug output |
| `trackAppLifecycleEvents` | `true` | Auto-track lifecycle events |

## Automatic Events

| Event | When | Properties |
|-------|------|------------|
| `$app_installed` | First launch after install | - |
| `$app_updated` | First launch after version change | `previous_version`, `current_version` |
| `$app_opened` | App started | - |
| `$app_foregrounded` | App became active | - |
| `$app_backgrounded` | App went to background | - |

## Session Management

```dart
// Start a new session manually
await MostlyGoodMetrics.startNewSession();

// Access current session ID
final sessionId = MostlyGoodMetrics.sessionId;
```

## Error Handling

```dart
try {
  MostlyGoodMetrics.track('invalid-event-name');
} on MGMError catch (e) {
  print('Error type: ${e.type}');
  print('Message: ${e.message}');
}
```

Error types:
- `MGMErrorType.notConfigured` - SDK not configured
- `MGMErrorType.invalidEventName` - Invalid event name
- `MGMErrorType.invalidProperties` - Invalid properties
- `MGMErrorType.networkError` - Network failure
- `MGMErrorType.rateLimited` - API rate limited

## Manual Flush

```dart
await MostlyGoodMetrics.flush();

// Check pending events
final count = await MostlyGoodMetrics.getPendingEventCount();
print('$count events pending');

// Clear pending events
await MostlyGoodMetrics.clearPendingEvents();
```
