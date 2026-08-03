---
sidebar_position: 3
title: GET /v1/experiments
---

# GET /v1/experiments

Fetch experiment variant assignments for a user. The SDKs with experiment support ([JavaScript](/sdks/javascript), [Android](/sdks/android), [React Native](/sdks/react-native), [Flutter](/sdks/flutter)) call this for you — use it directly for server-side assignment or platforms without an SDK.

## Request

```bash
curl "https://ingest.mostlygoodmetrics.com/v1/experiments?user_id=user_123&anonymous_id=550e8400-..." \
  -H "Authorization: Bearer mgm_proj_your_api_key"
```

**Query parameters:**

| Parameter | Required | Description |
|-----------|----------|-------------|
| `user_id` | No | The user to assign variants for. |
| `anonymous_id` | No | The client's stored anonymous ID. Can be sent alone (pre-login) or together with `user_id`. |

When both are sent, the server links the two IDs (idempotently) **before** assigning, so a user who was bucketed while anonymous keeps the same variant after `identify()` instead of being re-bucketed. Always send the stored anonymous ID alongside `user_id` on the refetch after login.

## Responses

Always `200 OK`.

**With `user_id` and/or `anonymous_id`** — assigned variants per active experiment:

```json
{
  "assigned_variants": {
    "button-color": "a",
    "pricing-test": "control"
  }
}
```

Assignments are sticky: the same ID always gets the same variant for a running experiment.

**With no parameters** (legacy) — the list of active experiments and their variants:

```json
{
  "experiments": [
    { "id": "button-color", "variants": ["a", "b"] },
    { "id": "pricing-test", "variants": ["control", "low", "high"] }
  ]
}
```

**Errors:** `401` `{"error": "Invalid or missing API key"}`.

## Reporting exposure

For results to count, the server needs to know when a user actually experienced a variant. Send an exposure event via [`POST /v1/events`](/api/events) the first time your code acts on an assignment (once per experiment + variant per user):

```json
{
  "name": "$experiment_exposure",
  "user_id": "user_123",
  "properties": {
    "$experiment_name": "button-color",
    "$variant": "a"
  }
}
```

`$experiment_name` is the experiment name as returned by this endpoint (the snake_cased form is also accepted).

Optionally, also attach the assignment to every event as a super property, `$experiment_{snake_case(name)}: "variant"` (e.g. `$experiment_button_color: "a"`). The SDKs do both automatically.

See [Experiments](/features/experiments) for how enrollment and conversions are counted.
