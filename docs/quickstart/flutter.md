---
sidebar_position: 5
title: Flutter
---

# Flutter Quickstart

From zero to your first event in about five minutes, for Flutter apps on iOS, Android, web, macOS, Windows, and Linux.

## 1. Get an API key

Sign up at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) and create a project. Copy the API key from the project's settings — it looks like `mgm_proj_xxxx`.

## 2. Install

```bash
flutter pub add mostly_good_metrics_flutter
```

Or add it to your `pubspec.yaml`:

```yaml
dependencies:
  mostly_good_metrics_flutter: ^0.5.1
```

Requires Flutter 3.10+ and Dart 3.0+.

## 3. Initialize

Configure the SDK before `runApp`:

```dart
import 'package:flutter/material.dart';
import 'package:mostly_good_metrics_flutter/mostly_good_metrics_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await MostlyGoodMetrics.configure(
    MGMConfiguration(apiKey: 'mgm_proj_your_api_key'),
  );

  runApp(const MyApp());
}
```

## 4. Track your first event

```dart
MostlyGoodMetrics.track('first_event', properties: {
  'source': 'quickstart',
});
```

Events are persisted locally, batched, and flushed automatically (every 30 seconds and when the app backgrounds). The SDK also tracks `$app_installed` and `$app_opened` for you on launch.

## 5. Verify in the dashboard

Open your project at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) — `first_event` (and the automatic `$app_opened`) should appear within a few seconds of the SDK flushing. You can force it with `await MostlyGoodMetrics.flush()`.

If nothing shows up:

- Enable debug logging: `MGMConfiguration(apiKey: '...', enableDebugLogging: kDebugMode)` and watch the console
- Check that the API key matches the project you're looking at

## Next steps

- [Identify users](/guides/identifying-users) when they log in, so activity links to real users
- [Core Concepts](/concepts) — events, users, sessions, properties
- [Flutter SDK reference](/sdks/flutter) — all configuration options, error handling
- [Build your first insight](/features/insights)
