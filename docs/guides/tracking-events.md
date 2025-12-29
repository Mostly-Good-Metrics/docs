---
sidebar_position: 1
---

# Tracking Events

Events are the foundation of analytics. Each event represents something that happened in your app.

## Event Naming

Event names must:
- Start with a letter (or `$` for system events)
- Contain only alphanumeric characters and underscores
- Be 255 characters or less

```typescript
// Valid
track('button_clicked')
track('PurchaseCompleted')
track('step_1_completed')

// Invalid (will be ignored)
track('123_event')      // starts with number
track('event-name')     // contains hyphen
track('event name')     // contains space
```

:::tip Use snake_case
We recommend `snake_case` for consistency: `button_clicked`, `purchase_completed`, `user_signed_up`.
:::

## Event Properties

Properties add context to events:

```typescript
track('purchase_completed', {
  product_id: 'SKU123',
  price: 29.99,
  currency: 'USD',
  items: ['shirt', 'shoes'],
  metadata: {
    campaign: 'summer_sale'
  }
});
```

### Property Types

| Type | Example |
|------|---------|
| String | `"hello"` |
| Number | `42`, `3.14` |
| Boolean | `true`, `false` |
| Null | `null` |
| Array | `["a", "b", "c"]` |
| Object | `{ key: "value" }` |

### Limits

- String values: truncated to 1000 characters
- Nesting depth: max 3 levels
- Total properties size: max 10KB

## Common Event Patterns

### User Actions

```typescript
track('button_clicked', { button_name: 'submit' });
track('link_clicked', { url: '/pricing' });
track('form_submitted', { form_name: 'signup' });
```

### Feature Usage

```typescript
track('feature_used', { feature: 'dark_mode' });
track('search_performed', { query: 'shoes', results: 42 });
track('filter_applied', { filter: 'price', value: '0-50' });
```

### Commerce

```typescript
track('product_viewed', { product_id: 'SKU123', price: 29.99 });
track('added_to_cart', { product_id: 'SKU123', quantity: 1 });
track('checkout_started', { cart_value: 89.99 });
track('purchase_completed', { order_id: 'ORD123', total: 89.99 });
```

### Onboarding

```typescript
track('onboarding_started');
track('onboarding_step_completed', { step: 1, step_name: 'profile' });
track('onboarding_completed', { duration_seconds: 120 });
```

## Reserved Properties

Properties starting with `$` are reserved for system use:

| Property | Description |
|----------|-------------|
| `$version` | App version |
| `$device_type` | Device type (phone, tablet, desktop) |
| `$device_model` | Device model identifier |
| `$sdk` | SDK identifier |

Avoid using `$` prefix for your own properties.

## Automatic Properties

Every event automatically includes:

| Property | Description |
|----------|-------------|
| `platform` | Platform (ios, android, web) |
| `os_version` | OS version |
| `app_version` | App version |
| `session_id` | Unique session ID |
| `user_id` | User ID (if identified) |
| `timestamp` | Event timestamp (UTC) |
