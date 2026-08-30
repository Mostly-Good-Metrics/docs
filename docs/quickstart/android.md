---
sidebar_position: 3
title: Android
---

# Android Quickstart

From zero to your first event in about five minutes, for Android apps (Kotlin or Java).

## 1. Get an API key

Sign up at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) and create a project. Copy the API key from the project's settings — it looks like `mgm_proj_xxxx`.

## 2. Install

Add the JitPack repository to your `settings.gradle.kts`:

```kotlin
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
}
```

Then add the dependency:

```kotlin
dependencies {
    implementation("com.github.Mostly-Good-Metrics:mostly-good-metrics-android-sdk:0.6.0")
}
```

Requires Android SDK 21+ (Android 5.0) and Kotlin 1.9+.

## 3. Initialize

Configure the SDK once in your `Application` class:

```kotlin
import com.mostlygoodmetrics.sdk.MostlyGoodMetrics

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        MostlyGoodMetrics.configure(this, "mgm_proj_your_api_key")
    }
}
```

## 4. Track your first event

```kotlin
MostlyGoodMetrics.track("first_event", mapOf(
    "source" to "quickstart"
))
```

Events are persisted locally, batched, and flushed automatically (every 30 seconds and when the app backgrounds). The SDK also tracks `$app_installed` and `$app_opened` for you on launch.

## 5. Verify in the dashboard

Open your project at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) — `first_event` (and the automatic `$app_opened`) should appear within a few seconds of the SDK flushing. Backgrounding the app forces a flush.

If nothing shows up:

- Enable debug logging via `MGMConfiguration.Builder("...").enableDebugLogging(true)` and watch logcat
- Check that the API key matches the project you're looking at

## Next steps

- [Identify users](/guides/identifying-users) when they log in, so activity links to real users
- [Core Concepts](/concepts) — events, users, sessions, properties
- [Android SDK reference](/sdks/android) — all configuration options, Java interop
- [Build your first insight](/features/insights)
