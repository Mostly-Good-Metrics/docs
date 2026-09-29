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
- **Participant maturity** — optionally wait until each participant has had a
  fixed number of days before including them in results
- **Status** — created in the dashboard, then started and stopped explicitly

Assignment happens on the server by default (see [local enrollment](#local-experiment-enrollment) for on-device bucketing) and is **sticky**: the same user always gets the same variant while the experiment runs. Users who were assigned while anonymous keep their variant after they log in — the SDK re-fetches assignments with both IDs and the server links them.

## How to instrument

### 1. Branch on the variant

All six SDKs fetch and cache assignments automatically:

```typescript
// JavaScript / React Native / Capacitor
await MostlyGoodMetrics.ready(); // wait for assignments (default timeout 5s)
const variant = MostlyGoodMetrics.getVariant('checkout-flow', 'control');
if (variant === 'treatment') {
  // show the new checkout
}
```

```swift
// Swift
let variant = MostlyGoodMetrics.getVariant("checkout-flow", fallback: "control")
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

### Participant maturity

When participant maturity is set to 14 days, someone is excluded from the
result denominator until 14 full days after enrollment. Once they are mature,
all of their conversions after enrollment count—including a conversion on day
15 or later. The threshold is not a conversion deadline.

The API and MCP currently expose this stored setting as
`conversion_window_days` for compatibility. Treat it as participant maturity,
despite the legacy field name. A temporary result-query override changes only
that execution; it does not prove or modify the saved experiment setting.

Because conversions join on user ID rather than requiring the experiment property on the goal event itself, server-side goal events — like purchases reported by the [RevenueCat integration](/integrations/revenuecat) — attribute correctly, as long as the user IDs match.

## Local experiment enrollment

By default (`experimentMode: 'server'`), the SDK asks the server which variant a user is assigned to. Set `experimentMode: 'local'` and the SDK instead fetches only the experiment *configurations* — ID, name, and variant list, via [`GET /v1/experiments/configs`](/api/experiments#get-v1experimentsconfigs) — and buckets the user **on device**:

```typescript
MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
  experimentMode: 'local',
});

// Same API as server mode
const variant = MostlyGoodMetrics.getVariant('checkout-flow', 'control');
```

Provide the configs inline via `localExperiments` and the SDK makes no experiments network request at all:

```typescript
MostlyGoodMetrics.configure({
  apiKey: 'mgm_proj_your_api_key',
  experimentMode: 'local',
  localExperiments: [
    {
      id: '7b1e8a90-4c2d-4f6a-9e3b-2a1d5c8f0e71', // must match the server-side experiment ID
      name: 'checkout-flow',
      variants: ['control', 'treatment'],
    },
  ],
});
```

All six SDKs support both modes with the same option names (Swift: `experimentMode: .local` with `MGMExperimentConfig`; Android: `MGMExperimentMode.LOCAL`; Flutter: `MGMExperimentMode.local`).

How it works:

- **Deterministic bucketing** — the bucket is the first 8 bytes of `SHA-256("<experiment_uuid>:<user_id>")` as a big-endian unsigned 64-bit integer, and the variant is `variants[bucket % variants.length]`. Every SDK and the server use the same algorithm, so the same ID gets the same variant everywhere.
- **Sticky assignments** — the first `getVariant()` call persists the assignment (per experiment UUID) and reuses it from then on; `identify()` never re-buckets. A forget-me reset (`clearAnonymousId: true`) clears the persisted assignments so the rotated anonymous ID is bucketed fresh.
- **Exposure works the same** — the first `getVariant()` hit tracks `$experiment_exposure`, deduplicated per user, experiment, and variant.
- **Privacy benefit** — no user identifier is ever sent to the server for assignment: the configs endpoint takes no user parameters, and inline configs send nothing at all.

**Cross-device caveat:** local bucketing hashes whatever ID the device currently uses and cannot resolve aliases. A user who is anonymous on one device and identified on another may receive different variants on each; server mode resolves identity aliases, local mode cannot. Use server mode when cross-device consistency matters.

## Good hygiene

- **Call `getVariant()` at the decision point**, not speculatively at startup — exposure marks the user as enrolled, and enrolling users who never saw the difference dilutes your results.
- **One decision per experiment.** If you need to branch two unrelated things, run two experiments.
- **Let it run.** Stopping early on a promising day mostly measures noise.

## Next steps

- [`GET /v1/experiments`](/api/experiments) — the underlying API and manual exposure tracking
- [Funnels](/features/funnels) — find the drop-off worth experimenting on
