---
sidebar_position: 1
slug: /
title: Welcome
---

# Mostly Good Metrics

Simple analytics for products that ship.

No complex setup, no data warehouses, no SQL required. Drop in an SDK, track events, and understand how people use your app.

## Get to your first insight

Everything you need is in these docs — no sales call, no onboarding session.

### 1. Create a project

Sign up at [app.mostlygoodmetrics.com](https://app.mostlygoodmetrics.com), create a project, and copy its API key (`mgm_proj_xxxx`).

### 2. Send your first event

Pick your platform — each quickstart goes from install to a verified event in about five minutes:

| Platform | Quickstart |
|----------|-----------|
| Web (React, Next.js, Vue, plain JS) | [JavaScript](/quickstart/javascript) |
| iOS, macOS, tvOS, watchOS, visionOS | [Swift](/quickstart/swift) |
| Android | [Android](/quickstart/android) |
| React Native / Expo | [React Native](/quickstart/react-native) |
| Flutter | [Flutter](/quickstart/flutter) |
| Capacitor | [Capacitor](/quickstart/capacitor) |

No SDK for your platform? The [HTTP API](/api) is two endpoints — you can integrate with `curl`.

### 3. Identify your users

Call `identify()` on login so anonymous and logged-in activity count as one user. See [Identifying Users](/guides/identifying-users) and how identity works in [Core Concepts](/concepts#users-and-identity).

### 4. Build your first insight

Once events are flowing, the dashboard fills in on its own — event counts, active users, and platform breakdowns work with zero configuration. From there:

- [Insights](/features/insights) — saved queries and charts over any event
- [Funnels](/features/funnels) — where users drop off in multi-step flows
- [Retention](/features/retention) — cohort tables showing who comes back
- [Experiments](/features/experiments) — server-assigned A/B tests

## What the SDKs handle for you

- **Offline support** — events persist locally and sync when back online
- **Batching** — events are grouped for efficient network usage
- **Automatic retries** — failed requests are retried, without duplicating events
- **Lifecycle tracking** — installs, updates, and app opens are tracked automatically

## Learn more

- [Core Concepts](/concepts) — events, users, sessions, and properties
- [SDK references](/sdks/swift) — every option, for every platform
- [HTTP API](/api) — the wire format underneath it all
- [Using a Proxy](/guides/using-a-proxy) — get past ad blockers with a first-party domain
- [Agent skills](/integrations/agent-skills) — make MGM workflows discoverable in Codex, Claude Code, and compatible agents
