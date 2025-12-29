---
sidebar_position: 1
slug: /
---

# Getting Started

Drop in an SDK, track events, and see funnels and retention without extra setup.

## Quick Start

### 1. Get Your API Key

Sign up at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) and create a project. Your API key will look like `mgm_proj_xxxx`.

### 2. Install an SDK

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="swift" label="Swift" default>

```swift
// Package.swift
.package(url: "https://github.com/Mostly-Good-Metrics/mostly-good-metrics-swift-sdk", from: "1.0.0")
```

  </TabItem>
  <TabItem value="android" label="Android">

```kotlin
// build.gradle.kts
implementation("com.github.Mostly-Good-Metrics:mostly-good-metrics-android-sdk:1.0.0")
```

  </TabItem>
  <TabItem value="react-native" label="React Native">

```bash
npm install @mostly-good-metrics/react-native
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```bash
npm install @mostly-good-metrics/javascript
```

  </TabItem>
  <TabItem value="flutter" label="Flutter">

```yaml
# pubspec.yaml
dependencies:
  mostly_good_metrics_flutter: ^0.1.0
```

  </TabItem>
  <TabItem value="capacitor" label="Capacitor">

```bash
npm install @mostly-good-metrics/capacitor
```

  </TabItem>
</Tabs>

### 3. Initialize and Track

<Tabs>
  <TabItem value="swift" label="Swift" default>

```swift
import MostlyGoodMetrics

// Initialize once at app launch
MostlyGoodMetrics.configure(apiKey: "mgm_proj_your_api_key")

// Track events
MostlyGoodMetrics.track("button_clicked")
MostlyGoodMetrics.track("purchase_completed", properties: [
    "product_id": "SKU123",
    "price": 29.99
])

// Identify users
MostlyGoodMetrics.identify(userId: "user_123")
```

  </TabItem>
  <TabItem value="android" label="Android">

```kotlin
import com.mostlygoodmetrics.sdk.MostlyGoodMetrics

// Initialize once in Application class
MostlyGoodMetrics.configure(this, "mgm_proj_your_api_key")

// Track events
MostlyGoodMetrics.track("button_clicked")
MostlyGoodMetrics.track("purchase_completed", mapOf(
    "product_id" to "SKU123",
    "price" to 29.99
))

// Identify users
MostlyGoodMetrics.identify("user_123")
```

  </TabItem>
  <TabItem value="react-native" label="React Native">

```typescript
import MostlyGoodMetrics from '@mostly-good-metrics/react-native';

// Initialize once at app startup
MostlyGoodMetrics.configure('mgm_proj_your_api_key');

// Track events
MostlyGoodMetrics.track('button_clicked');
MostlyGoodMetrics.track('purchase_completed', {
  product_id: 'SKU123',
  price: 29.99,
});

// Identify users
MostlyGoodMetrics.identify('user_123');
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```typescript
import { MostlyGoodMetrics } from '@mostly-good-metrics/javascript';

// Initialize once at app startup
MostlyGoodMetrics.configure({ apiKey: 'mgm_proj_your_api_key' });

// Track events
MostlyGoodMetrics.track('button_clicked');
MostlyGoodMetrics.track('purchase_completed', {
  product_id: 'SKU123',
  price: 29.99,
});

// Identify users
MostlyGoodMetrics.identify('user_123');
```

  </TabItem>
  <TabItem value="flutter" label="Flutter">

```dart
import 'package:mostly_good_metrics_flutter/mostly_good_metrics_flutter.dart';

// Initialize once at app startup
await MostlyGoodMetrics.configure(
  MGMConfiguration(apiKey: 'mgm_proj_your_api_key'),
);

// Track events
MostlyGoodMetrics.track('button_clicked');
MostlyGoodMetrics.track('purchase_completed', properties: {
  'product_id': 'SKU123',
  'price': 29.99,
});

// Identify users
await MostlyGoodMetrics.identify('user_123');
```

  </TabItem>
  <TabItem value="capacitor" label="Capacitor">

```typescript
import MostlyGoodMetrics from '@mostly-good-metrics/capacitor';

// Initialize once at app startup
MostlyGoodMetrics.configure('mgm_proj_your_api_key', {
  appVersion: '1.0.0',
});

// Track events
MostlyGoodMetrics.track('button_clicked');
MostlyGoodMetrics.track('purchase_completed', {
  product_id: 'SKU123',
  price: 29.99,
});

// Identify users
MostlyGoodMetrics.identify('user_123');
```

  </TabItem>
</Tabs>

That's it! Events are automatically batched and sent. View them in your [dashboard](https://app.mostlygoodmetrics.com).

## What Happens Automatically

All SDKs automatically:

- **Persist events** locally, surviving app restarts
- **Batch events** for efficient network usage
- **Flush on interval** (default: every 30 seconds)
- **Flush on background** when the app goes to background
- **Retry on failure** for network errors
- **Track lifecycle events** like app open, install, and update

## Next Steps

- Read the [SDK documentation](/sdks/swift) for your platform
- Learn about [tracking events](/guides/tracking-events)
- Understand [reserved events](/guides/reserved-events) that are tracked automatically
