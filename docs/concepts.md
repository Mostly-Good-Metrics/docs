---
sidebar_position: 3
title: Core Concepts
---

# Core Concepts

Four ideas cover most of how Mostly Good Metrics works: events, users, sessions, and properties. Understand these and everything else in the dashboard makes sense.

## Events

An event is a record of something that happened in your app: a button was clicked, a purchase completed, a screen was viewed. Every piece of analysis — dashboards, funnels, retention, experiments — is built from events.

```json
{
  "name": "purchase_completed",
  "user_id": "user_123",
  "timestamp": "2024-01-15T10:30:00Z",
  "properties": {
    "product_id": "SKU123",
    "price": 29.99
  }
}
```

Event names must start with a letter, contain only alphanumeric characters and underscores, and be 255 characters or less. We recommend `snake_case` (`purchase_completed`, not `Purchase Completed!`). See [Tracking Events](/guides/tracking-events) for naming patterns.

Events prefixed with `$` are **reserved events** tracked automatically by the SDKs — `$app_installed`, `$app_updated`, `$app_opened`, `$app_backgrounded`. Don't use the `$` prefix for your own events. See [Reserved Events](/guides/reserved-events).

## Users and identity

Every event carries a `user_id`. Where it comes from depends on whether you've identified the user:

1. **Anonymous ID** — on first launch, the SDK generates a UUID and persists it on the device. Until you call `identify()`, every event is tracked under this anonymous ID.
2. **Identified ID** — when a user logs in or signs up, call `identify('user_123')` with your own stable ID (a database ID or UUID, not an email address). Subsequent events use this ID.

### How anonymous and identified activity get linked

When you call `identify()`, the SDK sends a `$identify` event that includes the previous anonymous ID as `$anonymous_id`:

```json
{
  "name": "$identify",
  "user_id": "user_123",
  "properties": {
    "$anonymous_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

The backend records an alias linking the two IDs. From then on, events arriving under either ID are stored under the **canonical** (first-seen) ID, so:

- Pre-signup activity and post-signup activity count as one user, not two.
- Unique-user counts don't double-count people who signed up mid-session.
- Funnels can span the signup boundary (e.g. `page_viewed` while anonymous → `signup_completed` while identified).

Optional profile data passed to `identify()` (email, name) is upserted into the user's profile and shown in the dashboard's user explorer.

Call `resetIdentity()` on logout so the next user on the device doesn't inherit the previous identity.

## Sessions

Each SDK generates a session ID per app launch. On the web, a session continues
across reloads and client-side navigation and renews after 30 minutes of
inactivity. Every event carries that `session_id`; you never manage it yourself.
Sessions power visit counts, engagement, funnels, and the user explorer.

## Properties

Properties are key-value pairs that add context to an event. Values can be strings, numbers, booleans, nulls, arrays, or nested objects (max 3 levels deep, 10KB total per event; string values are truncated at 1000 characters).

### Custom properties

Anything you pass to `track()`:

```typescript
track('search_performed', { query: 'shoes', results: 42 });
```

### Automatic context

The SDKs attach context fields to every event without any code on your part: `platform`, `os_version`, `app_version`, `environment`, `session_id`, `locale`, and `timezone`. The server derives `country`, `region`, and `city` from the request IP.

### Reserved (`$`) properties

Properties prefixed with `$` are set by the SDKs or the server. Don't set them yourself:

| Property | Description |
|----------|-------------|
| `$version` | Current app version |
| `$previous_version` | Previous app version (on `$app_updated`) |
| `$device_type` | `phone`, `tablet`, `desktop`, `tv`, `watch`, `vision` |
| `$device_model` | Device model (e.g. `iPhone15,2`) |
| `$sdk` | SDK identifier (`javascript`, `swift`, `android`, ...) |
| `$source` | Event source (`sdk`, `revenuecat`, ...) |
| `$anonymous_id` | Previous anonymous ID, on `$identify` events |
| `$experiment_*` | Assigned experiment variants (see [Experiments](/features/experiments)) |

### Super properties

Some SDKs support **super properties** — properties you set once that are then attached to every subsequent event (e.g. `plan: 'premium'`). Useful for segment attributes you'd otherwise repeat on every `track()` call.

## Where events go

SDKs batch events locally (surviving offline periods and app restarts) and flush them to `POST /v1/events` on the ingestion API. Retrying a failed flush is safe — the server drops events it has already stored. You can also call the [HTTP API](/api) directly from a server or any platform without an SDK.

## Next steps

- [Quickstarts](/quickstart/javascript) — get your first event flowing
- [Insights](/features/insights), [Funnels](/features/funnels), [Retention](/features/retention) — turn events into answers
- [HTTP API reference](/api) — the wire format underneath the SDKs
