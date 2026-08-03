---
sidebar_position: 1
---

# Insights

Insights are saved queries over your events: pick an event, choose an aggregation, filter and group it, and save the result as a chart on your dashboard.

## What an insight is

An insight is defined by:

- **Event** — a specific event name, or all events
- **Aggregation** — event count or unique users
- **Filters** — property conditions (e.g. `plan = "pro"`)
- **Group by** — a time interval (day, week, month) or a property value
- **Visualization** — line, bar, pie, table, or a single number

Example: "Weekly signups on the pro plan" is `user_signed_up`, filtered to `plan = "pro"`, grouped by week, drawn as a line chart.

Saved insights run on demand and can be pinned to your project dashboard as widgets.

## How to instrument for insights

Insights are only as good as the events underneath them:

1. **One name per action.** Use a single, consistent event name for each action (`purchase_completed`, not sometimes `purchase` and sometimes `buy_completed`). Insights query by exact event name.
2. **Put dimensions in properties.** If you'll want to break a metric down by something — plan, screen, product category — send it as a property rather than encoding it in the event name. `feature_used` with `{ feature: "dark_mode" }` can be grouped by feature; `dark_mode_used` cannot.
3. **Use consistent property values.** `"pro"` and `"Pro"` are different values in a breakdown.

```typescript
// Good: one event, groupable by property
track('feature_used', { feature: 'export', plan: 'pro' });

// Hard to analyze: name explosion
track('export_feature_used_by_pro_user');
```

## Ask AI

On paid plans you can also ask questions in plain English ("how many users exported data last week?") and get a chart back — useful for one-off questions that don't warrant a saved insight.

## Next steps

- [Funnels](/features/funnels) — multi-step conversion
- [Retention](/features/retention) — do users come back?
- [Tracking Events](/guides/tracking-events) — naming and property patterns
