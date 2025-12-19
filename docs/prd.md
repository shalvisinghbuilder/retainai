# RetainAI PRD (Single Source)
Version: 1.0
Status: Approved (MVP)
Owner: Product + Engineering

This PRD defines the screens and UX behavior for the MVP.

---

## 1) Personas
- Candidate (public): interacts via SMS/WhatsApp and VJT web.
- Associate: uses scanner app on device while working.
- Manager: uses web dashboard (map + ADAPT queue).

---

## 2) Candidate experience
### 2.1 SMS/WhatsApp flow (Eva Bot)
Entry: Candidate texts keyword (or any message) to Twilio number.
- Eva collects:
  - Full legal name
  - 18+ confirmation
  - Lift 50lbs confirmation
- On pass: Eva sends VJT link.
- On fail: Eva sends rejection message and stops.

UX rules:
- Messages must be short (SMS-safe) and not contain internal tokens.
- If candidate sends messages out-of-order, Eva repeats the last required question.

### 2.2 VJT portal screens
#### Screen C1: VJT Landing
- Shows job preview and “Start” CTA.
- If candidate is in cool-down:
  - Show block page: “Re-apply after {coolDownUntil}”
  - Disable Start.

#### Screen C2: VJT Game
- 60-second timer visible.
- Score visible (0..1000).
- Interactions:
  - Drag/drop items into bins
  - Correct action increments score
  - Incorrect action decrements score
- Must be mobile friendly (touch-first).
- Must not require account signup.

#### Screen C3: Result
- If pass (>= 600): “Passed” screen.
- If fail: “Not eligible right now” + cool-down date.

---

## 3) Associate (Scanner app)
### 3.1 Screen A1: Login
- BadgeId input (manual entry or scan)
- Submit triggers login request when online.
- If offline and no token cached: show “No connectivity” and block (MVP acceptable).

### 3.2 Screen A1b: Daily Sentiment Gate (blocking)
- Must appear once per day after login and before work screen.
- Question (locked):
  “Did you have the tools to succeed yesterday?”
- Score: 1..5
- No skip.
- On submit:
  - write to SQLite queue immediately
  - proceed to Work screen immediately

### 3.3 Screen A2: Work / Scan loop
Primary UI requirements:
- Big scan affordance (hardware trigger or software button).
- Immediate feedback:
  - Success: green flash + short vibration
  - Error: red flash + long vibration
- Must display:
  - Current UPH counter (simple count proxy for MVP)
  - Current location label
- On each scan:
  - write to SQLite (PENDING)
  - optimistic UI increment
  - background sync attempt

### 3.4 Screen A3: Stats (optional for MVP)
- Simple read-only:
  - scans today
  - last sync time
  - queue depth (PENDING count)

---

## 4) Manager web (Dashboard)
### 4.1 Screen M1: Live map
- Shows worker dots on grid.
- Color coding:
  - green: active
  - black/gray: idle
  - red: error (if last scan isError or error rate heuristic)
- Hover/click shows:
  - employeeId
  - lastScan timestamp

Update mechanism:
- WebSocket preferred, polling fallback allowed.

### 4.2 Screen M2: ADAPT Queue
- Table columns:
  - employeeId
  - type
  - metricValue
  - metricThreshold
  - status
  - generatedAt
- Actions:
  - Approve (sets APPROVEDDELIVERED)
  - Override/Exempt (requires exemptionReason, sets EXEMPTED)
