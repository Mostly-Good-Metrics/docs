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
| Account & projects | `mgm_whoami`, `mgm_list_projects`, `mgm_create_project`, `mgm_create_api_key` |
| Dashboard | `mgm_get_dashboard`, `mgm_get_filters`, `mgm_list_widgets`, `mgm_add_widget`, `mgm_remove_widget`, `mgm_reset_widgets` |
| Events | `mgm_list_events`, `mgm_list_event_types`, `mgm_define_event` |
| Funnels | `mgm_list_funnels`, `mgm_get_funnel`, `mgm_create_funnel`, `mgm_update_funnel`, `mgm_delete_funnel`, `mgm_execute_funnel` |
| Retention | `mgm_list_retentions`, `mgm_get_retention`, `mgm_create_retention`, `mgm_update_retention`, `mgm_delete_retention`, `mgm_execute_retention` |
| Queries | `mgm_list_queries`, `mgm_get_query`, `mgm_create_query`, `mgm_update_query`, `mgm_delete_query`, `mgm_execute_query` |
| Experiments | `mgm_list_experiments`, `mgm_get_experiment`, `mgm_create_experiment`, `mgm_update_experiment`, `mgm_delete_experiment`, `mgm_start_experiment`, `mgm_stop_experiment` |

Ad-hoc analysis works without saving anything: `mgm_execute_funnel`,
`mgm_execute_retention`, and `mgm_execute_query` all accept inline definitions,
so an assistant can answer "where do users drop off between signup and
purchase?" in one call.

`mgm_define_event` creates event-catalog metadata without ingesting analytics.
Sending test events is intentionally not an MCP tool; use the CLI's `mgm events
send` with `MGM_API_KEY` when you explicitly want to write test data.
