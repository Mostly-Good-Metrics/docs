---
sidebar_position: 3
---

# Reserved Events

Reserved events (prefixed with `$`) are automatically tracked by SDKs. They provide consistent lifecycle tracking across platforms.

## Lifecycle Events

| Event | When Tracked | Properties |
|-------|--------------|------------|
| `$app_installed` | First launch after install | `$version` |
| `$app_updated` | First launch after version change | `$version`, `$previous_version` |
| `$app_opened` | App became active (foreground) | - |
| `$app_backgrounded` | App went to background | - |

### $app_installed

Tracked on the very first launch after installation.

```json
{
  "name": "$app_installed",
  "properties": {
    "$version": "1.0.0"
  }
}
```

Use this for:
- Install attribution
- New user funnels
- Install-to-activation metrics

### $app_updated

Tracked on the first launch after the app version changes.

```json
{
  "name": "$app_updated",
  "properties": {
    "$version": "2.0.0",
    "$previous_version": "1.9.0"
  }
}
```

Use this for:
- Update adoption rates
- Version migration tracking
- Feature rollout analysis

### $app_opened

Tracked when the app comes to the foreground.

Use this for:
- Daily/monthly active users
- Session frequency
- Return user analysis

### $app_backgrounded

Tracked when the app goes to the background.

Use this for:
- Session duration (with `$app_opened`)
- Drop-off analysis

## Reserved Properties

| Property | Description | Example |
|----------|-------------|---------|
| `$version` | Current app version | `"1.0.0"` |
| `$previous_version` | Previous app version | `"0.9.0"` |
| `$device_type` | Device category | `"phone"`, `"tablet"`, `"desktop"` |
| `$device_model` | Device model | `"iPhone15,2"`, `"Pixel 8"` |
| `$sdk` | SDK identifier | `"swift"`, `"android"`, `"javascript"` |
| `$storage_type` | Storage mechanism | `"persistent"`, `"memory"` |

## Enabling/Disabling

Lifecycle events are enabled by default. To disable:

```typescript
MostlyGoodMetrics.configure('api_key', {
  trackAppLifecycleEvents: false,
});
```

## Don't Use $ Prefix

The `$` prefix is reserved for system events and properties. Don't use it for your own events:

```typescript
// Wrong - will conflict with system events
track('$my_event');

// Correct
track('my_event');
```
