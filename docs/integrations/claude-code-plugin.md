---
sidebar_position: 2
---

# Claude Code Plugin

The official Mostly Good Metrics plugin for [Claude Code](https://claude.com/claude-code). It connects Claude to your MGM projects via [MCP](/integrations/mcp-server) and bundles the complete portable MGM skill set.

## Install

Inside Claude Code:

```
/plugin marketplace add Mostly-Good-Metrics/claude-plugin
/plugin install mostly-good-metrics@mostly-good-metrics
```

**First run:** the first time Claude calls an MGM tool, Claude Code opens your browser to sign in to Mostly Good Metrics (OAuth). No API keys or manual configuration needed — approve once and you're connected.

## What you get

The plugin connects the MGM MCP server (`https://app.mostlygoodmetrics.com/mcp`), giving Claude tools to query events, run and save queries, build funnels, measure retention, manage experiments, and read your dashboard. See [MCP server](/integrations/mcp-server) for the full tool list.

### Skills

- **analyze-metrics** — Claude uses this automatically when you ask how something is doing.
  - "How are signups trending this month?"
  - "Which platform drives the most sessions?"
- **funnel-doctor** — Claude uses this automatically for conversion questions.
  - "Where do users drop off during onboarding?"
  - "Build a checkout funnel and tell me what to fix first."
- **weekly-review** — produce a compact week-over-week report: WAU, signups, top-event deltas, notable movers, and one suggested action.
- **instrument-my-app** — Claude uses this automatically when you want to add analytics to code.
  - "Add MGM tracking to my Flutter app."
  - "What events should I track for this signup flow?"
- **audit-instrumentation** — verify event quality and diagnose missing or misleading data.
- **build-dashboard** — build saved queries and useful dashboard widgets.
- **retention-cohorts** — create and interpret mature retention cohorts.
- **run-experiment** — plan, launch, monitor, and conclude experiments safely.

The instrument-my-app skill knows all six SDKs: [Swift](/sdks/swift), [Android](/sdks/android), [Flutter](/sdks/flutter), [JavaScript](/sdks/javascript), [React Native](/sdks/react-native), and [Capacitor](/sdks/capacitor).

The skill instructions are maintained in the
[`Mostly-Good-Metrics/skills`](https://github.com/Mostly-Good-Metrics/skills)
repository and work in Codex and other compatible agents too. See
[Agent skills](/integrations/agent-skills) for cross-agent installation.
