---
sidebar_position: 100
---

# API Reference

Direct HTTP API for sending events to Mostly Good Metrics.

## Authentication

All requests require an API key in the `Authorization` header:

```
Authorization: Bearer mgm_proj_your_api_key
```

## Endpoints

### POST /api/events

Send one or more events.

**Request:**

```bash
curl -X POST https://ingest.mostlygoodmetrics.com/api/events \
  -H "Authorization: Bearer mgm_proj_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "name": "button_clicked",
        "user_id": "user_123",
        "timestamp": "2024-01-15T10:30:00Z",
        "properties": {
          "button_name": "signup"
        }
      }
    ]
  }'
```

**Response:**

```json
{
  "success": true,
  "events_received": 1
}
```

## Event Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Event name |
| `user_id` | string | No | User identifier |
| `timestamp` | string | No | ISO 8601 timestamp (defaults to now) |
| `properties` | object | No | Custom properties |
| `session_id` | string | No | Session identifier |

## Rate Limits

| Plan | Rate Limit |
|------|------------|
| Free | 100 requests/minute |
| Pro | 1000 requests/minute |
| Enterprise | Custom |

When rate limited, you'll receive a `429` response with a `Retry-After` header.

## Compression

For payloads > 1KB, use gzip compression:

```bash
curl -X POST https://ingest.mostlygoodmetrics.com/api/events \
  -H "Authorization: Bearer mgm_proj_your_api_key" \
  -H "Content-Type: application/json" \
  -H "Content-Encoding: gzip" \
  --data-binary @events.json.gz
```

## Error Responses

| Status | Meaning |
|--------|---------|
| `400` | Invalid request body |
| `401` | Invalid or missing API key |
| `429` | Rate limited |
| `500` | Server error |

```json
{
  "success": false,
  "error": "Invalid API key"
}
```
