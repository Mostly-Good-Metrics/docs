---
sidebar_position: 5
---

# Goals

A goal is a target you can follow: a number, a rate, or a streak, with a pace line that says whether you are on track.

Goals do not change what the SDKs send. They read the events, funnels, retention, revenue, and saved queries you already have, and they compute progress when you open them.

## What a goal is

A goal stores only its definition:

- **Source** — what is being measured
- **Target type** — the shape of the goal
- **Target** — the number you are aiming at
- **Window** — a deadline, a rolling period, or an open-ended start date
- **Notifications** — when to alert you: `milestone`, `off_pace`, `both` (the default), or `off`

Current value, percent complete, pace, projected finish, and milestone crossings are calculated on read. They are not saved, so a goal always reflects the latest analytics.

A pace line compares how fast the metric is moving with how fast it needs to move. A reach goal that is behind reads like `12% behind — need +40/day`. That line is also what dashboard goal widgets, the iOS app, and Home Screen widgets show.

## Target types

| Type | You are asking | Target means |
| --- | --- | --- |
| `reach` | Will I hit N? | The number to hit. With a deadline, pace is the daily rate required to get there. Without one, the line is how much is left. |
| `threshold` | Am I staying on the right side of X? | The floor or ceiling. Direction comes from the source condition (`above` by default, or `below`). On target is 100%. |
| `growth` | Am I growing N%? | The percent to grow versus the previous window of the same length. The live value is that growth percent, not the raw metric. |
| `streak` | Can I keep this true for N days? | The number of consecutive days. Each day counts when the source condition is met. A miss resets the streak. |

Percent complete moves through 25%, 50%, 75%, and 100%. A read reports the milestones crossed since the previous day. Projected finish is a straight-line estimate from the current run rate. If the metric is not moving toward the target, the projection is empty.

For a threshold, set direction on the source:

```json
"condition": { "operator": "below", "value": 1 }
```

`operator` accepts `above`, `gte`, `>=`, `gt`, `>`, `below`, `lte`, `<=`, `lt`, and `<`. Threshold compares the live value with `target` and uses `condition` only for the direction. Streak uses both `operator` and `value` to decide whether each day counts. A streak without a condition counts a day only when the source value is boolean `true`, so numeric streaks need a condition.

## Sources

| Source | Measures | Required config |
| --- | --- | --- |
| `event_count` | How many times an event happened in the window | `event_name` to count one event. Omit it to count every event. |
| `unique_users` | Distinct users in the window | None. Optional `filters` narrow the users. |
| `funnel_conversion` | End-to-end conversion rate of a funnel, as a percent | `saved_funnel_id`, or an inline `definition` with the same shape as a saved funnel |
| `retention` | Average D1, D7, or D30 retention, as a percent | `day` (`1`, `7`, or `30`; default `7`) plus `saved_retention_id` or an inline `definition` |
| `revenue` | Sum of RevenueCat purchase prices | Optional `currency` (default `USD`). Uses `$purchase` events from the [RevenueCat integration](/integrations/revenuecat). |
| `saved_query` | One number from a saved insight | `saved_query_id`. Optional `aggregation` is `sum`, `average`, or omitted to take the last numeric point. Optional `result_path` is a list of keys into a nested result. |

`event_count` and `unique_users` accept a `filters` object with `platforms`, `app_version`, `environment`, and `event_names`.

```json
{
  "type": "event_count",
  "event_name": "purchase_completed",
  "filters": { "environment": "production" }
}
```

## Windows

```json
{ "type": "deadline", "start_date": "2026-10-01", "deadline": "2026-10-31" }
{ "type": "rolling", "days": 30 }
{ "type": "open_ended", "start_date": "2026-10-01" }
```

Dates are `YYYY-MM-DD`. A deadline's start is on or before its end. A rolling window is the last N days, including today, and accepts 1 through 3,650 days. An open-ended window runs from the start date forward and has no required daily rate.

## Create a goal

### Web

Open **Goals** in the project (`/organizations/{org}/projects/{project}/goals`) and choose **New goal**. The drawer asks three things:

- **What?** — Unique users, Tracked events, or Revenue
- **How much?** — a number greater than zero
- **By when?** — today or a later date

That creates a `reach` goal with a deadline that starts today. Tracked events counts every event in the project, and Revenue is USD. Add an individual goal to the project dashboard from **Edit dashboard → Goal**. The Goals page has the full value, target, projected finish, and actual-versus-required pace chart. Edit and delete are on that page. Deleting a goal also removes its dashboard widget, but never deletes events.

The drawer does not cover every source or target type. Use the CLI, MCP, or API for a single event, a funnel, retention, a saved query, a rolling window, or a threshold, growth, or streak goal. Editing one of those goals on the web keeps its source as **Current metric** and still edits the number and deadline.

### iOS

The iOS app shows goals you have already created. Home includes a goals rail, and a goal opens to its current value, target, pace, and projected finish. Small and medium Home Screen widgets show the same live status for a project, including when the phone is offline after a refresh.

Create and edit goals on the web or with the CLI, MCP, or API. The app reads the project's goals from the [Goals API](/api/goals).

### CLI

```bash
mgm goals create \
  --source '{"type":"event_count","event_name":"purchase_completed"}' \
  --target-type reach \
  --target 1000 \
  --window '{"type":"deadline","start_date":"2026-10-01","deadline":"2026-10-31"}' \
  --notify-on both

mgm goals list
mgm goals show <goal-id>
```

`--source` and `--window` are JSON objects. `--target-type` is `reach`, `threshold`, `growth`, or `streak`. `--notify-on` is `milestone`, `off_pace`, `both`, or `off`. Add `--json` for the full snapshot, or `--project` when `.mgm.json` is not the project you want. `list` and `show` print the live value, percent complete, pace text, and projected finish. If one goal cannot be evaluated, it remains visible as **Progress unavailable** while healthy goals continue to load.

### MCP

The [MCP server](/integrations/mcp-server) exposes `list_goals`, `get_goal`, `create_goal`, `update_goal`, and `delete_goal`. `create_goal` takes `project_id`, `source`, `target_type`, `target`, and `window`, plus optional `notify_on`. Reads return the stored definition and the live pace fields.

```json
{
  "project_id": "PROJECT_UUID",
  "source": { "type": "retention", "day": 7, "saved_retention_id": "RETENTION_UUID", "condition": { "operator": "above", "value": 30 } },
  "target_type": "threshold",
  "target": 30,
  "window": { "type": "rolling", "days": 30 },
  "notify_on": "off_pace"
}
```

## Notifications

Once a day, MGM checks each goal and sends at most the highest newly crossed milestone (25, 50, 75, or 100) and a single alert when a goal changes from on pace to behind, off target, or a broken streak. `notify_on` turns milestone alerts, off-pace alerts, both, or neither on. Delivery follows the account's existing in-app and email preferences. A goal that stays behind does not send another alert every day. It can alert again after it recovers and then falls behind.

## Next steps

- [Goals API](/api/goals) — REST reference for `/api/v2/projects/{project_id}/goals`
- [CLI](/cli) — `mgm goals list`, `create`, and `show`
- [MCP server](/integrations/mcp-server) — the same actions as tools
- [Insights](/features/insights), [Funnels](/features/funnels), and [Retention](/features/retention) — the analyses a goal can follow
