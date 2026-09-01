---
sidebar_position: 3
---

# MCP Server

MGM ships an MCP (Model Context Protocol) server so AI assistants can query your analytics directly.

**URL:** `https://app.mostlygoodmetrics.com/mcp` (streamable HTTP)

## Connect

- **Claude Code** — install the [Claude Code plugin](/integrations/claude-code-plugin), which connects the server and adds MGM-specific skills.
- **claude.ai** — add it as a custom connector with the URL above.
- **Any MCP client** — the server supports streamable HTTP with OAuth 2.0 (dynamic client registration included).

Authentication is browser-based OAuth: the first time your client calls an MGM tool, you're sent to sign in to Mostly Good Metrics and approve access. No API keys to copy around.

## Troubleshooting

### I added MGM, but its tools are not visible

Most MCP clients discover tools when an agent or task starts. After adding MGM as
a new server, start a fresh agent/task (or restart your MCP client) and try again.
Completing OAuth alone does not always refresh a running agent's tool list.

## Tools

| Area | Tools |
|------|-------|
| Account & projects | `whoami`, `list_projects`, `create_project`, `create_api_key` |
| Dashboard | `get_dashboard`, `get_filters`, `list_widgets`, `add_widget`, `remove_widget`, `reset_widgets` |
| Events | `list_events`, `list_event_types`, `define_event` |
| Funnels | `list_funnels`, `get_funnel`, `create_funnel`, `update_funnel`, `delete_funnel`, `execute_funnel` |
| Retention | `list_retentions`, `get_retention`, `create_retention`, `update_retention`, `delete_retention`, `execute_retention` |
| Queries | `list_queries`, `get_query`, `create_query`, `update_query`, `delete_query`, `execute_query`, `query_metrics` |
| Experiments | `list_experiments`, `get_experiment`, `create_experiment`, `update_experiment`, `delete_experiment`, `start_experiment`, `stop_experiment` |

Ad-hoc analysis works without saving anything: `execute_funnel`, `execute_retention`, and `execute_query` all accept inline definitions, so an assistant can answer "where do users drop off between signup and purchase?" in one call.

### Query several metrics efficiently

Use `query_metrics` when an assistant needs several aggregate answers for the same project. It runs 1–10 independent queries with bounded server-side concurrency, so the client makes one MCP call instead of repeatedly calling `execute_query`.

```json
{
  "project_id": "PROJECT_UUID",
  "queries": [
    {
      "id": "purchases",
      "metric": "count_events",
      "event_filter": ["purchase_completed"],
      "date_range": "30d",
      "compare": "previous_period"
    },
    {
      "id": "active-users",
      "metric": "unique_users",
      "date_range": "30d"
    }
  ]
}
```

Each result repeats the caller-defined `id` and has a `status`. Successful scalar comparisons include current and previous values, absolute change, and percentage change when the previous value is nonzero. An invalid analytics definition or unsupported metric returns an error for that item without discarding other results. Missing or duplicate IDs and violations of the 1–10 query batch contract reject the whole call.

The tool is read-only and aggregate-only: it supports `count_events`, `unique_users`, `unique_sessions`, and `dau`, but does not return raw user IDs. MCP clients receive both a backwards-compatible JSON text result and MCP `structuredContent`; no MGM-specific client runtime or dashboard change is required.

Custom date ranges are limited to 366 days to keep database work and MCP responses bounded.
