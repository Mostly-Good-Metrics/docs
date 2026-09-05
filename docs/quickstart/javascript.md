---
sidebar_position: 1
title: JavaScript
---

# JavaScript Quickstart

From zero to your first event in about five minutes, for any web app (React, Next.js, Vue, or plain JavaScript).

## 1. Get an API key

Sign up at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) and create a project. Copy the API key from the project's settings — it looks like `mgm_proj_xxxx`.

## 2. Install

```bash
npm install @mostly-good-metrics/javascript
```

## 3. Initialize

Configure the SDK once, as early as possible in your app's startup:

```typescript
import { MostlyGoodMetrics } from '@mostly-good-metrics/javascript';

MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
  trackPageViews: true, // Optional: unlock the Web Analytics overview
});
```

In Next.js and other SSR frameworks, run this only in the browser (`typeof window !== 'undefined'`). See the [JavaScript SDK reference](/sdks/javascript#framework-integration) for React, Next.js, and Vue setup patterns.

## 4. Track your first event

With `trackPageViews: true`, MGM is already capturing website traffic. Add
product events for the actions that matter to your business:

```typescript
MostlyGoodMetrics.track('first_event', {
  source: 'quickstart',
});
```

Events are batched and flushed automatically (every 30 seconds by default, and on page hide).

## 5. Verify in the dashboard

Open your project at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com) — `first_event` should appear within a few seconds of the SDK flushing.

If nothing shows up:

- Enable debug logging to watch the SDK work: `MostlyGoodMetrics.configure({ apiKey: '...', enableDebugLogging: true })`
- Check that the API key matches the project you're looking at
- Ad blockers can block analytics requests — see [Using a Proxy](/guides/using-a-proxy)

## Next steps

- [Identify users](/guides/identifying-users) when they log in, so activity links to real users
- [Core Concepts](/concepts) — events, users, sessions, properties
- [JavaScript SDK reference](/sdks/javascript) — all configuration options
- [Build your first insight](/features/insights)
