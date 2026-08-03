---
sidebar_position: 3
---

# Retention

Retention analysis answers: of the users who did something, how many came back and did it (or anything) again later?

## What a retention analysis is

A retention analysis is defined by:

- **Cohort event** — the event that puts a user into a cohort (e.g. `signed_up`, or `$app_installed` for install cohorts)
- **Return event** — the event that counts as "coming back" (a specific event, or any event)
- **Cohort grain** — group cohorts by day, week, or month
- **Periods** — which offsets to measure (e.g. day 1, 7, 14, 30)

The result is a cohort table: each row is a cohort (users who first did the cohort event in that day/week/month), each column is the percentage still active N periods later.

```
Cohort        Size   D0     D1    D7    D14
Jan 1 week     234   100%   45%   32%   28%
Jan 8 week     289   100%   52%   38%   31%
```

Reading it: compare columns *down* a column across cohorts — if D7 retention improves for newer cohorts, whatever you changed is working.

## How to instrument for retention

1. **Have a clear cohort event.** `signed_up` or `$app_installed` (tracked automatically by the SDKs) are the usual choices. If you track nothing else, lifecycle events alone give you install-cohort retention out of the box.
2. **Use stable user IDs.** Retention joins the cohort event and return events on user ID across days or weeks. Call `identify()` with the same ID on every platform and login — a user who appears under a new ID looks like a churned user plus a new user.
3. **Pick a return event that means value.** "Any event" measures app opens; a specific event like `document_edited` measures whether users return to the thing that matters.

## Availability

Retention analysis is available on paid plans.

## Next steps

- [Identifying Users](/guides/identifying-users) — stable IDs across sessions and platforms
- [Funnels](/features/funnels) — how users get to activation in the first place
