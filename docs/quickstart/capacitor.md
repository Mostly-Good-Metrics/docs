---
sidebar_position: 6
title: Capacitor
---

# Capacitor Quickstart

From zero to your first event in about five minutes, for Capacitor hybrid apps on iOS, Android, and the web.

## 1. Get an API key

Sign up at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) and create a project. Copy the API key from the project's settings — it looks like `mgm_proj_xxxx`.

## 2. Install

```bash
npm install @mostly-good-metrics/capacitor
npm install @capacitor/core @capacitor/app @capacitor/device @capacitor/preferences
npx cap sync
```

Requires Capacitor 5+.

## 3. Initialize

Configure the SDK as early as possible in your app:

```typescript
import MostlyGoodMetrics from '@mostly-good-metrics/capacitor';

MostlyGoodMetrics.configure('mgm_proj_your_api_key', {
  appVersion: '1.0.0', // required for install/update tracking
});
```

## 4. Track your first event

```typescript
MostlyGoodMetrics.track('first_event', {
  source: 'quickstart',
});
```

Events are persisted via Capacitor Preferences, batched, and flushed automatically (every 30 seconds and when the app backgrounds).

## 5. Verify in the dashboard

Open your project at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) — `first_event` should appear within a few seconds of the SDK flushing. You can force it with `MostlyGoodMetrics.flush()`.

If nothing shows up:

- Enable debug logging: `MostlyGoodMetrics.configure('...', { enableDebugLogging: true })` and check the webview console
- Check that the API key matches the project you're looking at

## Next steps

- [Identify users](/guides/identifying-users) when they log in, so activity links to real users
- [Core Concepts](/concepts) — events, users, sessions, properties
- [Capacitor SDK reference](/sdks/capacitor) — all configuration options, super properties
- [Build your first insight](/features/insights)
