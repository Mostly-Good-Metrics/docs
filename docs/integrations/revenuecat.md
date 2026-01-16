---
sidebar_position: 1
---

# RevenueCat Integration

Track subscription events from RevenueCat in Mostly Good Metrics.

## What You Get

- Track subscription lifecycle (purchases, renewals, cancellations)
- Analyze subscription retention and churn
- Include subscription data in funnels and insights
- Segment users by subscription status

## Prerequisites

**Important:** Your RevenueCat `app_user_id` must match your MGM user identifier. Events for unmatched users will be discarded.

## Setup

### 1. Enable Integration in MGM

1. Go to your project → **Integrations**
2. Click **Configure** on RevenueCat
3. Toggle **Enable** on
4. Copy your **Webhook URL** and **Auth Token**
5. Select which events you want to track
6. Click **Save**

### 2. Configure RevenueCat

1. In RevenueCat Dashboard, go to **Project Settings → Integrations → Webhooks**
2. Click **+ New Webhook**
3. Paste your MGM Webhook URL
4. Set Authorization header to: `Bearer <your-auth-token>`
5. Save

### 3. Test

Make a sandbox purchase and verify the event appears in MGM (note: sandbox events are ignored, only production events are tracked).

## Events

| RevenueCat Event | MGM Event | Description |
|------------------|-----------|-------------|
| INITIAL_PURCHASE | `rc_initial_purchase_event` | First subscription purchase |
| RENEWAL | `rc_renewal_event` | Subscription renewed |
| CANCELLATION | `rc_cancellation_event` | Subscription cancelled |
| UNCANCELLATION | `rc_uncancellation_event` | Cancellation reversed |
| EXPIRATION | `rc_expiration_event` | Subscription expired |
| PRODUCT_CHANGE | `rc_product_change_event` | Changed subscription product |
| BILLING_ISSUE | `rc_billing_issue_event` | Billing problem detected |
| NON_RENEWING_PURCHASE | `rc_non_subscription_purchase_event` | One-time purchase |

## Event Properties

All events include:
- `product_id` - RevenueCat product identifier
- `price` - Transaction price
- `currency` - Currency code (USD, EUR, etc.)
- `store` - App store (apple, google, stripe)
- `transaction_id` - Unique transaction ID

## Troubleshooting

**Events not appearing?**
- Verify your `app_user_id` matches MGM user identifiers
- Check that the event type is enabled in your integration settings
- Only production events are tracked (sandbox events are ignored)

**Authorization errors?**
- Ensure the auth token matches exactly (including no extra spaces)
- Format: `Bearer <token>` (with space after Bearer)
