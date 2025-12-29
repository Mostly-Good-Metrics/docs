---
sidebar_position: 1
---

# Swift SDK

A lightweight Swift SDK for iOS, macOS, tvOS, watchOS, and visionOS.

## Requirements

- iOS 14.0+ / macOS 11.0+ / tvOS 14.0+ / watchOS 7.0+
- Swift 5.9+

## Installation

### Swift Package Manager

Add to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/Mostly-Good-Metrics/mostly-good-metrics-swift-sdk", from: "1.0.0")
]
```

Or in Xcode: **File > Add Package Dependencies** and enter the repository URL.

## Quick Start

### Initialize

Initialize once at app launch (e.g., in `AppDelegate` or `@main` App struct):

```swift
import MostlyGoodMetrics

MostlyGoodMetrics.configure(apiKey: "mgm_proj_your_api_key")
```

### Track Events

```swift
// Simple event
MostlyGoodMetrics.track("button_clicked")

// Event with properties
MostlyGoodMetrics.track("purchase_completed", properties: [
    "product_id": "SKU123",
    "price": 29.99,
    "currency": "USD"
])
```

### Identify Users

```swift
// Set user identity
MostlyGoodMetrics.identify(userId: "user_123")

// Reset identity (e.g., on logout)
MostlyGoodMetrics.shared?.resetIdentity()
```

## Configuration Options

For more control, use `MGMConfiguration`:

```swift
let config = MGMConfiguration(
    apiKey: "mgm_proj_your_api_key",
    baseURL: URL(string: "https://mostlygoodmetrics.com")!,
    environment: "production",
    maxBatchSize: 100,
    flushInterval: 30,
    maxStoredEvents: 10000,
    enableDebugLogging: false,
    trackAppLifecycleEvents: true
)

MostlyGoodMetrics.configure(with: config)
```

| Option | Default | Description |
|--------|---------|-------------|
| `apiKey` | Required | Your API key |
| `baseURL` | `https://mostlygoodmetrics.com` | API endpoint |
| `environment` | `"production"` | Environment name |
| `maxBatchSize` | `100` | Events per batch (1-1000) |
| `flushInterval` | `30` | Auto-flush interval in seconds |
| `maxStoredEvents` | `10000` | Max cached events |
| `enableDebugLogging` | `false` | Enable console output |
| `trackAppLifecycleEvents` | `true` | Auto-track lifecycle events |

## Automatic Events

When `trackAppLifecycleEvents` is enabled (default), the SDK automatically tracks:

| Event | When | Properties |
|-------|------|------------|
| `$app_installed` | First launch after install | `$version` |
| `$app_updated` | First launch after version change | `$version`, `$previous_version` |
| `$app_opened` | App became active (foreground) | - |
| `$app_backgrounded` | App resigned active (background) | - |

### macOS Behavior

On macOS, window focus changes happen frequently. The SDK applies debouncing:

- `$app_backgrounded`: Not tracked on macOS
- `$app_opened`: Only tracked if the app was inactive for at least 5 seconds

## Automatic Context

Every event automatically includes:

| Field | Example | Description |
|-------|---------|-------------|
| `platform` | `"ios"` | Platform (ios, macos, tvos, watchos, visionos) |
| `os_version` | `"17.1"` | Operating system version |
| `app_version` | `"1.0.0 (42)"` | App version with build number |
| `session_id` | `"uuid..."` | Unique session ID (per app launch) |
| `user_id` | `"user_123"` | User ID (if set via `identify()`) |
| `$device_type` | `"phone"` | Device type (phone, tablet, desktop, tv, watch, vision) |
| `$device_model` | `"iPhone15,2"` | Device model identifier |

## Properties

Events support various property types:

```swift
MostlyGoodMetrics.track("checkout", properties: [
    "string_prop": "value",
    "int_prop": 42,
    "double_prop": 3.14,
    "bool_prop": true,
    "list_prop": ["a", "b", "c"],
    "nested": [
        "key": "value"
    ]
])
```

**Limits:**
- String values: truncated to 1000 characters
- Nesting depth: max 3 levels
- Total properties size: max 10KB

## Manual Flush

```swift
MostlyGoodMetrics.shared?.flush { result in
    switch result {
    case .success:
        print("Events flushed successfully")
    case .failure(let error):
        print("Flush failed: \(error.localizedDescription)")
    }
}
```

## Automatic Behavior

The SDK automatically:

- Persists events to disk, surviving app restarts
- Batches events for efficient network usage
- Flushes every 30 seconds (configurable)
- Flushes when the app backgrounds
- Retries on network failure
- Compresses payloads using gzip for requests > 1KB
- Handles rate limiting by respecting `Retry-After` headers

## Thread Safety

The SDK is fully thread-safe. You can call `track()` from any thread.
