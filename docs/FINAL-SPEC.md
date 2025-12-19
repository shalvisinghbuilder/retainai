# RetainAI FINAL SPEC (Canonical)
Version: 1.0
Status: READY FOR BUILD
Doc owner: Engineering

This document defines runtime behavior, API contracts, and edge cases for the MVP.

---

## 0) Canonical sources
Order of truth:
1) docs/DECISIONS.md (LOCKED)
2) docs/FINAL-SPEC.md (this document)
3) packages/db/prisma/schema.prisma

---

## 1) System overview
RetainAI MVP consists of:
- Eva Bot (Twilio SMS/WhatsApp) for screening and VJT link distribution
- VJT (web) to produce a numeric score and pass/fail
- Scanner app (mobile, offline-first) to record work events
- Backend ingestion + realtime map updates
- ADAPT daily job + manager review queue

---

## 2) Roles & access control
### 2.1 Roles (DB enum Role)
- ASSOCIATE: can ingest scans and submit sentiment
- MANAGER: all associate permissions + view map + view/act on ADAPT queue
- ADMIN: same as manager (future admin features allowed)

### 2.2 Auth requirements
- JWT required for:
  - /events/*
  - /map/*
  - /adapt/*
- JWT NOT required for:
  - /api/bot/webhook (Twilio signature required)
  - /candidates/vjt/* (candidate nonce required)

---

## 3) Data model invariants
### 3.1 Candidate invariants
- Candidate identity is Candidate.id (uuid).
- Candidate.phone is unique.
- Candidate.coolDownUntil, if set, blocks re-attempt of VJT until time passes.

### 3.2 Conversation invariants
- Exactly one ConversationSession per Candidate (ConversationSession.candidateId is unique).
- All inbound/outbound messages are written to MessageLog.

### 3.3 Employee invariants
- Employee.badgeId is unique.
- Employee.role controls RBAC.

### 3.4 Scan event invariants (idempotency)
- ScanEvent.id equals device-generated eventId UUID.
- Duplicate ScanEvent.id must be treated as success (idempotent write).

### 3.5 Sentiment invariants
- Store SentimentResponse with score 1..5.
- Enforce “one per employee per day” in service logic (MVP) using date-bucket check.

### 3.6 ADAPT invariants
- AdaptRecord is append-only (no delete).
- Allowed updates:
  - status changes (PENDINGREVIEW -> APPROVEDDELIVERED | EXEMPTED)
  - deliveredAt timestamp on approve
- Do not mutate metricValue/metricThreshold after creation.

---

## 4) Eva Bot (Twilio) — deterministic state machine
### 4.1 Endpoint
POST /api/bot/webhook
- Content-Type: application/x-www-form-urlencoded
- Must verify Twilio request signature (reject invalid with 403).

### 4.2 Normalization rules
- Trim whitespace.
- YES aliases: Y, YES, YEP, OK, SURE
- NO aliases: N, NO, NOPE

### 4.3 State machine
ConversationSession.currentState is a string (MVP states):
- GREETING
- AWAITING_NAME
- AWAITING_AGE_CONFIRM
- AWAITING_LIFT_CONFIRM
- VJT_LINK_SENT
- REJECTED

### 4.4 Transition table (locked behavior)
| State | Input | Next | Candidate status effect | Response |
|---|---|---|---|---|
| GREETING | any | AWAITING_NAME | NEW -> SCREENING | Ask full legal name |
| AWAITING_NAME | any text | AWAITING_AGE_CONFIRM | stay SCREENING | Ask 18+ YES/NO |
| AWAITING_AGE_CONFIRM | YES | AWAITING_LIFT_CONFIRM | stay SCREENING | Ask lift 50lbs YES/NO |
| AWAITING_AGE_CONFIRM | NO | REJECTED | status -> REJECTEDCOOLDOWN | Reject age |
| AWAITING_LIFT_CONFIRM | YES | VJT_LINK_SENT | status -> VJTPENDING | Send VJT link |
| AWAITING_LIFT_CONFIRM | NO | REJECTED | status -> REJECTEDCOOLDOWN | Reject lifting |
| VJT_LINK_SENT | any | VJT_LINK_SENT | no change | Re-send VJT link |
| REJECTED | any | REJECTED | no change | Re-send rejection |

### 4.5 Message logging
For every webhook call:
- Insert MessageLog(direction=INBOUND, content=Body, timestamp=now).
- Insert MessageLog(direction=OUTBOUND, content=responseText, timestamp=now).

### 4.6 VJT link generation
Link format:
{VJT_BASE_URL}?candidate={candidateId}&nonce={signedNonce}

Nonce requirements:
- Signed, expiring (24h)
- Must NOT be an employee JWT

---

## 5) VJT (Virtual Job Tryout)
### 5.1 Purpose
Produces a numeric skillScore and pass/fail decision.

### 5.2 Rules (locked)
- Duration: 60 seconds
- Score range: 0..1000 integer
- Pass threshold: >= 600
- Fail -> 90-day cool-down

### 5.3 Submit endpoint
POST /candidates/vjt/submit

Request JSON:
{
  "candidateId": "uuid",
  "nonce": "signed-string",
  "skillScore": 720,
  "meta": { "clientVersion": "web-1.0.0" }
}

Response JSON:
{
  "passed": true,
  "candidateStatus": "VJTPASSED",
  "coolDownUntil": null
}

Validation:
- nonce must validate and not be expired
- skillScore integer 0..1000

Status transitions:
- passed => Candidate.status = VJTPASSED
- failed => Candidate.status = VJTFAILED, Candidate.coolDownUntil = now+90d

---

## 6) Scanner app (offline-first)
### 6.1 Non-negotiable behavior
- Write locally first (SQLite), then sync.
- Never block UI on network.
- Background sync drains queue when connectivity is available.

### 6.2 SQLite queue schema (device)
Table: mutationqueue
Columns:
- id (TEXT PK) -> UUID
- actiontype (TEXT) -> "SCAN" | "SENTIMENT"
- payload (TEXT) -> JSON string
- status (TEXT) -> "PENDING" | "SYNCED" | "FAILED_FATAL" | "POISON"
- retrycount (INTEGER)
- nextretryat (INTEGER, epoch ms, nullable)
- createdat (INTEGER, epoch ms)
- updatedat (INTEGER, epoch ms)

### 6.3 Queue limits and retention (locked)
- Max queue length: 2000
- Batch size: 50
- Retry attempts: 6
- SYNCED retention: 24h
- POISON retention: 72h

### 6.4 Sync algorithm (required)
- Trigger: every 30s + connectivity regained + after each new queued mutation.
- Select oldest PENDING LIMIT 50.
- POST /events/batch with events array for SCAN actions.
- On response:
  - 200 -> mark all SYNCED
  - 206 -> mark successes SYNCED; mark invalid payloads FAILED_FATAL; keep retryable failures as PENDING with backoff
  - 400 (envelope invalid) -> mark batch as FAILED_FATAL (implementation may log and stop)
  - 500/timeouts -> retry with backoff

---

## 7) Ingestion endpoints
### 7.1 POST /events/scan (optional helper)
Accepts a single scan; server performs same validation/idempotency as batch.

### 7.2 POST /events/batch (primary)
Request:
{
  "events": [
    {
      "eventId": "uuid",
      "employeeId": "uuid",
      "barcode": "string",
      "location": "string",
      "actionType": "PICK|STOW|COUNT|ERRORLOG",
      "timestamp": "ISO",
      "expectedSeconds": 15,
      "actualSeconds": 14.3,
      "isError": false,
      "errorCode": null
    }
  ]
}

Server mapping:
- ScanEvent.id = eventId
- ScanEvent.employeeId = employeeId
- ScanEvent.actionType = actionType
- ScanEvent.timestamp = timestamp
- etc.

Validation rules (per item):
- eventId required, UUID
- employeeId required, UUID (must exist)
- barcode required
- location required
- actionType required enum
- timestamp required ISO date
- expectedSeconds required numeric >= 0
- actualSeconds optional numeric >= 0

Idempotency rule:
- If ScanEvent.id already exists -> treat as success (do not error).

Response 200:
{ "synced": n, "failed": 0, "errors": [] }

Response 206:
{
  "synced": nOk,
  "failed": nBad,
  "errors": [{ "eventId": "uuid", "reason": "VALIDATION_ERROR", "message": "..." }]
}

---

## 8) Real-time map
### 8.1 GET /map/floor-state (MANAGER/ADMIN)
Returns current known positions of workers.

Position derivation:
- MVP: map location string deterministically to grid coordinates (stable hashing).
- Worker status:
  - active: lastScan < 2 minutes
  - idle: 2..15 minutes
  - offline: > 15 minutes

Response:
{
  "workers": [
    { "employeeId": "uuid", "x": 3, "y": 7, "status": "active", "lastScan": "ISO" }
  ],
  "timestamp": "ISO"
}

### 8.2 WebSocket (optional, recommended)
- On new ingested scan, broadcast locationupdate:
  { employeeId, x, y, timestamp }

---

## 9) ADAPT engine
### 9.1 Cron schedule
- Daily at 04:00

### 9.2 Algorithm (locked)
- Group ScanEvent last 24 hours by employeeId -> count scans
- Sort ascending
- Select bottom 5% with minimum 1
- Create AdaptRecord(type=PRODUCTIVITY, status=PENDINGREVIEW)
- metricValue = employee count
- metricThreshold = cutoff count

### 9.3 De-duplication
- Prevent multiple AdaptRecords for same employeeId, type, and date-bucket.
- If rerun, upsert by unique compound key (implementation decision: add DB unique or do lookup in code).

---

## 10) Manager console endpoints
### 10.1 GET /adapt/queue
Response:
{
  "items": [
    {
      "id": "uuid",
      "employeeId": "uuid",
      "type": "PRODUCTIVITY|QUALITY|ATTENDANCE",
      "status": "PENDINGREVIEW|APPROVEDDELIVERED|EXEMPTED",
      "metricValue": 42,
      "metricThreshold": 55,
      "generatedAt": "ISO",
      "deliveredAt": null
    }
  ]
}

### 10.2 PUT /adapt/:id/approve
Request:
{ "managerNote": "optional string" }

Behavior:
- Set status = APPROVEDDELIVERED
- Set deliveredAt = now

### 10.3 PUT /adapt/:id/override
Request:
{ "exemptionReason": "required string" }

Behavior:
- Set status = EXEMPTED

---

## 11) Standard errors
All JSON APIs return on error:
{
  "statusCode": 400,
  "errorCode": "VALIDATION_ERROR|UNAUTHORIZED|FORBIDDEN|NOT_FOUND|CONFLICT|INTERNAL",
  "message": "string",
  "timestamp": "ISO"
}
