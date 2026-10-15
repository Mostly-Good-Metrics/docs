---
sidebar_position: 4
title: Query definition
---

# Query definition

The query definition is the JSON object MGM uses to describe an analytics
question. The MCP tools `execute_query`, `create_query`, `update_query`, and
`query_metrics` take it, and the CLI's `mgm queries --definition` flag takes the
same object. Learn it once and it works everywhere.

```json
{
  "metric": "unique_users",
  "event_filter": ["purchase_completed"],
  "group_by": "date",
  "breakdown_by": "platform",
  "granularity": "day",
  "date_range": "30d",
  "exclude_lifecycle_events": true,
  "filters": {
    "platforms": ["iOS", "Android"],
    "prop:plan": { "op": "in", "values": ["pro", "team"] }
  }
}
```

`metric` is the only required key.

| Key | Type | Default |
|---|---|---|
| `metric` | string, required | — |
| `event_filter` | array of event names | all events |
| `group_by` | string | none, giving a single number |
| `breakdown_by` | string | none |
| `granularity` | `day`, `week`, `month` | `day` |
| `date_range` | string | `30d` |
| `exclude_lifecycle_events` | boolean | `false` |
| `filters` | object | `{}` |

## metric

`count_events`, `unique_users`, `unique_sessions`, or `dau`.

Unique users, unique sessions, and DAU are deduplicated with probabilistic
sketches. On older data where those sketches are incomplete, the result is
`{"type": "unavailable"}` rather than a number that would be wrong. Identity
metrics grouped by a custom property are always unavailable, because custom
property rollups carry no sketches — group by a built-in dimension, or use
`count_events`.

## group_by and breakdown_by

`group_by` takes `date` or any dimension below, or `prop:<property_name>` for a
custom property you send on events.

```
platform            app_version         app_build_number
os_version          environment         device_manufacturer
locale              timezone            country
region              city                event_name
```

`breakdown_by` takes the same values except `date`, and only works when
`group_by` is `date`. It splits a time series into one line per value, for
example users over time broken down by platform.

## date_range

| Form | Example |
|---|---|
| Preset | `1d`, `7d`, `30d`, `90d`, `365d` |
| Custom | `custom:2026-01-01:2026-03-31` |
| Month | `month:11`, `months:11,12` |
| Quarter | `quarter:4`, `quarters:1,4` |
| Same period last year | `compare:month:11`, `compare:quarter:4` |
| Week over week | `compare:wow:4` (2 to 12 weeks) |

The `query_metrics` MCP tool accepts presets and `custom:` only, up to 366 days
per query. It has its own `compare: "previous_period"` option instead of the
seasonal forms. Use `execute_query` when you need a seasonal range.

## filters

A flat object of dimension keys and custom property keys. Any other key is
rejected with a message naming it.

### Dimension keys

| Key | Also accepted as |
|---|---|
| `platforms` | — |
| `event_names` | — |
| `environments` | `environment` |
| `app_versions` | `app_version` |
| `countries` | `country` |
| `regions` | `region` |
| `cities` | `city` |

Each takes a string or an array of strings. Several values inside one key mean
"any of these"; separate keys are combined with AND. Call the `get_filters` MCP
tool, or run `mgm dashboard filters`, to see the values your project actually
has.

### Custom property keys

Prefix the property name with `prop:`. Four forms, shortest first:

```json
{ "prop:plan": "pro" }
{ "prop:plan": ["pro", "team"] }
{ "prop:plan": { "op": "neq", "value": "free" } }
{ "prop:plan": [{ "op": "contains", "value": "ent" }, { "op": "is_set" }] }
```

A clause has:

| Field | Meaning |
|---|---|
| `op` | Operator, defaults to `eq` |
| `type` | `string` (default), `number`, `boolean`, `datetime`, `enum` |
| `value` | Single value |
| `values` | Array, for `in`, `not_in`, and `between` |

Which operators apply depends on `type`:

| `type` | Operators |
|---|---|
| any | `is_set`, `is_not_set` |
| `string`, `enum` | `eq`, `neq`, `in`, `not_in`, `contains`, `not_contains`, `starts_with`, `ends_with` |
| `number` | `eq`, `neq`, `in`, `not_in`, `gt`, `gte`, `lt`, `lte`, `between` |
| `boolean` | `eq` |
| `datetime` | `before`, `after`, `on_or_before`, `on_or_after`, `between` |

Set `type` when you want a numeric or chronological comparison. The default
`string` type compares text, so `{"op": "gt", "value": 100}` without
`"type": "number"` compares `"9"` as greater than `"100"`.

```json
{ "prop:revenue": { "op": "gt", "type": "number", "value": 100 } }
```

Text operators are case-insensitive. `between` uses the first two entries of
`values` as an inclusive range. `is_set` means the property is present and not
an empty string. Clauses inside one `prop:` key are combined with OR; different
`prop:` keys are combined with AND.

### What a `prop:` filter costs

A `prop:` filter is answered from raw events rather than daily aggregates, so
it is slower than a dimension filter. Prefer a dimension filter when one
covers what you need.

## exclude_lifecycle_events

Set to `true` to drop the events SDKs track automatically, which all start with
`$` — see [reserved events](/guides/reserved-events). Useful when an event count
is dominated by app opens.

## Results

| Query | Result |
|---|---|
| No `group_by` | a single number |
| `group_by: "date"` | a list of `{date, value}` points |
| `group_by: "date"` with `breakdown_by` | one series per breakdown value |
| `group_by` on another dimension | a list of `{label, value}` rows |

## Funnels and retention are different

A funnel is a list of steps, not a query definition. Each step is
`{"event_name": "...", "name": "Display label"}`, with an optional list of
property filters in a simpler shape:

```json
{
  "event_name": "checkout_started",
  "name": "Checkout",
  "filters": [{ "property": "plan", "op": "eq", "value": "pro" }]
}
```

Step filters support `eq`, `neq`, `contains`, `not_contains`, `gt`, `gte`,
`lt`, and `lte`. A funnel needs between 2 and 15 steps.

Retention takes `cohort_event`, an optional `retention_event` (omit it to count
any event), a `cohort_grain` of `day`, `week`, or `month`, and `retention_days`
chosen from 1, 2, 3, 7, 14, 21, 30, 60, and 90.
