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
- An **On your site now** view of recent visitors, active routes, and country-level locations
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

## Live activity

**On your site now** shows visitors and sessions that sent a web event during the last
five minutes. It refreshes automatically and highlights the routes being viewed
alongside an aggregate country map. MGM does not generate synthetic heartbeat
events for this view, so live activity never inflates pageviews, funnels, usage,
or billing. Someone silently reading the same page for longer than five minutes
may therefore disappear until they interact or navigate again.

Add **On your site now** to a project dashboard when the live count is useful
beside the project's other KPIs. It is optional rather than added automatically,
and it refreshes independently of slower historical dashboard widgets. The MGM
iOS app renders the same dashboard card and opens a native detail view for active
routes and aggregate countries. This view is specifically website traffic; it
does not imply that native app users are currently online.

Location detail follows the project's existing geolocation privacy setting. The
map is aggregate and country-level; it does not expose a person's precise
location.

## Dynamic routes

Top pages groups obvious dynamic identifiers into readable route patterns. For
example, visits to different organization URLs appear together as
`/organizations/:organization_id`. Select the grouped route to see its exact
underlying paths and filter the rest of the overview to that route.

Older manually captured pageviews without a `pathname` appear as **Unclassified
/ older pageviews** instead of being mixed into current routes.

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
