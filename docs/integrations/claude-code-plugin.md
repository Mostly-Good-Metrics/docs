---
sidebar_position: 2
---

# Claude Code Plugin

The official Mostly Good Metrics plugin for [Claude Code](https://claude.com/claude-code). It connects Claude to your MGM projects via [MCP](/integrations/mcp-server) and ships skills for analyzing metrics, building funnels, running weekly reviews, and instrumenting your app.

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
- **weekly-review** — run it yourself with `/mostly-good-metrics:weekly-review` for a compact week-over-week report: WAU, signups, top-event deltas, notable movers, and one suggested action.
- **instrument-my-app** — Claude uses this automatically when you want to add analytics to code.
  - "Add MGM tracking to my Flutter app."
  - "What events should I track for this signup flow?"

The instrument-my-app skill knows all six SDKs: [Swift](/sdks/swift), [Android](/sdks/android), [Flutter](/sdks/flutter), [JavaScript](/sdks/javascript), [React Native](/sdks/react-native), and [Capacitor](/sdks/capacitor).
