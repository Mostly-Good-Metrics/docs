---
sidebar_position: 7
---

# CLI

The MostlyGoodMetrics CLI (`mgm`) manages projects, API keys, and dashboards, and runs funnels, retention, and queries from your terminal.

## Install

The CLI is not yet published to npm — install it from source for now:

```bash
git clone https://github.com/Mostly-Good-Metrics/cli
cd cli
npm install
npm run build
node bin/mgm.js --help
```

Requires Node.js 18 or newer. Once it's on npm, installation will be `npm install -g @mostly-good-metrics/cli`.

## Quickstart

```bash
# Log in (opens your browser for OAuth)
mgm login

# Set up a project with a restricted development key (writes .mgm.json)
mgm init --project "My iOS App" --sdk swift --allow com.example.app

# See your dashboard
mgm dashboard --range 30d
```

Most project-scoped commands read the project from `.mgm.json` (created by `mgm init`) or accept an explicit `--project <id>`. Add `--json` to any read command for machine-readable output.

## Commands

| Command | Description |
| --- | --- |
| `mgm login` / `mgm signup` / `mgm logout` | Browser-based OAuth auth (`--token` for CI) |
| `mgm whoami` | Show current user and organizations |
| `mgm init` | Create a project + explicitly restricted or unrestricted API key and save local context |
| `mgm orgs list\|show\|create\|invite` | Manage organizations and members |
| `mgm projects list\|create\|show` | Manage projects |
| `mgm keys list\|create\|revoke` | Manage project API keys |
| `mgm dashboard` | Dashboard stats with filters (`--range`, `--platform`, ...) |
| `mgm events list\|types\|send` | Inspect recent events, send test events |
| `mgm funnels list\|create\|execute\|delete` | Saved and ad-hoc funnels |
| `mgm retention list\|create\|execute\|delete` | Retention analyses |
| `mgm queries list\|create\|execute\|delete` | Saved and ad-hoc queries |
| `mgm experiments ...` | Manage and start/stop experiments |
| `mgm widgets list\|add\|remove\|reset` | Manage dashboard widgets |

Run `mgm <command> --help` for full options.

## Examples

```bash
# Ad-hoc funnel across three events
mgm funnels execute --steps "app_open,add_to_cart,purchase" --range 30d

# Unique users by day, as JSON
mgm queries execute --metric unique_users --group-by date --range 7d --json

# Create a production key restricted to one Apple bundle ID
mgm keys create "iOS Production" --project prj_123 --environment production --allow com.example.app
```

`mgm init` and `mgm keys create` require an explicit access mode. Prefer one or
more `--allow` values for Apple bundle IDs, Android package names/application
IDs, or web domains. Use `--unrestricted` only when
the caller cannot send a stable identifier; unrestricted creation requires
interactive confirmation or the global `--yes` flag. `mgm init` defaults its
new key to the `development` environment.
