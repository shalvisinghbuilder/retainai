# RetainAI Manager Dashboard

Manager dashboard for viewing real-time worker positions and managing ADAPT queue.

## Features

- ✅ BadgeId-based authentication (Manager/Admin only)
- ✅ Live floor map with worker positions
- ✅ Color-coded worker status (active/idle/offline)
- ✅ ADAPT queue management
- ✅ Approve/Override AdaptRecords
- ✅ Real-time updates (polling)

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set environment variables:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Run development server:
```bash
pnpm dev
```

4. Open [http://localhost:3002](http://localhost:3002)

## Screens

### Login Screen
- BadgeId input
- Manager/Admin role validation
- Token storage (localStorage)

### Live Map Screen (M1)
- Worker positions on grid
- Color coding:
  - Green: active (< 2 min)
  - Orange: idle (2-15 min)
  - Gray: offline (> 15 min)
- Click worker for details
- Auto-refresh every 5 seconds

### ADAPT Queue Screen (M2)
- Table of pending AdaptRecords
- Columns: Employee, Type, Metric Value, Threshold, Generated At
- Actions: Approve, Override
- Auto-refresh every 10 seconds

## Authentication

- Requires Manager or Admin role
- JWT token stored in localStorage
- Token sent with all API requests

## API Endpoints Used

- `POST /auth/login` - BadgeId login
- `GET /map/floor-state` - Get worker positions
- `GET /adapt/queue` - Get pending AdaptRecords
- `PUT /adapt/:id/approve` - Approve AdaptRecord
- `PUT /adapt/:id/override` - Override AdaptRecord

## Technology

- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS Modules

