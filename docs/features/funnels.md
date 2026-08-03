---
sidebar_position: 2
---

# Funnels

A funnel measures how many users progress through an ordered sequence of events — and where they drop off.

## What a funnel is

A funnel is defined by:

- **Steps** — an ordered list of events, e.g. `signed_up` → `created_project` → `sent_first_event`
- **Conversion window** — the maximum time a user has to complete all steps (optional; unlimited if unset)
- **Date range** — which cohort of users to look at
- **Breakdown** — optionally segment results by a property (e.g. platform)

For each step you get the number of users who reached it and the conversion rate, plus an overall first-step-to-last-step conversion:

```
Signed Up          1000   100%
Created Project     680    68%
Sent First Event    450    45%
```

A user counts for a step only if they performed the step events **in order** within the window. The dashboard can also suggest funnels based on common paths in your data.

## How to instrument for funnels

1. **Track a distinct event per step.** Each funnel step matches one event name. If your onboarding is one `onboarding_step` event with a `step` property, you can't build a step-per-screen funnel from it — track `onboarding_started`, `profile_completed`, `onboarding_finished` instead (or both).
2. **Keep identity consistent across steps.** Funnels join steps on the user ID. Call `identify()` at login/signup so pre- and post-signup steps link up — the [anonymous ID aliasing](/concepts#users-and-identity) handles the signup boundary automatically.
3. **Fire step events at the moment of success**, not intent. Track `purchase_completed` when the receipt confirms, not when the buy button is tapped (that's its own step).

```typescript
// A checkout funnel worth building
track('product_viewed', { product_id: 'SKU123' });
track('added_to_cart', { product_id: 'SKU123' });
track('checkout_started', { cart_value: 89.99 });
track('purchase_completed', { order_id: 'ORD123', total: 89.99 });
```

## Availability

Funnels are available on paid plans.

## Next steps

- [Retention](/features/retention) — what happens after they convert
- [Experiments](/features/experiments) — A/B test the drop-off points you find
