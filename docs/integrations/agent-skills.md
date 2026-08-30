---
sidebar_position: 2
---

# Agent skills

Mostly Good Metrics publishes one portable skill set for Codex, Claude Code,
and other agents supported by the standard `skills` installer. Skills describe
how to instrument an app, analyze metrics, diagnose funnels, build dashboards,
measure retention, audit instrumentation, and run experiments.

The canonical source is
[`Mostly-Good-Metrics/skills`](https://github.com/Mostly-Good-Metrics/skills).

## Install for Codex

```bash
npx skills add Mostly-Good-Metrics/skills --agent codex --global --yes
```

## Install for Claude Code

The [Claude Code plugin](/integrations/claude-code-plugin) is the simplest path:
it installs the MGM MCP connection and mirrors the complete skill set.

```text
/plugin marketplace add Mostly-Good-Metrics/claude-plugin
/plugin install mostly-good-metrics@mostly-good-metrics
```

To install only the portable skills instead:

```bash
npx skills add Mostly-Good-Metrics/skills --agent claude-code --global --yes
```

## Connect MGM data

Skills are instructions; the [MGM MCP server](/integrations/mcp-server) provides
the tools and data. Connect this streamable HTTP endpoint:

```text
https://app.mostlygoodmetrics.com/mcp
```

Authentication is browser-based OAuth. The first MGM tool call asks you to sign
in and approve access; you do not copy an API key into the agent.

The skills can also use the `mgm` CLI for local scripting or when MCP is not
connected.

## Verify discovery

1. Restart the agent client if it was open during installation.
2. Ask it to list its MGM skills or explicitly invoke `instrument-my-app`.
3. Ask it to call `mgm_whoami` or list MGM projects; complete OAuth if prompted.
4. Confirm the agent names the project it selected before it reads or changes
   saved analytics.

## Included skills

| Skill | Use it for |
|---|---|
| `instrument-my-app` | Install an SDK and add safe event tracking |
| `audit-instrumentation` | Diagnose missing, duplicated, or misleading data |
| `analyze-metrics` | Answer product questions with real MGM data |
| `build-dashboard` | Create reusable queries and decision-focused widgets |
| `funnel-doctor` | Find and segment conversion drop-offs |
| `retention-cohorts` | Compare mature retention cohorts |
| `run-experiment` | Plan and operate an MGM experiment |
| `weekly-review` | Produce a compact week-over-week report |

Repository-level instructions still apply. An MGM skill explains the product
workflow; the target repository's `AGENTS.md` or `CLAUDE.md` explains its build,
test, review, and safety conventions.

## Customer MCP versus Support MCP

These public skills use the tenant-scoped customer MCP. MGM's admin-only Support
MCP is a separate, private, read-only debugging surface and is intentionally not
installed or documented as a customer skill.
