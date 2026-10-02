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
- [Migrating an Existing App](#migrating-an-existing-app)
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

Use Swift SDK **1.0.1 or later** for the bounded property, storage, and network failure handling described below. Swift 1.0.0 introduced the actor contracts covered in the migration guidance.

### Swift Package Manager

Add to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/Mostly-Good-Metrics/mostly-good-metrics-swift-sdk", from: "1.0.1")
]
```

Or in Xcode: **File > Add Package Dependencies**, enter the repository URL, and select **Up to Next Major Version** starting at **1.0.1**.

### CocoaPods

Install 1.0.1 from its Git tag:

```ruby
pod 'MostlyGoodMetrics',
    :git => 'https://github.com/Mostly-Good-Metrics/mostly-good-metrics-swift-sdk.git',
    :tag => '1.0.1'
```

Then run `pod install`. The release workflow does not publish to the CocoaPods
registry; a registry version requirement alone will not fetch this release.
See the [CocoaPods Git dependency guide](https://guides.cocoapods.org/using/the-podfile.html#from-a-podspec-in-the-root-of-a-library-repo).

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
| `existingInstallation` | `false` | Establish lifecycle state without a migration-time `$app_installed` |
| `contextProvider` | `nil` | Dynamic properties evaluated for each captured event |
| `optedOutByDefault` | `false` | Start opted out until `optIn()` is called ([Privacy](#privacy)) |
| `collectDeviceProperties` | `true` | Collect device model/type, manufacturer, locale, timezone |

## Migrating an Existing App

For an app that was already released before MGM was added, derive
`existingInstallation` from the previous provider's persisted installation
marker. This prevents existing users from being counted as fresh installs
without suppressing genuine new installations:

```swift
let config = MGMConfiguration(
    apiKey: "mgm_proj_your_api_key",
    existingInstallation: legacyAnalytics.hasInstallationMarker()
)
MostlyGoodMetrics.configure(with: config)
```

On MGM's first launch, this establishes the current version as the lifecycle
baseline without emitting `$app_installed`. Later version changes still emit
`$app_updated`. Do not set `existingInstallation: true` for every user: retire
the legacy marker only after the migration window has passed.

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

### Dynamic global properties

`contextProvider` is a synchronous `@Sendable` callback. It runs on whichever
executor calls `track()`, including background execution, and may be called
concurrently. Capture immutable Sendable values or read a synchronized store;
do not directly read SwiftUI or other actor-isolated state. Return value
snapshots rather than shared mutable objects.

Read actor-isolated values before creating the provider:

```swift
@MainActor
func configureAnalytics(organizationID: String, buildChannel: String) {
    let config = MGMConfiguration(
        apiKey: "mgm_proj_your_api_key",
        contextProvider: { @Sendable in
            ["organization_id": organizationID, "build_channel": buildChannel]
        }
    )
    MostlyGoodMetrics.configure(with: config)
}
```

These snapshots retain their initial values. For UI values that change during a
session, update super properties from the actor that owns that state and leave
those keys out of the provider; provider values override super properties.
Alternatively, use a synchronized Sendable store to return current snapshots.
The provider cannot asynchronously fetch main-actor state for the current event.
Its returned values are evaluated per event and are not persisted as super properties.

#### Swift 6 migration

When upgrading from `0.x`, raise the Swift Package Manager requirement to
`from: "1.0.1"`; a requirement starting at `0.x` does not include the new major
version. CocoaPods users should update the Git tag shown above.

SDK versions through `0.11.0` do not enforce this callback contract. The explicit
`@Sendable` closure above is the immediate workaround for those versions and also
works with SDK 1.0.0. SDK 1.0.0 requires `@Sendable` on both the
configuration property and initializer parameter. Existing provider variables
may need the explicit type `@Sendable () -> [String: Any]`, and unsafe captures
may now produce compiler errors. Replace those captures with immutable typed
values or genuinely synchronized state. A captured `[String: Any]` dictionary
is not itself Sendable.

`@Sendable` does not synchronize mutable captures. Suppressing concurrency
diagnostics or wrapping `track()` in `do/catch` cannot prevent an executor
assertion from terminating the app.

Collision precedence is: persisted super properties < dynamic context < event
properties < MGM system properties. `$`-prefixed keys are reserved for MGM. In
DEBUG builds, MGM prints a validation warning for invalid event names and custom
property keys using that prefix.

## Manual Flush

SDK 1.0.0 accepts `MGMFlushCompletion`, defined as
`@MainActor @Sendable (Result<Void, MGMError>) -> Void`. It delivers results
asynchronously on the main actor on every completion path. Event storage and
network work remain in the background. Inline completions can update main-actor
UI state; existing completion variables may need the `MGMFlushCompletion` type.
To update another actor, create a task that calls that actor from inside the
completion. Do not pass a closure isolated to that other actor directly.

Events are automatically flushed periodically and when the app backgrounds. You can also trigger a manual flush:

```swift
MostlyGoodMetrics.shared?.flush { @Sendable result in
    Task { @MainActor in
        switch result {
        case .success:
            print("Events flushed successfully")
        case .failure(let error):
            print("Flush failed: \(error.localizedDescription)")
        }
        // Update UI state here.
    }
}
```

The explicit `@Sendable` callback and `Task { @MainActor in ... }` also support
SDK versions through `0.11.0`, which may invoke flush completions on a background
queue. Without that boundary, a callback created in a main-actor context can
inherit its isolation and crash when invoked off the main actor. Keep UI access
inside the main-actor task.


Event values are copied before the SDK retains them. Nested values, cyclic
Foundation containers and total property size are bounded, and reentrant
tracking from a context provider does not repeatedly invoke that provider.
Do not mutate a collection concurrently while passing it to the SDK.

Built-in event stores enforce a 1 MiB estimated retained-data ceiling and a
4 MiB budget for pending event admission, in addition to `maxStoredEvents`.
Events can be dropped under pressure, so this count is an upper limit rather
than a retention guarantee. Oversized or deeply nested persisted JSON is
discarded before parsing. The built-in transport bounds response bodies to
1 MiB and limits concurrent requests; storage writes and automatic batch
flush requests are coalesced during bursts. These limits protect the host
while analytics delivery remains best effort.

## Privacy

The SDK never reads the IDFA and never triggers an App Tracking Transparency prompt, and it collects no location, contacts, or other sensitive data. `identify()` is optional — without it, users are tracked under a random, app-scoped anonymous ID (`$anon_...`) that is not derived from the device.

Swift SDK 1.0.0 and later bundle an Apple privacy manifest with both Swift Package Manager and CocoaPods; no extra MGM manifest setup is needed. See [Apple privacy manifests and App Store labels](/features/privacy#apple-privacy-manifests-and-app-store-labels) for the declarations and your app's privacy-label answers.

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

You can call `track()` from background execution when provider captures and
event properties are safe for those callers. Configure the shared instance once
at app startup before other SDK calls; do not reconfigure it concurrently.
Providers must support concurrent calls and must not directly read actor-isolated
UI state. See the Swift 6 migration guidance above.
