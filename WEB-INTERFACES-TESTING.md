# RetainAI Web Interfaces - Testing Guide

**Date:** December 17, 2025

---

## 🌐 Available Web Interfaces

RetainAI MVP has **2 web applications** for testing:

### 1. VJT Web App (Candidate Assessment)
**URL:** http://localhost:3001  
**Port:** 3001 (default Next.js dev)  
**Purpose:** Virtual Job Tryout for candidates

### 2. Manager Dashboard
**URL:** http://localhost:3002  
**Port:** 3002 (explicitly configured)  
**Purpose:** Manager/Admin operations dashboard

---

## 🚀 Starting the Web Interfaces

### Start VJT App
```bash
cd apps/vjt
pnpm dev
# Opens on http://localhost:3001
```

### Start Manager Dashboard
```bash
cd apps/dashboard
pnpm dev
# Opens on http://localhost:3002
```

### Start Both (from root)
```bash
# Terminal 1: VJT
cd apps/vjt && pnpm dev

# Terminal 2: Dashboard
cd apps/dashboard && pnpm dev

# Terminal 3: API (if not running)
cd apps/api && pnpm start:dev
```

---

## 1. VJT Web App (http://localhost:3001)

### Overview
Candidate-facing web application for taking the Virtual Job Tryout assessment.

### Screens

#### **C1: Landing Screen**
- **URL:** `http://localhost:3001?candidate={candidateId}&nonce={nonce}`
- **Features:**
  - Job preview and instructions
  - Start button
  - Cooldown check (blocks if candidate is in cooldown)
- **Required URL Parameters:**
  - `candidate` - Candidate ID (UUID)
  - `nonce` - Signed nonce token (24h expiration)

#### **C2: Game Screen**
- **Features:**
  - 60-second countdown timer
  - Real-time score display (0-1000)
  - Drag-and-drop interface
  - Items to sort into correct/incorrect bins
  - Scoring:
    - Correct placement: +100 points
    - Wrong placement: -50 points
    - Score capped at 0-1000

#### **C3: Result Screen**
- **Features:**
  - **Pass (score >= 600):** Congratulations message
  - **Fail (score < 600):** Not eligible + cooldown date (90 days)

### Testing Steps

1. **Get a valid candidate and nonce:**
   - Send SMS to Twilio number to start Eva Bot conversation
   - Complete screening (name, age, lift confirmation)
   - Eva Bot will send VJT link with candidate ID and nonce

2. **Test Landing Screen:**
   ```
   http://localhost:3001?candidate=abc-123-uuid&nonce=xyz-789-nonce
   ```
   - Should show job preview
   - Click "Start Assessment" to begin

3. **Test Game Screen:**
   - 60-second timer starts
   - Drag items into bins
   - Watch score update in real-time
   - Timer ends → auto-submit

4. **Test Result Screen:**
   - Shows pass/fail based on score
   - If fail, shows cooldown date

### Test Scenarios

- ✅ **Valid candidate + nonce** → Should work
- ✅ **Missing params** → Should show error/landing
- ✅ **Expired nonce** → API will reject
- ✅ **Cooldown active** → Landing screen blocks start
- ✅ **Score >= 600** → Pass result
- ✅ **Score < 600** → Fail result with cooldown

---

## 2. Manager Dashboard (http://localhost:3002)

### Overview
Manager/Admin dashboard for viewing real-time worker positions and managing ADAPT queue.

### Screens

#### **Login Screen**
- **Features:**
  - BadgeId input field
  - Login button
  - Role validation (Manager/Admin only)
  - Error messages for invalid credentials
- **Requirements:**
  - Employee must exist in database
  - Employee role must be MANAGER or ADMIN
  - ASSOCIATE role will be rejected

#### **M1: Live Map Screen**
- **Features:**
  - 10x10 grid showing worker positions
  - Color-coded worker status:
    - 🟢 **Green:** Active (< 2 minutes since last scan)
    - 🟠 **Orange:** Idle (2-15 minutes)
    - ⚪ **Gray:** Offline (> 15 minutes)
  - Worker details on click
  - Auto-refresh every 5 seconds
  - Navigation to Queue screen

#### **M2: ADAPT Queue Screen**
- **Features:**
  - Table of pending AdaptRecords
  - Columns:
    - Employee BadgeId
    - Type (PRODUCTIVITY)
    - Metric Value (scan count)
    - Metric Threshold (cutoff)
    - Generated At (timestamp)
  - Actions:
    - **Approve:** Sets status to APPROVEDDELIVERED
    - **Override:** Sets status to EXEMPTED (requires reason)
  - Auto-refresh every 10 seconds
  - Navigation to Map screen

### Testing Steps

1. **Test Login:**
   - Go to http://localhost:3002
   - Enter a Manager/Admin badgeId (e.g., "MGR001")
   - Click "Login"
   - Should redirect to Map screen

2. **Test Live Map:**
   - View worker positions on grid
   - Colors indicate status
   - Click worker for details
   - Navigate to Queue via button

3. **Test ADAPT Queue:**
   - View pending AdaptRecords
   - Click "Approve" → Should update status
   - Click "Override" → Enter reason → Should exempt
   - Navigate back to Map

### Test Scenarios

- ✅ **Manager login** → Should work
- ✅ **Admin login** → Should work
- ✅ **Associate login** → Should be rejected (403)
- ✅ **Invalid badgeId** → Should show error
- ✅ **No workers** → Map shows empty grid
- ✅ **No pending records** → Queue shows empty table
- ✅ **Approve action** → Record status updates
- ✅ **Override action** → Record exempted with reason

---

## 🔧 Prerequisites for Testing

### 1. API Server Running
```bash
cd apps/api
pnpm start:dev
# Should be running on http://localhost:3000
```

### 2. Database Setup
- PostgreSQL running
- Migrations applied
- Test data seeded (optional but recommended)

### 3. Environment Variables

**VJT App** (`apps/vjt/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Dashboard** (`apps/dashboard/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 📝 Test Data Setup

### Create Test Employees

```sql
-- Manager
INSERT INTO employees (id, badgeid, role) 
VALUES ('mgr-uuid', 'MGR001', 'MANAGER');

-- Admin
INSERT INTO employees (id, badgeid, role) 
VALUES ('admin-uuid', 'ADMIN001', 'ADMIN');

-- Associate (for scanner app)
INSERT INTO employees (id, badgeid, role) 
VALUES ('emp-uuid', 'EMP001', 'ASSOCIATE');
```

### Create Test Candidate (for VJT)

1. Send SMS to Twilio number
2. Complete Eva Bot conversation
3. Get VJT link with candidate ID and nonce

---

## 🧪 Quick Test Checklist

### VJT App
- [ ] Landing screen loads with valid params
- [ ] Game screen starts 60-second timer
- [ ] Drag-and-drop works
- [ ] Score updates correctly
- [ ] Result screen shows pass/fail
- [ ] Cooldown blocks retry

### Manager Dashboard
- [ ] Login with Manager badgeId works
- [ ] Login with Admin badgeId works
- [ ] Login with Associate badgeId fails
- [ ] Map shows worker positions
- [ ] Worker colors reflect status
- [ ] Queue shows pending AdaptRecords
- [ ] Approve action works
- [ ] Override action works
- [ ] Auto-refresh works

---

## 🐛 Troubleshooting

### VJT App Issues
- **"Missing params" error:** Ensure URL has `?candidate=...&nonce=...`
- **"Invalid nonce" error:** Nonce expired or invalid
- **Game not starting:** Check API connection

### Dashboard Issues
- **"Unauthorized" error:** BadgeId doesn't exist or wrong role
- **Empty map:** No scan events in database
- **Empty queue:** No pending AdaptRecords
- **API errors:** Check API server is running

---

## 📊 Current Status

- ✅ VJT App: Fully functional
- ✅ Manager Dashboard: Fully functional
- ✅ API Integration: Complete
- ✅ Authentication: Working
- ✅ Real-time updates: Polling implemented

---

**Last Updated:** December 17, 2025

