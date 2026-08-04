---
sidebar_position: 1
---

# Swift SDK

A lightweight Swift SDK for iOS, macOS, tvOS, watchOS, and visionOS.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration Options](#configuration-options)
- [Automatic Behavior](#automatic-behavior)
- [Automatic Events](#automatic-events)
- [Automatic Context](#automatic-context)
- [Event Naming](#event-naming)
- [Properties](#properties)
- [Manual Flush](#manual-flush)
- [Privacy](#privacy)
- [Debug Logging](#debug-logging)
- [Thread Safety](#thread-safety)

## Requirements

- iOS 14.0+ / macOS 11.0+ / tvOS 14.0+ / watchOS 7.0+
- Swift 5.9+

## Installation

### Swift Package Manager

Add to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/Mostly-Good-Metrics/mostly-good-metrics-swift-sdk", from: "0.7.0")
]
```

Or in Xcode: **File > Add Package Dependencies** and enter the repository URL.

## Quick Start

### 1. Initialize the SDK

Initialize once at app launch. Choose the approach that matches your app's architecture:

#### SwiftUI

```swift
import SwiftUI
import MostlyGoodMetrics

@main
struct MyApp: App {
    init() {
        MostlyGoodMetrics.configure(apiKey: "mgm_proj_your_api_key")
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

#### UIKit

```swift
import UIKit
import MostlyGoodMetrics

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        MostlyGoodMetrics.configure(apiKey: "mgm_proj_your_api_key")
        return true
    }
}
```

### 2. Track Events

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

### 3. Identify Users

```swift
// Set user identity
MostlyGoodMetrics.identify(userId: "user_123")

// Reset identity (e.g., on logout)
MostlyGoodMetrics.shared?.resetIdentity()
```

That's it! Events are automatically batched and sent.

## Configuration Options

For more control, use `MGMConfiguration`:

```swift
let config = MGMConfiguration(
    apiKey: "mgm_proj_your_api_key",
    baseURL: URL(string: "https://ingest.mostlygoodmetrics.com")!,
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
| `baseURL` | `https://ingest.mostlygoodmetrics.com` | API endpoint |
| `environment` | `"production"` | Environment name |
| `maxBatchSize` | `100` | Events per batch (1-1000) |
| `flushInterval` | `30` | Auto-flush interval in seconds |
| `maxStoredEvents` | `10000` | Max cached events |
| `enableDebugLogging` | `false` | Enable console output |
| `trackAppLifecycleEvents` | `true` | Auto-track lifecycle events |
| `optedOutByDefault` | `false` | Start opted out until `optIn()` is called ([Privacy](#privacy)) |
| `collectDeviceProperties` | `true` | Collect device model/type, manufacturer, locale, timezone |

## Automatic Behavior

The SDK automatically handles common tasks so you can focus on tracking what matters:

- **Persists events** to disk, surviving app restarts
- **Batches events** for efficient network usage
- **Flushes on interval** (default: every 30 seconds)
- **Flushes on background** when the app resigns active
- **Retries on failure** for network errors (events are preserved)
- **Compresses payloads** using gzip for requests > 1KB
- **Handles rate limiting** by respecting `Retry-After` headers
- **Persists user ID** across app launches
- **Generates session IDs** per app launch

## Automatic Events

When `trackAppLifecycleEvents` is enabled (default), the SDK automatically tracks:

| Event | When | Properties |
|-------|------|------------|
| `$app_installed` | First launch after install | `$version` |
| `$app_updated` | First launch after version change | `$version`, `$previous_version` |
| `$app_opened` | App became active (foreground) | - |
| `$app_backgrounded` | App resigned active (background) | - |

### macOS Lifecycle Event Behavior

On macOS, window focus changes happen frequently (Cmd-Tab, clicking other windows, etc.), which would generate excessive lifecycle events. To address this, the SDK applies debouncing on macOS:

- **`$app_backgrounded`**: Not tracked on macOS (focus changes are too frequent)
- **`$app_opened`**: Only tracked if the app was inactive for **at least 5 seconds**

This ensures you get meaningful "app opened" events when users return to your app after a meaningful absence, without noise from quick window switches.

> **Note:** Events are still flushed on every focus change regardless of debouncing, ensuring data is reliably sent to the server.

## Automatic Context

Every event automatically includes:

| Field | Example | Description |
|-------|---------|-------------|
| `platform` | `"ios"` | Platform (ios, macos, tvos, watchos, visionos) |
| `os_version` | `"17.1"` | Operating system version |
| `app_version` | `"1.0.0 (42)"` | App version with build number |
| `environment` | `"production"` | Environment from configuration |
| `session_id` | `"uuid..."` | Unique session ID (per app launch) |
| `user_id` | `"user_123"` | User ID (if set via `identify()`) |
| `$device_type` | `"phone"` | Device type (phone, tablet, desktop, tv, watch, vision) |
| `$device_model` | `"iPhone15,2"` | Device model identifier |

> **Note:** The `$` prefix indicates reserved system events and properties. Avoid using `$` prefix for your own custom events.

## Event Naming

Event names must:
- Start with a letter (or `$` for system events)
- Contain only alphanumeric characters, underscores, and spaces
- Be 255 characters or less

```swift
// Valid
MostlyGoodMetrics.track("button_clicked")
MostlyGoodMetrics.track("PurchaseCompleted")
MostlyGoodMetrics.track("step_1_completed")
MostlyGoodMetrics.track("User Signed Up")

// Invalid (will be ignored)
MostlyGoodMetrics.track("123_event")      // starts with number
MostlyGoodMetrics.track("event-name")     // contains hyphen
```

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

Events are automatically flushed periodically and when the app backgrounds. You can also trigger a manual flush:

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

## Privacy

The SDK never reads the IDFA and never triggers an App Tracking Transparency prompt, and it collects no location, contacts, or other sensitive data. `identify()` is optional — without it, users are tracked under a random, app-scoped anonymous ID (`$anon_...`) that is not derived from the device.

### Opt-out

```swift
MostlyGoodMetrics.optOut()   // stops all tracking immediately
MostlyGoodMetrics.optIn()    // resumes tracking

if MostlyGoodMetrics.isOptedOut {
    // hide analytics-related UI, etc.
}
```

While opted out, `track()`, `identify()`, and `flush()` are no-ops and any queued (unsent) events are purged. The choice is persisted and survives app relaunches.

For consent-first apps (e.g. GDPR), start opted out and only begin tracking after consent:

```swift
let config = MGMConfiguration(
    apiKey: "mgm_proj_your_api_key",
    optedOutByDefault: true // no events until optIn() is called
)
MostlyGoodMetrics.configure(with: config)

// Later, after the user grants consent:
MostlyGoodMetrics.optIn()
```

A persisted `optIn()`/`optOut()` choice always takes precedence over `optedOutByDefault` on subsequent launches.

### Rotating the anonymous ID

Rotate the persisted anonymous ID so future events can't be linked to earlier anonymous activity:

```swift
MostlyGoodMetrics.shared?.resetAnonymousId()
```

### Forget me

For a full local reset (e.g. account deletion):

```swift
MostlyGoodMetrics.shared?.reset(clearAnonymousId: true)
```

This clears the user ID, purges the pending event queue, clears super properties, starts a new session, and rotates the anonymous ID. With the default `clearAnonymousId: false`, the anonymous ID is kept.

### Limiting device properties

To minimize fingerprinting surface, disable device property collection:

```swift
let config = MGMConfiguration(
    apiKey: "mgm_proj_your_api_key",
    collectDeviceProperties: false
)
```

When `collectDeviceProperties` is `false`, events omit `$device_model`, `$device_type`, `device_manufacturer`, `locale`, and `timezone`. Functional context (`platform`, `os_version`, `app_version`) is still sent.

## Debug Logging

Enable debug logging to see SDK activity:

```swift
let config = MGMConfiguration(
    apiKey: "mgm_proj_your_api_key",
    enableDebugLogging: true
)
MostlyGoodMetrics.configure(with: config)
```

Output example:
```
[MostlyGoodMetrics] Initialized with 3 cached events
[MostlyGoodMetrics] Tracked event: button_clicked
[MostlyGoodMetrics] Flushing 4 events
[MostlyGoodMetrics] Successfully flushed 4 events
```

## Thread Safety

The SDK is fully thread-safe. You can call `track()` from any thread.
