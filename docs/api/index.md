---
sidebar_position: 1
title: Overview
---

# HTTP API

The SDKs are wrappers around a small HTTP API. If you're on a platform without an SDK — a backend service, a game engine, a CLI — you can call it directly.

**Base URL:** `https://ingest.mostlygoodmetrics.com`

| Endpoint | Purpose |
|----------|---------|
| [`POST /v1/events`](/api/events) | Send events |
| [`GET /v1/experiments`](/api/experiments) | Fetch experiment variant assignments |
| [`GET /v1/experiments/configs`](/api/experiments#get-v1experimentsconfigs) | Fetch experiment configs for local (on-device) enrollment |

## Authentication

Both endpoints authenticate with a project API key. Create keys in your project's settings in the [dashboard](https://app.mostlygoodmetrics.com).

```
Authorization: Bearer mgm_proj_your_api_key
```

The legacy `X-MGM-Key: mgm_proj_your_api_key` header is still supported, but prefer `Authorization: Bearer`.

If an API key is configured with an allowed-identifiers list, requests must also match it: browsers are checked against the `Origin` header, and mobile apps against an `X-MGM-Bundle-ID` header. Keys with no list configured accept requests from anywhere.

## Errors

Errors are JSON with an `error` message:

```json
{ "error": "Invalid or missing API key" }
```

| Status | Meaning |
|--------|---------|
| `400` | Malformed payload or failed validation |
| `401` | Invalid or missing API key |
| `403` | Request origin/bundle ID not allowed for this API key |
| `429` | Rate limited — retry after the `Retry-After` header (seconds) |
| `500` | Server error |

## Rate limits

Ingestion is rate limited per API key by **event count** (a batch of 50 events counts as 50), based on your organization's plan:

| Plan | Events/minute | Events/hour |
|------|---------------|-------------|
| Free | 1,000 | 10,000 |
| Starter | 10,000 | 100,000 |
| Pro | 100,000 | 1,000,000 |
| Enterprise | Unlimited | Unlimited |

A `429` response includes `retry_after` (seconds) in the body and a `Retry-After` header. The SDKs respect this automatically and keep events queued locally.

## CORS

The API sends `Access-Control-Allow-Origin: *`, so browser clients can call it directly — API keys used in browsers are visible to users, which is expected for client-side analytics. Use the allowed-identifiers list to pin a key to your domains.

## Management API

Management endpoints use `https://api.mostlygoodmetrics.com/api/v2` and a user
access token from `mgm login`. Project ingestion keys cannot call management
endpoints that require a signed-in user's permissions.

### Per-user export and erasure

Organization owners and admins can export or erase one end user's
alias-expanded project data:

| Endpoint | Purpose |
| --- | --- |
| `GET /projects/:project_id/users/export?user_id=:user_id&limit=:limit&cursor=:cursor` | Export events, profiles, and experiment assignments |
| `POST /projects/:project_id/users/erase` with `{"user_id":"account-id"}` | Erase the user's project data |

Export pages default to 500 events and accept a `limit` from 1–1,000. Continue
with the returned `pagination.next_cursor` while `pagination.has_more` is true.
Alias expansion is limited to 1,000 linked IDs; requests above that limit fail
instead of returning or deleting partial data.

Erasure returns `202 Accepted` after events, daily activity rows, profiles,
aliases, and experiment assignments are deleted from PostgreSQL and the
ClickHouse event-cleanup job is queued. The end-user ID is a filtered query or
body parameter, not a path segment, so normal request-line logs do not retain
it. See [Privacy & Data Controls](/features/privacy#per-user-export-and-erasure)
for dashboard, MCP, CLI, and data-retention details.

Goals are limited-preview management resources. Create and read them on the
[Goals API](/api/goals).
