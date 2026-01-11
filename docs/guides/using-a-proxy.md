---
sidebar_position: 4
---

# Using a Proxy

Ad blockers and privacy extensions block analytics by maintaining blocklists of known domains. Requests to `ingest.mostlygoodmetrics.com` might never make it through.

The fix? Host a proxy on your own domain. Requests to `analytics.yourdomain.com` look like first-party traffic, so they don't get blocked.

```
Without proxy:
User → ingest.mostlygoodmetrics.com ← 🚫 Blocked

With proxy:
User → analytics.yourdomain.com → MGM ✅
```

## Quick Deploy

The [MGM Proxy](https://github.com/Mostly-Good-Metrics/mgm-proxy) is a tiny reverse proxy (~5MB, ~10MB RAM, <1ms latency) that forwards requests to MGM.

Deploy to your preferred platform:

| Platform | Deploy |
|----------|--------|
| Fly.io | [Deploy Guide](#flyio) |
| Railway | [Deploy Guide](#railway) |
| Render | [Deploy Guide](#render) |
| Heroku | [Deploy Guide](#heroku) |
| Docker | [Deploy Guide](#docker) |

## Fly.io

Fly.io deploys close to your users with edge regions.

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Clone and deploy
git clone https://github.com/Mostly-Good-Metrics/mgm-proxy.git
cd mgm-proxy
fly launch --no-deploy
fly deploy
```

Add a custom domain:

```bash
fly certs add analytics.yourdomain.com
# Add a CNAME record pointing to your-app.fly.dev
```

## Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

Add your custom domain in the Railway dashboard.

## Render

1. Fork [mgm-proxy](https://github.com/Mostly-Good-Metrics/mgm-proxy)
2. Create a new Web Service in Render
3. Connect your forked repo
4. Add your custom domain in service settings

## Heroku

```bash
heroku create my-mgm-proxy
heroku stack:set container
git push heroku main

# Add custom domain
heroku domains:add analytics.yourdomain.com
```

## Docker

```bash
docker run -p 8080:8080 ghcr.io/mostlygoodmetrics/mgm-proxy:latest
```

Or build it yourself:

```bash
git clone https://github.com/Mostly-Good-Metrics/mgm-proxy.git
cd mgm-proxy
docker build -t mgm-proxy .
docker run -p 8080:8080 mgm-proxy
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `MGM_TARGET_URL` | `https://ingest.mostlygoodmetrics.com` | MGM ingestion endpoint |
| `PORT` | `8080` | Port to listen on |

## Configure Your SDK

Once your proxy is deployed with a custom domain, configure your SDK to use it:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="swift" label="Swift" default>

```swift
let config = MGMConfiguration(
    apiKey: "mgm_proj_your_api_key",
    baseURL: URL(string: "https://analytics.yourdomain.com")!
)
MostlyGoodMetrics.configure(with: config)
```

  </TabItem>
  <TabItem value="android" label="Android">

```kotlin
val config = MGMConfiguration.Builder("mgm_proj_your_api_key")
    .baseUrl("https://analytics.yourdomain.com")
    .build()
MostlyGoodMetrics.configure(this, config)
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```typescript
import { MostlyGoodMetrics } from '@mostly-good-metrics/javascript';

MostlyGoodMetrics.configure({
    apiKey: 'mgm_proj_your_api_key',
    baseURL: 'https://analytics.yourdomain.com',
});
```

  </TabItem>
  <TabItem value="react-native" label="React Native">

```typescript
import MostlyGoodMetrics from '@mostly-good-metrics/react-native';

MostlyGoodMetrics.configure('mgm_proj_your_api_key', {
    baseURL: 'https://analytics.yourdomain.com',
});
```

  </TabItem>
  <TabItem value="flutter" label="Flutter">

```dart
await MostlyGoodMetrics.configure(
    MGMConfiguration(
        apiKey: 'mgm_proj_your_api_key',
        baseUrl: 'https://analytics.yourdomain.com',
    ),
);
```

  </TabItem>
  <TabItem value="capacitor" label="Capacitor">

```typescript
import MostlyGoodMetrics from '@mostly-good-metrics/capacitor';

MostlyGoodMetrics.configure('mgm_proj_your_api_key', {
    baseURL: 'https://analytics.yourdomain.com',
});
```

  </TabItem>
</Tabs>

## Health Check

The proxy exposes a `/health` endpoint for load balancer health checks:

```bash
curl https://analytics.yourdomain.com/health
# ok
```
