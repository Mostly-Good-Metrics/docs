---
sidebar_position: 2
---

# Identifying Users

User identification connects events to specific users, enabling retention analysis and user-level insights.

## How It Works

1. **Anonymous ID**: SDKs auto-generate a unique ID for each device/browser
2. **Identified ID**: When you call `identify()`, this ID takes precedence
3. **Persistence**: Both IDs are persisted across sessions

## Basic Usage

```typescript
// After user logs in
identify('user_123');

// After user logs out
resetIdentity();
```

## When to Identify

Call `identify()` when:
- User logs in
- User creates an account
- User authenticates via OAuth

```typescript
// After successful login
async function onLoginSuccess(user) {
  identify(user.id);
  track('user_logged_in');
}
```

## When to Reset

Call `resetIdentity()` when:
- User logs out
- User switches accounts

```typescript
async function onLogout() {
  track('user_logged_out');
  resetIdentity();
}
```

## Anonymous Users

Before calling `identify()`, events are still tracked with an anonymous ID. This allows:

- Pre-registration funnel analysis
- Conversion tracking for signups
- Session-based analysis

```typescript
// Before login - tracked with anonymous ID
track('page_viewed', { page: 'pricing' });
track('signup_started');

// After signup - tracked with identified ID
identify('new_user_456');
track('signup_completed');
```

## User ID Best Practices

### Do
- Use stable, unique IDs (database IDs, UUIDs)
- Use the same ID across platforms
- Identify immediately after authentication

### Don't
- Use PII (email, phone) as user ID
- Change user IDs after creation
- Use session or temporary IDs

```typescript
// Good
identify('usr_abc123');
identify('550e8400-e29b-41d4-a716-446655440000');

// Avoid
identify('john@example.com');  // PII
identify('session_xyz');        // Not stable
```

## Cross-Platform Identity

Use the same user ID across all platforms:

```swift
// iOS
MostlyGoodMetrics.identify(userId: "usr_abc123")
```

```kotlin
// Android
MostlyGoodMetrics.identify("usr_abc123")
```

```typescript
// Web
MostlyGoodMetrics.identify('usr_abc123');
```

This links all activity to the same user in your analytics.

## Session IDs

In addition to user ID, each app launch generates a unique session ID:

- Auto-generated on SDK initialization
- Included with every event
- Helps analyze within-session behavior

You don't need to manage session IDs - they're handled automatically.
