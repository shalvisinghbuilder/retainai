# RetainAI VJT Web App

Virtual Job Tryout web application for candidate assessment.

## Features

- ✅ Landing screen with job preview
- ✅ Cooldown check and blocking
- ✅ 60-second interactive game
- ✅ Drag-and-drop interface
- ✅ Real-time scoring (0-1000)
- ✅ Pass/fail result screen
- ✅ Mobile-friendly (touch-first)

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

4. Open [http://localhost:3001](http://localhost:3001)

## Screens

### C1: Landing Screen
- Job preview and instructions
- Start button
- Cooldown check (blocks if in cooldown)

### C2: Game Screen
- 60-second timer
- Score display (0-1000)
- Drag-and-drop items into bins
- Correct action: +100 points
- Incorrect action: -50 points

### C3: Result Screen
- Pass: Congratulations message
- Fail: Not eligible + cooldown date

## Game Logic

- **Duration:** 60 seconds
- **Score Range:** 0-1000
- **Pass Threshold:** >= 600
- **Scoring:**
  - Correct placement: +100 points
  - Wrong placement: -50 points
  - Score capped at 0 and 1000

## URL Parameters

- `candidate` - Candidate ID (UUID)
- `nonce` - Signed nonce for authentication (24h expiration)

Example:
```
http://localhost:3001?candidate=abc-123&nonce=xyz-789
```

## Technology

- Next.js 14 (App Router)
- React 18
- React DnD (drag-and-drop)
- TypeScript
- CSS Modules

