---
sidebar_position: 4
title: Goals
---

# Goals

Create and read goals on the management API. This is separate from the [ingestion API](/api): it uses your user access token, not a project API key, and it does not accept events.

**Base URL:** `https://api.mostlygoodmetrics.com/api/v2`

Log in with [`mgm login`](/cli) or the OAuth flow your client already uses, then send that token:

```
Authorization: Bearer <user access token>
```

Every route is scoped to a project you can access.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/projects/{project_id}/goals` | List goals with live progress |
| `POST` | `/projects/{project_id}/goals` | Create a goal and return its first snapshot |
| `GET` | `/projects/{project_id}/goals/{id}` | Read one goal |
| `PATCH` | `/projects/{project_id}/goals/{id}` | Replace the editable definition and return a new snapshot |
| `DELETE` | `/projects/{project_id}/goals/{id}` | Delete the goal definition |

The field reference for `source`, `target_type`, `target`, `window`, and `notify_on` is on the [Goals](/features/goals) page.

## Create a goal

```bash
curl -X POST "https://api.mostlygoodmetrics.com/api/v2/projects/PROJECT_UUID/goals" \
  -H "Authorization: Bearer $MGM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source": {"type": "event_count", "event_name": "purchase_completed"},
    "target_type": "reach",
    "target": 1000,
    "window": {"type": "deadline", "start_date": "2026-10-01", "deadline": "2026-10-31"},
    "notify_on": "both"
  }'
```

Create and update both require `source`, `target_type`, `target`, `window`, and `notify_on`.

`201 Created` returns the stored definition plus the values derived at read time. This example is day 10 of the window, October 10:

```json
{
  "goal": {
    "id": "GOAL_UUID",
    "project_id": "PROJECT_UUID",
    "source": { "type": "event_count", "event_name": "purchase_completed" },
    "target_type": "reach",
    "target": 1000.0,
    "window": { "type": "deadline", "start_date": "2026-10-01", "deadline": "2026-10-31" },
    "notify_on": "both",
    "current_value": 200.0,
    "percent_complete": 20.0,
    "pace_line": {
      "status": "behind",
      "actual_per_day": 20.0,
      "required_per_day": 38.1,
      "variance_percent": -38.0,
      "text": "38% behind — need +38.1/day"
    },
    "pace_line_text": "38% behind — need +38.1/day",
    "projected_finish": "2026-11-19",
    "milestone_crossings": [],
    "inserted_at": "2026-10-01T15:04:00Z",
    "updated_at": "2026-10-01T15:04:00Z"
  }
}
```

`pace_line.status` is one of `behind`, `on_pace`, `ahead`, `complete`, `open_ended`, `on_target`, `off_target`, `on_track`, or `broken`, depending on the target type. `pace_line_text` repeats `pace_line.text`. `milestone_crossings` lists the 25, 50, 75, or 100 marks crossed since the previous day. `projected_finish` is a date or `null`.

`GET` list returns `{ "goals": [ ... ] }` in newest-first order. `GET` one goal and `PATCH` return `{ "goal": { ... } }` in the same shape. `PATCH` takes the same five fields as create. The project cannot be changed.

`DELETE` returns `{ "deleted": true }`.

List and get evaluate every requested goal before responding. A definition that cannot be measured — an unknown source, a missing saved funnel, a retention day other than 1, 7, or 30 — fails the request instead of returning a stale number.

## Errors

```json
{ "error": "bad_request", "message": "window: must be a deadline, rolling, or open_ended definition" }
```

| Status | `error` | When |
| --- | --- | --- |
| `400` | `bad_request` | The definition is invalid, or the goal cannot be evaluated |
| `401` | `unauthorized` | The bearer token is missing, invalid, or expired |
| `403` | `forbidden` | The token cannot access this project |
| `404` | `not_found` | The project or goal does not exist |

A project API key (`mgm_proj_...`) does not authenticate this API. Use the user token from `mgm login`.
