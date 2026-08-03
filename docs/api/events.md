---
sidebar_position: 2
title: POST /v1/events
---

# POST /v1/events

Send one or more events. This is the endpoint every SDK talks to.

## Request

```bash
curl -X POST https://ingest.mostlygoodmetrics.com/v1/events \
  -H "Authorization: Bearer mgm_proj_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "name": "purchase_completed",
        "event_id": "550e8400-e29b-41d4-a716-446655440000",
        "user_id": "user_123",
        "session_id": "session_456",
        "timestamp": "2024-01-15T10:30:00Z",
        "properties": {
          "product_id": "SKU123",
          "price": 29.99
        }
      }
    ],
    "context": {
      "platform": "ios",
      "app_version": "1.2.0",
      "os_version": "17.1",
      "environment": "production"
    }
  }'
```

The body has two top-level keys:

- `events` (required) — an array of event objects.
- `context` (optional) — defaults applied to every event in the batch. Any per-event field (except `name`, `properties`, and `timestamp`) can be set here once instead of repeated per event.

## Event fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Event name. Non-empty, max 255 characters. |
| `event_id` | string | No | Client-generated unique ID for the event (also accepted as `client_event_id`). Stored with the event. |
| `user_id` | string | No | Your user identifier (or an anonymous ID). |
| `session_id` | string | No | Session identifier. |
| `timestamp` | string or int | No | ISO 8601 string, or unix seconds/milliseconds. Defaults to arrival time. Timestamps more than 48 hours in the future are clamped to now. |
| `properties` | object | No | Custom properties. Defaults to `{}`. |
| `platform` | string | No | `ios`, `android`, `web`, ... |
| `app_version` | string | No | App version. |
| `app_build_number` | string | No | Build number. |
| `os_version` | string | No | OS version. |
| `environment` | string | No | e.g. `production`, `development`. |
| `device_manufacturer` | string | No | Device manufacturer. |
| `locale` | string | No | e.g. `en-US`. |
| `timezone` | string | No | e.g. `America/Chicago`. |

Field names are also accepted in camelCase (`userId`, `sessionId`, `appVersion`, ...). Geolocation (`country`, `region`, `city`) is derived server-side from the request IP and cannot be set by the client.

## Responses

**Success — `204 No Content`** with an empty body. The batch was accepted.

**Errors:**

| Status | Body |
|--------|------|
| `400` | `{"error": "Invalid payload format"}` — body isn't `{"events": [...]}` |
| `400` | `{"error": "Validation failed", "details": [{"index": 0, "error": "event name is required"}]}` — if any event in the batch fails validation, the whole batch is rejected |
| `401` | `{"error": "Invalid or missing API key"}` |
| `403` | `{"error": "Request origin not allowed for this API key"}` |
| `429` | `{"error": "Rate limit exceeded", "retry_after": 12}` plus a `Retry-After` header — see [rate limits](/api#rate-limits) |

## Deduplication

Retrying a failed or timed-out request is safe. The server drops events it has already stored — an event is considered a duplicate when its `(name, user_id, timestamp)` matches an existing event in the project. Send a stable `event_id` per event and reuse the original `timestamp` on retries so retried events dedupe rather than double-count.

## Special events

Two `$`-prefixed events have server-side behavior:

- **`$identify`** — links an anonymous ID to a user ID and upserts profile data. Send `properties.$anonymous_id` with the previous anonymous ID, plus optional `email` and `name`:

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

  After linking, events sent under either ID are stored under the canonical (first-seen) ID. See [Core Concepts](/concepts#users-and-identity).

- **`$experiment_exposure`** — records that a user saw an experiment variant. See [GET /v1/experiments](/api/experiments).

## Compression

Payloads may be gzip-compressed with a `Content-Encoding: gzip` header. The SDKs do this automatically for bodies over 1KB.

## Optional metadata headers

SDKs send these for diagnostics; include them if you're building your own client:

| Header | Example |
|--------|---------|
| `X-MGM-SDK` | `javascript` |
| `X-MGM-SDK-Version` | `0.8.0` |
| `X-MGM-Platform` | `web` |
| `X-MGM-Platform-Version` | `17.1` |
| `X-MGM-Bundle-ID` | `com.example.app` (required if the API key restricts identifiers) |
