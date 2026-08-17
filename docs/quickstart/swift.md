---
sidebar_position: 2
title: Swift
---

# Swift Quickstart

From zero to your first event in about five minutes, for iOS, macOS, tvOS, watchOS, and visionOS apps.

## 1. Get an API key

Sign up at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) and create a project. Copy the API key from the project's settings — it looks like `mgm_proj_xxxx`.

## 2. Install

In Xcode: **File > Add Package Dependencies** and enter:

```
https://github.com/Mostly-Good-Metrics/mostly-good-metrics-swift-sdk
```

Or add it to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/Mostly-Good-Metrics/mostly-good-metrics-swift-sdk", from: "0.9.0")
]
```

Requires iOS 14+ / macOS 11+ / tvOS 14+ / watchOS 7+ and Swift 5.9+.

## 3. Initialize

Configure the SDK once at app launch:

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

Using UIKit? Call `configure` in `application(_:didFinishLaunchingWithOptions:)` instead.

## 4. Track your first event

```swift
MostlyGoodMetrics.track("first_event", properties: [
    "source": "quickstart"
])
```

Events are persisted to disk, batched, and flushed automatically (every 30 seconds and when the app backgrounds). The SDK also tracks `$app_installed` and `$app_opened` for you on launch, so you'll see events even before your first `track` call.

## 5. Verify in the dashboard

Open your project at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) — `first_event` (and the automatic `$app_opened`) should appear within a few seconds of the SDK flushing. Backgrounding the app forces a flush.

If nothing shows up:

- Enable debug logging: `MostlyGoodMetrics.configure(with: MGMConfiguration(apiKey: "...", enableDebugLogging: true))` and watch the Xcode console
- Check that the API key matches the project you're looking at

## Next steps

- [Identify users](/guides/identifying-users) when they log in, so activity links to real users
- [Core Concepts](/concepts) — events, users, sessions, properties
- [Swift SDK reference](/sdks/swift) — all configuration options
- [Build your first insight](/features/insights)
