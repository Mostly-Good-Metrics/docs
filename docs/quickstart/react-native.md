---
sidebar_position: 4
title: React Native
---

# React Native Quickstart

From zero to your first event in about five minutes, for React Native apps (Expo or bare).

## 1. Get an API key

Sign up at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) and create a project. Copy the API key from the project's settings — it looks like `mgm_proj_xxxx`.

## 2. Install

**Expo** (AsyncStorage is included):

```bash
npm install @mostly-good-metrics/react-native
```

**Bare React Native:**

```bash
npm install @mostly-good-metrics/react-native @react-native-async-storage/async-storage
cd ios && pod install
```

Requires React Native 0.71+ (Expo SDK 49+).

## 3. Initialize

Configure the SDK once at app startup (e.g. in your root component or entry file):

```typescript
import MostlyGoodMetrics from '@mostly-good-metrics/react-native';
import Constants from 'expo-constants';

MostlyGoodMetrics.configure('mgm_proj_your_api_key', {
  appVersion: Constants.expoConfig?.version, // or your app version string
});
```

`appVersion` is optional but required for automatic `$app_installed` / `$app_updated` tracking.

## 4. Track your first event

```typescript
MostlyGoodMetrics.track('first_event', {
  source: 'quickstart',
});
```

Events are persisted in AsyncStorage, batched, and flushed automatically (every 30 seconds and when the app backgrounds).

## 5. Verify in the dashboard

Open your project at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) — `first_event` should appear within a few seconds of the SDK flushing. You can force it with `MostlyGoodMetrics.flush()`.

If nothing shows up:

- Enable debug logging: `MostlyGoodMetrics.configure('...', { enableDebugLogging: __DEV__ })` and watch the Metro console
- Check that the API key matches the project you're looking at

## Next steps

- [Identify users](/guides/identifying-users) when they log in, so activity links to real users
- [Core Concepts](/concepts) — events, users, sessions, properties
- [React Native SDK reference](/sdks/react-native) — all configuration options
- [Build your first insight](/features/insights)
