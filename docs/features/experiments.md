---
sidebar_position: 4
---

# Experiments

Experiments are server-assigned A/B tests: you define variants and a goal event in the dashboard, ask the SDK which variant a user is in, and MGM measures which variant converts better.

## What an experiment is

An experiment has:

- **Name** — e.g. `checkout-flow` (stick to ASCII names)
- **Variants** — e.g. `control` and `treatment` (default: `a` and `b`)
- **Goal event** — the event that counts as a conversion, e.g. `purchase_completed`
- **Status** — created in the dashboard, then started and stopped explicitly

Assignment happens on the server and is **sticky**: the same user always gets the same variant while the experiment runs. Users who were assigned while anonymous keep their variant after they log in — the SDK re-fetches assignments with both IDs and the server links them.

## How to instrument

### 1. Branch on the variant

The JavaScript, Android, React Native, and Flutter SDKs fetch and cache assignments automatically:

```typescript
// JavaScript / React Native
await MostlyGoodMetrics.ready(); // wait for assignments (default timeout 5s)
const variant = MostlyGoodMetrics.getVariant('checkout-flow', 'control');
if (variant === 'treatment') {
  // show the new checkout
}
```

```kotlin
// Android
val variant = MostlyGoodMetrics.getVariant("checkout-flow", fallback = "control")
```

```dart
// Flutter
final variant = MostlyGoodMetrics.getVariant('checkout-flow', fallback: 'control');
```

The second argument is the fallback returned when assignments haven't loaded yet (first launch, offline) — make it your control experience.

The Swift and Capacitor SDKs don't have a `getVariant` API yet; you can call [`GET /v1/experiments`](/api/experiments) directly and track exposure yourself.

### 2. Exposure is tracked for you

The first time `getVariant()` returns a variant, the SDK tracks a `$experiment_exposure` event and attaches the assignment to every subsequent event as a `$experiment_{name}` super property. No code needed.

### 3. Track the goal event

Just track your goal event as usual, anywhere:

```typescript
MostlyGoodMetrics.track('purchase_completed', { total: 29.99 });
```

## How results are counted

- A user is **enrolled** in a variant from their first exposure event (or first event carrying the `$experiment_*` property) during the run.
- A **conversion** is a goal event fired at or after enrollment, joined on the canonical user ID.

Because conversions join on user ID rather than requiring the experiment property on the goal event itself, server-side goal events — like purchases reported by the [RevenueCat integration](/integrations/revenuecat) — attribute correctly, as long as the user IDs match.

## Good hygiene

- **Call `getVariant()` at the decision point**, not speculatively at startup — exposure marks the user as enrolled, and enrolling users who never saw the difference dilutes your results.
- **One decision per experiment.** If you need to branch two unrelated things, run two experiments.
- **Let it run.** Stopping early on a promising day mostly measures noise.

## Next steps

- [`GET /v1/experiments`](/api/experiments) — the underlying API and manual exposure tracking
- [Funnels](/features/funnels) — find the drop-off worth experimenting on
