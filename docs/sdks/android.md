---
sidebar_position: 2
---

# Android SDK

A lightweight Android SDK for tracking analytics events.

## Requirements

- Android SDK 21+ (Android 5.0 Lollipop)
- Kotlin 1.9+

## Installation

### Gradle (Kotlin DSL)

```kotlin
dependencies {
    implementation("com.github.Mostly-Good-Metrics:mostly-good-metrics-android-sdk:0.2.4")
}
```

Add JitPack repository to your `settings.gradle.kts`:

```kotlin
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
}
```

## Quick Start

### Initialize

Initialize once in your `Application` class:

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        MostlyGoodMetrics.configure(this, "mgm_proj_your_api_key")
    }
}
```

### Track Events

```kotlin
// Simple event
MostlyGoodMetrics.track("button_clicked")

// Event with properties
MostlyGoodMetrics.track("purchase_completed", mapOf(
    "product_id" to "SKU123",
    "price" to 29.99,
    "currency" to "USD"
))
```

### Identify Users

```kotlin
// Set user identity
MostlyGoodMetrics.identify("user_123")

// Reset identity (e.g., on logout)
MostlyGoodMetrics.resetIdentity()
```

## Configuration Options

```kotlin
val config = MGMConfiguration.Builder("mgm_proj_your_api_key")
    .baseUrl("https://mostlygoodmetrics.com")
    .environment("production")
    .maxBatchSize(100)
    .flushIntervalSeconds(30)
    .maxStoredEvents(10000)
    .enableDebugLogging(BuildConfig.DEBUG)
    .trackAppLifecycleEvents(true)
    .build()

MostlyGoodMetrics.configure(this, config)
```

| Option | Default | Description |
|--------|---------|-------------|
| `apiKey` | Required | Your API key |
| `baseUrl` | `https://mostlygoodmetrics.com` | API endpoint |
| `environment` | `"production"` | Environment name |
| `maxBatchSize` | `100` | Events per batch (1-1000) |
| `flushIntervalSeconds` | `30` | Auto-flush interval |
| `maxStoredEvents` | `10000` | Max cached events |
| `enableDebugLogging` | `false` | Enable logcat output |
| `trackAppLifecycleEvents` | `true` | Auto-track lifecycle events |

## Automatic Events

| Event | When | Properties |
|-------|------|------------|
| `$app_installed` | First launch after install | `$version` |
| `$app_updated` | First launch after version change | `$version`, `$previous_version` |
| `$app_opened` | App became active (foreground) | - |
| `$app_backgrounded` | App resigned active (background) | - |

## Automatic Context

Every event automatically includes:

| Field | Example | Description |
|-------|---------|-------------|
| `platform` | `"android"` | Platform |
| `os_version` | `"14"` | Android version |
| `app_version` | `"1.0.0 (42)"` | App version with build number |
| `session_id` | `"uuid..."` | Unique session ID |
| `user_id` | `"user_123"` | User ID (if set) |
| `$device_type` | `"phone"` | Device type (phone, tablet, tv, watch) |
| `$device_model` | `"Pixel 8"` | Device model |

## Java Interop

```java
// Initialize
MostlyGoodMetrics.configure(context, "mgm_proj_your_api_key");

// Track
Map<String, Object> props = new HashMap<>();
props.put("button_name", "submit");
MostlyGoodMetrics.track("button_clicked", props);

// Identify
MostlyGoodMetrics.identify("user_123");
```

## ProGuard / R8

The SDK includes consumer ProGuard rules. No additional configuration needed.
