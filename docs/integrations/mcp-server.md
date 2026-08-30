---
sidebar_position: 3
---

# MCP Server

MGM ships an MCP (Model Context Protocol) server so AI assistants can query your analytics directly.

**URL:** `https://app.mostlygoodmetrics.com/mcp` (streamable HTTP)

## Connect

- **Claude Code** — install the [Claude Code plugin](/integrations/claude-code-plugin), which connects the server and adds MGM-specific skills.
- **Codex** — add the URL as an HTTP MCP server, then install the shared [agent skills](/integrations/agent-skills).
- **claude.ai** — add it as a custom connector with the URL above.
- **Any MCP client** — the server supports streamable HTTP with OAuth 2.0 (dynamic client registration included).

Authentication is browser-based OAuth: the first time your client calls an MGM tool, you're sent to sign in to Mostly Good Metrics and approve access. No API keys to copy around.

MCP tools provide access to MGM; [portable agent skills](/integrations/agent-skills)
teach Codex, Claude Code, and compatible agents how to combine those tools into
reliable workflows. Install both when you want automatic workflow discovery.

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
| Queries | `list_queries`, `get_query`, `create_query`, `update_query`, `delete_query`, `execute_query` |
| Experiments | `list_experiments`, `get_experiment`, `create_experiment`, `update_experiment`, `delete_experiment`, `start_experiment`, `stop_experiment` |

Ad-hoc analysis works without saving anything: `execute_funnel`, `execute_retention`, and `execute_query` all accept inline definitions, so an assistant can answer "where do users drop off between signup and purchase?" in one call.
