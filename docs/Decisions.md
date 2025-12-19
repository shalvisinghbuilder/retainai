# RetainAI — DECISIONS (LOCKED)
Version: 1.0
Status: LOCKED
Owner: Engineering

If any document conflicts with this file, this file wins.

---

## 1) Scope (MVP)
### 1.1 Must-ship modules
- Candidate funnel: Twilio SMS/WhatsApp bot ("Eva") -> VJT -> pass/fail -> Candidate status transitions.
- Operations: scanner app (offline-first) -> event ingestion -> realtime map.
- Management: ADAPT daily job -> manager approve/override queue.

### 1.2 Explicit MVP non-goals
- No payroll integration (ADP/Workday). RetainAI is operational telemetry only.
- No automated termination. ADAPT creates recommendations only; manager is human-in-loop.
- No LLM requirement; bot is deterministic state machine.

---

## 2) Candidate gates (LOCKED)
### 2.1 Eva Bot questions
Sequence is locked:
1) Collect full legal name (free text).
2) Confirm age >= 18 (YES/NO).
3) Confirm can lift 50lbs repeatedly (YES/NO).
If YES to both confirmations -> send VJT link and set Candidate.status = VJTPENDING.
If NO to either -> Candidate.status = REJECTEDCOOLDOWN.

### 2.2 VJT rules
- Duration: 60 seconds.
- Score range: 0..1000 (integer).
- Pass threshold: >= 600.
- If fail:
  - Candidate.status = VJTFAILED
  - Candidate.coolDownUntil = now + 90 days
- If pass:
  - Candidate.status = VJTPASSED

---

## 3) Offline-first (Scanner) (LOCKED)
### 3.1 Offline is mandatory
- Every scan MUST be persisted to device SQLite first.
- UI MUST NOT block on network.
- Background sync uploads events in batches.

### 3.2 Batch + queue sizing
- Batch size: 50 events per POST.
- Max local queue rows: 2000.

### 3.3 Retry/backoff
- Backoff: 1s, 2s, 5s, 30s, 5m (repeat).
- Max attempts: 6 -> mark POISON (stop retrying).

### 3.4 Retention
- Keep SYNCED rows: 24h then delete.
- Keep POISON rows: 72h then delete.

### 3.5 Idempotency
- Client generates UUID per scan: eventId.
- Server dedupes by ScanEvent.id (eventId) and treats duplicates as success.

---

## 4) ADAPT engine (LOCKED)
### 4.1 Schedule
- Runs daily at 04:00.

### 4.2 Window
- Last 24 hours of ScanEvent.

### 4.3 Selection rule
- Compute scan count per employee in window as productivity proxy.
- Bottom 5% selection:
  - k = floor(n * 0.05)
  - minimum k = 1
- Create AdaptRecord:
  - type = PRODUCTIVITY
  - status = PENDINGREVIEW
  - metricValue = employee scan count
  - metricThreshold = cutoff scan count (kth item)

### 4.4 Human-in-loop
- Only manager/admin can approve or exempt.
- No auto-termination.

---

## 5) API + deployment (LOCKED)
### 5.1 Core endpoints must exist
- POST /health
- POST /auth/login
- POST /auth/refresh
- POST /api/bot/webhook
- POST /candidates/vjt/submit
- POST /events/scan (optional helper)
- POST /events/batch (primary ingestion)
- GET  /map/floor-state
- GET  /adapt/queue
- PUT  /adapt/:id/approve
- PUT  /adapt/:id/override

### 5.2 Standard error format (mandatory)
All non-2xx responses (except Twilio/TwiML responses if used) must return JSON:
{
  "statusCode": number,
  "errorCode": string,
  "message": string,
  "timestamp": ISO8601
}

### 5.3 Environment variable naming (locked)
- Postgres connection string env var name: DATABASEURL
- Redis connection string env var name: REDISURL
- JWT secret env var name: JWTSECRET
