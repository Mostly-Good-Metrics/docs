---
sidebar_position: 1
---

# Web Analytics

Use MGM as a clear website analytics tool without giving up product analytics.
The same events power both views, so you can move from “traffic spiked” to the
sessions, people, and actions behind it.

## Enable website capture

```typescript
import { MostlyGoodMetrics } from '@mostly-good-metrics/javascript';

MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
  trackPageViews: true,
});
```

This captures regular page loads and single-page-app navigation. Open **Web
Analytics** inside your MGM project to see:

- Visitors, visits, and pageviews
- Views per visit, bounce rate, and average engagement time
- Hourly or daily traffic
- Top pages, sources, campaigns, countries, devices, and browsers
- One-click segment filters across the entire overview

Before the first page view arrives, the screen shows a clearly labeled preview
and a copy-ready setup snippet. Web Analytics is shown in project navigation by
default so the capability is discoverable. For app-only or backend-only
projects, an owner or admin can hide it from **Project Settings** and restore it
at any time from **Integrations**.

## How MGM defines the metrics

| Metric | Definition |
|---|---|
| Visitors | Distinct anonymous or identified people who viewed a page |
| Visits | Browser sessions containing at least one page view |
| Pageviews | Initial loads and client-side route changes |
| Views / visit | Pageviews divided by visits |
| Bounce rate | Visits with one pageview and no custom product event |
| Avg engagement | Time the page was actually visible, divided by visits |

Sessions renew after 30 minutes of inactivity by default. Change this with
`sessionTimeoutMinutes` if your product has a different meaningful visit
window.

Average engagement intentionally excludes time spent in a background tab. If a
project contains older SDK data without `$page_engagement`, MGM displays the
metric as unavailable rather than presenting a misleading zero.

## Website analytics plus product analytics

Page traffic is the beginning of an investigation, not a dead-end report. Keep
tracking important actions such as `signup_completed`, `checkout_started`, or
`article_shared`. A single-page visit with one of those actions is engaged—not
a bounce—and those same events remain available for insights, funnels,
retention, experiments, CLI, and MCP analysis.

Selecting a page, source, campaign, country, device, or browser applies that
segment to every headline metric and chart. This is useful for questions like:

- Was a traffic spike one campaign or one country?
- Did mobile visitors explore fewer pages?
- Which landing pages brought people who later signed up?
- Is unusual traffic concentrated in a browser or device pattern?

## Privacy controls

Website capture follows the JavaScript SDK's existing opt-out, consent-first,
Do Not Track / Global Privacy Control, and persistence settings. See the
[JavaScript SDK privacy options](/sdks/javascript#privacy).
