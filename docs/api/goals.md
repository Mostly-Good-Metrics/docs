---
sidebar_position: 4
title: Goals
---

# Goals API

Goals are in limited preview and are available only to organizations with the
`goals` feature enabled.

Create, follow, and read goals through the management API. This API uses a user
access token from `mgm login`, not a project API key.

**Base URL:** `https://api.mostlygoodmetrics.com/api/v2`

```http
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: application/json
```

## Routes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/projects/{project_id}/goals` | List stored goal definitions |
| `GET` | `/projects/{project_id}/goals?snapshots=true` | List bounded live snapshots |
| `POST` | `/projects/{project_id}/goals` | Create a goal |
| `GET` | `/projects/{project_id}/goals/{id}` | Get one stored definition |
| `PATCH` | `/projects/{project_id}/goals/{id}` | Update the provided fields |
| `DELETE` | `/projects/{project_id}/goals/{id}` | Delete a goal |
| `GET` | `/projects/{project_id}/goals/{id}/snapshot` | Get one live snapshot |
| `POST` | `/projects/{project_id}/goals/{id}/follow` | Follow a goal |
| `DELETE` | `/projects/{project_id}/goals/{id}/follow` | Unfollow a goal |

## Definition

A stored goal has `name`, `source`, `window`, `shape`, `goal`, optional
`starts_on` and `ends_on` dates, and `enabled`. The `goal` object depends on
the selected shape:

```json
{ "shape": "reach", "goal": { "value": 10000 } }
{ "shape": "growth", "goal": { "percent": 20 } }
{ "shape": "streak", "goal": { "days": 7, "operator": "gte", "value": 100 } }
{ "shape": "threshold", "goal": { "operator": "lte", "value": 2 } }
```

Operators are `gte`, `lte`, `gt`, and `lt`. Windows use one of these shapes:

```json
{ "type": "deadline", "start_date": "2026-10-01", "deadline": "2026-10-31" }
{ "type": "rolling", "days": 30 }
{ "type": "open_ended", "start_date": "2026-10-01" }
```

A threshold must have an end. Use a deadline, or use an open-ended window with
`ends_on`. A rolling threshold is an Alert and is rejected with `422`.

### Create example

```bash
curl -X POST "https://api.mostlygoodmetrics.com/api/v2/projects/PROJECT_UUID/goals" \
  -H "Authorization: Bearer $MGM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Reach 1,000 purchases",
    "source": {"type": "event_count", "event_name": "purchase_completed"},
    "window": {"type": "deadline", "start_date": "2026-10-01", "deadline": "2026-10-31"},
    "shape": "reach",
    "goal": {"value": 1000},
    "enabled": true
  }'
```

Create returns `201` with a `goal` key. List returns a `goals` array, and get
and update return a `goal` key. Definitions include `following`, scoped to the
calling user, and `reached_on`, which is an ISO 8601 date or `null`.
Delete returns `200` with `{ "deleted": true }`.

```json
{
  "goal": {
    "id": "GOAL_UUID",
    "name": "Reach 1,000 purchases",
    "source": { "type": "event_count", "event_name": "purchase_completed" },
    "window": { "type": "deadline", "start_date": "2026-10-01", "deadline": "2026-10-31" },
    "shape": "reach",
    "goal": { "value": 1000 },
    "starts_on": null,
    "ends_on": null,
    "enabled": true,
    "following": true,
    "reached_on": null,
    "description": "Reach 1,000 event count by 2026-10-31",
    "inserted_at": "2026-10-01T12:00:00Z",
    "updated_at": "2026-10-01T12:00:00Z"
  }
}
```

## Snapshots

`GET /goals?snapshots=true` returns snapshots under `goals`. The single
snapshot route returns a `snapshot` object. Every snapshot uses `goal_id` for
identity and can include:

- `name`, `shape`, and `enabled`
- `value`, `baseline`, `progress`, and `pace`
- `projected_finish`, `status`, and `milestones`
- `as_of`, `availability`, and `unavailable_reason`

One list request has a shared evaluation budget. Completed snapshots remain in
the response if another evaluation fails or times out. Those rows use
`availability: "unavailable"` or `"timeout"`. Missing identity totals are not
reported as zero, growth has no percentage without a positive baseline, and a
projected finish date may be `null` when it would be misleading.

```json
{
  "snapshot": {
    "goal_id": "GOAL_UUID",
    "name": "Reach 1,000 purchases",
    "shape": "reach",
    "enabled": true,
    "value": 420,
    "baseline": 100,
    "progress": 42,
    "pace": { "actual_per_day": 42, "required_per_day": 100, "variance_percent": -58 },
    "projected_finish": {
      "date": "2026-10-24",
      "assumption": {
        "method": "linear_run_rate",
        "window": { "starts_on": "2026-10-01", "ends_on": "2026-10-10" }
      }
    },
    "status": "behind",
    "milestones": { "reached": [25], "crossed": [] },
    "as_of": "2026-10-10",
    "availability": "available",
    "unavailable_reason": null
  }
}
```

For an available snapshot, `projected_finish` is an object with `date` and
`assumption`; `date` can be `null` when MGM cannot make an honest projection.

## Following

Creating a goal follows it for the creator. Follow and unfollow are idempotent:

```json
{ "following": true }
{ "following": false }
```

Followers receive the one-time `goal_reached` notification according to their
email and in-app preferences. Following does not subscribe the rest of the
organization.

## Errors and project isolation

Every route resolves the authenticated project before the goal. An
inaccessible project or a goal from another project returns `404`. Invalid
definitions return `422` with field errors under `details`.

When Goals are unavailable for the organization, every route returns `403`:

```json
{ "error": "feature_disabled", "feature": "goals" }
```

A project API key (`mgm_proj_...`) does not authenticate this API.
