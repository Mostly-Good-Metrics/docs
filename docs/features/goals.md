---
sidebar_position: 5
---

# Goals

Goals are in limited preview and are available only to enabled organizations.

A goal describes what a team is working toward: a value, growth rate, streak,
or threshold over a defined window. MGM derives progress, pace, projected
finish, and milestone state from the events and saved analyses you already
have. Goals do not change what the SDKs send.

## Goal definitions

A goal stores:

- **Name** — the customer-facing label
- **Source** — the metric to evaluate
- **Window** — deadline, rolling, or open-ended
- **Shape** — `reach`, `growth`, `streak`, or `threshold`
- **Goal** — the shape-specific configuration
- **Lifecycle** — optional `starts_on` and `ends_on` dates, plus `enabled`

Live values are derived rather than stored. Unavailable evidence remains
unavailable instead of becoming zero.

## Shapes

| Shape | Question | `goal` object |
| --- | --- | --- |
| `reach` | Will this metric reach a value? | `{ "value": 10000 }` |
| `growth` | Will this metric grow by a percentage? | `{ "percent": 20 }` |
| `streak` | Can this daily condition hold for consecutive days? | `{ "days": 7, "operator": "gte", "value": 100 }` |
| `threshold` | Will this metric finish above or below a boundary? | `{ "operator": "lte", "value": 2 }` |

Operators are `gte`, `lte`, `gt`, and `lt`. Reach values, growth percentages,
and streak day counts must be greater than zero.

Threshold goals require a finish line: use a deadline window, or an open-ended
window with `ends_on`. A rolling threshold describes an ongoing condition, so
MGM rejects it and directs you to create an Alert instead. Goals and Alerts are
both in limited preview.

## Sources

| Source | Measures | Required configuration |
| --- | --- | --- |
| `event_count` | Event volume | Optional `event_name`; omit it to count every event |
| `unique_users` | Distinct users | Optional filters |
| `funnel_conversion` | Saved or inline funnel conversion | `saved_funnel_id` or an inline `definition` |
| `retention` | D1, D7, or D30 retention | Optional `day` (defaults to `7`) plus `saved_retention_id` or an inline `definition` |
| `revenue` | RevenueCat purchase revenue | Optional `currency`, defaulting to `USD` |
| `saved_query` | A numeric saved insight | `saved_query_id`, with optional aggregation or result path |

Streaks need a complete daily series and support event count, unique users, and
revenue. Other goal shapes support all six sources.

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

Dates use `YYYY-MM-DD`. Rolling windows accept 1 through 3,650 days.
`starts_on` and `ends_on` can bound the goal lifecycle separately from the
measurement window.

## Live snapshots

Snapshots include `value`, `baseline`, `progress`, `pace`, projected finish,
status, milestones, and `as_of`. They also include `availability` and
`unavailable_reason` so missing identity totals, missing growth baselines, slow
queries, and evaluation failures stay explicit.

List reads share one bounded evaluation budget. A slow or unavailable goal
does not remove completed goals from the response. A projected finish date is
`null` when the source or window does not support an honest estimate.

## In the app

Open **Goals** in a project and choose **New goal**. Choose a source, any of the
four goal shapes, and a deadline, rolling, or open-ended window. Sources include
all events, unique users, recent individual events, Revenue when configured,
and saved funnels, retention analyses, and queries. The builder shows a live
preview and redirects a rolling threshold to an Alert because that combination
has no finish line.

The Goals page shows current value, progress, status, projected finish, pace,
and charts when available. From there you can follow, edit, or delete a goal.
Add one to the project dashboard with **Edit dashboard** → **Goal**. Deleting a
goal removes its dashboard widget but never deletes analytics events.

## Create and read a goal

### CLI

```bash
mgm goals create \
  --name "Reach 1,000 purchases" \
  --source '{"type":"event_count","event_name":"purchase_completed"}' \
  --shape reach \
  --goal '{"value":1000}' \
  --window '{"type":"deadline","start_date":"2026-10-01","deadline":"2026-10-31"}'

mgm goals list
mgm goals show <goal-id>
```

`mgm goals list` reads bounded snapshots, and `mgm goals show` reads the stored
definition plus its live snapshot. Add `--json` for machine-readable output or
`--project` to override the project in `.mgm.json`.

### MCP

The [MCP server](/integrations/mcp-server) exposes `list_goals`, `get_goal`,
`create_goal`, `update_goal`, `delete_goal`, `follow_goal`, and
`unfollow_goal`. ID-based tools take `goal_id`. Create and update use the
shape-specific `goal` object.

```json
{
  "project_id": "PROJECT_UUID",
  "name": "Keep D7 retention at 30%",
  "source": { "type": "retention", "day": 7, "saved_retention_id": "RETENTION_UUID" },
  "window": { "type": "deadline", "start_date": "2026-10-01", "deadline": "2026-10-31" },
  "shape": "threshold",
  "goal": { "operator": "gte", "value": 30 }
}
```

### REST API

The [Goals API](/api/goals) exposes definitions at
`/api/v2/projects/{project_id}/goals` and live values through the list
`snapshots=true` option or `/goals/{id}/snapshot`.

## Following and notifications

Creating a goal follows it for the creator. Other project members can follow
or unfollow a goal independently. Followers receive a one-time `goal_reached`
notification according to their email and in-app preferences. A follow does
not subscribe the entire organization.

Rolling goals and open-ended goals without `ends_on` do not send a reached
notification because they have no fixed finish line. Milestone, pace, and
recovery changes remain visible in snapshots but are not sent as goal
notifications.

## Next steps

- [Goals API](/api/goals) — routes, response keys, and snapshot fields
- [CLI](/cli) — `mgm goals list`, `create`, and `show`
- [MCP server](/integrations/mcp-server) — goal and alert tools
- [Funnels](/features/funnels) and [Retention](/features/retention) — saved analyses a goal can measure
