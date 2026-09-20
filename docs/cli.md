---
sidebar_position: 7
---

# CLI

The MostlyGoodMetrics CLI (`mgm`) manages projects, API keys, and dashboards, and runs funnels, retention, and queries from your terminal.

## Install

Install the published package globally:

```bash
npm install -g @mostly-good-metrics/cli
mgm --help
```

Requires Node.js 18 or newer.

## Quickstart

```bash
# Log in (opens your browser for OAuth)
mgm login

# Set up a project in the current directory (writes .mgm.json)
mgm init

# See your dashboard
mgm dashboard --range 30d
```

Most project-scoped commands read the project from `.mgm.json` (created by `mgm init`) or accept an explicit `--project <id>`. Add `--json` to any read command for machine-readable output.

## Commands

| Command | Description |
| --- | --- |
| `mgm login` / `mgm signup` / `mgm logout` | Browser-based OAuth auth (`--token` for CI) |
| `mgm whoami` | Show current user and organizations |
| `mgm init` | Create a project + API key and save local context |
| `mgm orgs list\|show\|create\|invite` | Manage organizations and members |
| `mgm projects list\|create\|show` | Manage projects |
| `mgm keys list\|create\|revoke` | Manage project API keys |
| `mgm dashboard` | Dashboard stats with filters (`--range`, `--platform`, ...) |
| `mgm events list\|types\|define\|send` | Inspect events, define event metadata, or send a test event |
| `mgm funnels list\|show\|create\|update\|execute\|delete` | Saved and ad-hoc funnels |
| `mgm retention list\|show\|create\|update\|execute\|delete` | Saved and ad-hoc retention analyses |
| `mgm queries list\|show\|create\|update\|execute\|delete` | Saved and ad-hoc queries |
| `mgm experiments ...` | Manage and start/stop experiments |
| `mgm widgets list\|add\|remove\|reset` | Manage dashboard widgets |

Run `mgm <command> --help` for full options.

## Examples

```bash
# Ad-hoc funnel across three events
mgm funnels execute --steps "app_open,add_to_cart,purchase" --window 1d --range 30d

# Unique users by day, as JSON
mgm queries execute --metric unique_users --group-by date \
  --events "signup,purchase" --range 7d --json

# Ad-hoc retention without creating a saved analysis
mgm retention execute --cohort-event signup --retention-event app_open \
  --grain week --days 1,7,14,30 --range 90d

# Define event metadata without ingesting an analytics event
mgm events define checkout_completed --description "A customer completed checkout"

# Send a test event. The CLI verifies that MGM_API_KEY belongs to the selected project.
MGM_API_KEY=mgm_proj_... mgm events send '{"name":"test_event"}' --project prj_123

# Create an API key for CI
mgm keys create "CI" --project prj_123
```

Keep `MGM_API_KEY` in your shell or secret manager rather than passing it as a
command argument. Test-event sending writes analytics data; `events define`
only creates catalog metadata.
