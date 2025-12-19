# RetainAI Scanner App

Offline-first mobile scanner app for warehouse associates.

## Features

- ✅ Offline-first architecture (SQLite queue)
- ✅ Background sync with retry logic
- ✅ BadgeId-based authentication
- ✅ Daily sentiment gate
- ✅ Barcode scanning (camera + manual entry)
- ✅ Real-time stats and queue monitoring

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set environment variables:
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
```

3. Start the app:
```bash
pnpm start
```

## Architecture

### Offline-First Design
- All scans written to SQLite first
- Background sync every 30 seconds
- Retry with exponential backoff
- Queue limit: 2000 items
- Retention: SYNCED (24h), POISON (72h)

### Services
- `database.service.ts` - SQLite queue management
- `sync.service.ts` - Background sync with retry logic
- `auth.service.ts` - Authentication and token management
- `scan.service.ts` - Scan recording

### Screens
- `LoginScreen` - BadgeId login
- `SentimentScreen` - Daily sentiment gate (1-5 stars)
- `ScanScreen` - Main scanning interface
- `StatsScreen` - Queue statistics

## Queue Schema

```sql
CREATE TABLE mutationqueue (
  id TEXT PRIMARY KEY,
  actiontype TEXT NOT NULL, -- 'SCAN' | 'SENTIMENT'
  payload TEXT NOT NULL, -- JSON string
  status TEXT NOT NULL, -- 'PENDING' | 'SYNCED' | 'FAILED_FATAL' | 'POISON'
  retrycount INTEGER NOT NULL DEFAULT 0,
  nextretryat INTEGER, -- epoch ms
  createdat INTEGER NOT NULL, -- epoch ms
  updatedat INTEGER NOT NULL -- epoch ms
);
```

## Sync Algorithm

1. Trigger: Every 30s + connectivity regained + after new scan
2. Select oldest PENDING items (limit 50)
3. POST to `/events/batch`
4. Handle responses:
   - 200: Mark all SYNCED
   - 206: Mark successes SYNCED, failures FAILED_FATAL
   - 400: Mark all FAILED_FATAL
   - 500/timeout: Retry with backoff

## Retry Logic

- Max retries: 6
- Backoff: 1s, 2s, 5s, 30s, 5m (repeat)
- After 6 retries: Mark as POISON

