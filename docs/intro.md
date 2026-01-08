---
sidebar_position: 1
slug: /
title: Welcome
---

# Mostly Good Metrics

Simple analytics for products that ship.

No complex setup, no data warehouses, no SQL required. Just drop in an SDK and start understanding how people use your app.

---

## Get Started in 5 Minutes

### 1. Create a project

Sign up at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) and create a project. You'll get an API key that looks like `mgm_proj_xxxx`.

### 2. Install the SDK

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="swift" label="Swift" default>

```swift
// Package.swift
.package(url: "https://github.com/Mostly-Good-Metrics/mostly-good-metrics-swift-sdk", from: "0.6.0")
```

  </TabItem>
  <TabItem value="android" label="Android">

```kotlin
// build.gradle.kts
implementation("com.github.Mostly-Good-Metrics:mostly-good-metrics-android-sdk:0.2.5")
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
  mostly_good_metrics_flutter: ^0.2.4
```

  </TabItem>
  <TabItem value="capacitor" label="Capacitor">

```bash
npm install @mostly-good-metrics/capacitor
```

  </TabItem>
</Tabs>

### 3. Start tracking

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

That's it! Your events will appear in the [dashboard](https://app.mostlygoodmetrics.com) within seconds.

---

## What the SDKs handle for you

- **Offline support** — events persist locally and sync when back online
- **Batching** — events are grouped for efficient network usage
- **Automatic retries** — failed requests are retried automatically
- **Lifecycle tracking** — app opens, installs, and updates are tracked for you

---

## Learn more

- [SDK guides](/sdks/swift) — detailed docs for each platform
- [Tracking events](/guides/tracking-events) — best practices for event naming
- [Reserved events](/guides/reserved-events) — events tracked automatically
