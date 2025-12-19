# RetainAI TEST MATRIX
Version: 1.0
Status: Required before production demo

Legend:
- Smoke = must pass for deploy
- Edge = covers tricky failure modes

---

## A) Deployment smoke
### T-A1 Health check (Smoke)
Pre: backend deployed
Steps:
1) GET /health
Expected:
- 200 OK

### T-A2 Migrations applied (Smoke)
Pre: DB reachable
Steps:
1) Deploy backend
2) Verify no prisma migrate errors
Expected:
- Service boots and serves /health

---

## B) Auth tests
### T-B1 Login success (Smoke)
Pre: seeded Employee with badgeId
Steps:
1) POST /auth/login { badgeId }
Expected:
- 200
- accessToken + refreshToken returned

### T-B2 Login unknown badge (Edge)
Steps:
1) POST /auth/login with invalid badgeId
Expected:
- 404 EMPLOYEE_NOT_FOUND

### T-B3 Manager RBAC (Smoke)
Pre: two tokens (ASSOCIATE and MANAGER)
Steps:
1) GET /map/floor-state using ASSOCIATE token
Expected:
- 403 FORBIDDEN
Steps:
2) GET /map/floor-state using MANAGER token
Expected:
- 200 OK

---

## C) Bot tests (Eva)
### T-C1 New candidate creation (Smoke)
Steps:
1) POST /api/bot/webhook (Twilio-signed) with new From + Body
Expected:
- Candidate created with phone unique
- ConversationSession created
- MessageLog INBOUND + OUTBOUND created

### T-C2 State progression (Smoke)
Steps:
1) Send message -> GREETING -> asks name
2) Send name -> asks 18+
3) Send YES -> asks lift
4) Send YES -> sends VJT link
Expected:
- Candidate.status transitions NEW -> SCREENING -> VJTPENDING
- currentState ends VJT_LINK_SENT

### T-C3 Knockout rejection (Edge)
Steps:
1) Complete name
2) Send NO to 18+ or lift
Expected:
- Candidate.status = REJECTEDCOOLDOWN
- currentState = REJECTED

### T-C4 Idempotent re-ping (Edge)
Steps:
1) When in VJT_LINK_SENT, send any text
Expected:
- Re-sends VJT link (no state change)

---

## D) VJT tests
### T-D1 Submit pass (Smoke)
Steps:
1) POST /candidates/vjt/submit score=600
Expected:
- passed true
- Candidate.status=VJTPASSED

### T-D2 Submit fail + cooldown (Smoke)
Steps:
1) POST /candidates/vjt/submit score=599
Expected:
- passed false
- Candidate.status=VJTFAILED
- coolDownUntil set to ~now+90d

### T-D3 Nonce invalid (Edge)
Steps:
1) POST /candidates/vjt/submit with bad nonce
Expected:
- 401/403 with errorCode INVALID_NONCE (or VALIDATION_ERROR depending on implementation)
- Candidate unchanged

---

## E) Events ingestion tests
### T-E1 Batch ingest success (Smoke)
Steps:
1) POST /events/batch with 2 events
Expected:
- 200
- synced=2, failed=0
- 2 ScanEvent rows inserted

### T-E2 Batch idempotency (Smoke)
Steps:
1) Send same batch again (same eventId)
Expected:
- 200
- synced counts include duplicates as success
- DB row count unchanged for those ids

### T-E3 Partial failure 206 (Edge)
Steps:
1) Send batch with 1 valid event and 1 invalid (missing barcode)
Expected:
- 206
- synced=1
- failed=1 with per-item error

### T-E4 Unknown employee (Edge)
Steps:
1) Send event with non-existent employeeId
Expected:
- 206 with EMPLOYEE_NOT_FOUND for that event

---

## F) Offline sync tests (scanner)
### T-F1 Offline queue persists (Smoke)
Steps:
1) Turn off network
2) Perform 10 scans
Expected:
- mutationqueue has 10 PENDING rows
- UI shows 10 scans (optimistic)

### T-F2 Reconnect drains queue (Smoke)
Steps:
1) Turn on network
2) Wait for sync worker
Expected:
- /events/batch called in batches of 50
- PENDING rows become SYNCED
- Server has corresponding ScanEvent rows

### T-F3 Retry and poison (Edge)
Steps:
1) Force server to return 500 for > 6 attempts
Expected:
- retrycount increments
- item becomes POISON after attempt 6

---

## G) Map tests
### T-G1 Map shows active worker after scan (Smoke)
Steps:
1) Ingest scan for employee
2) GET /map/floor-state as manager
Expected:
- employee present with status=active
- coordinates deterministic (stable for same location string)

---

## H) ADAPT tests
### T-H1 Cron generates records (Smoke)
Steps:
1) Seed scan events for multiple employees in last 24h
2) Run ADAPT job (or call internal trigger in dev)
Expected:
- AdaptRecords created for bottom 5% (min 1)
- status=PENDINGREVIEW

### T-H2 Approve (Smoke)
Steps:
1) PUT /adapt/:id/approve
Expected:
- status=APPROVEDDELIVERED
- deliveredAt set

### T-H3 Override requires reason (Edge)
Steps:
1) PUT /adapt/:id/override with empty reason
Expected:
- 400 VALIDATION_ERROR
Steps:
2) PUT with reason
Expected:
- status=EXEMPTED
