# RetainAI System Status

**Last Updated:** December 17, 2025  
**Status:** 🟢 **FULLY OPERATIONAL**

---

## 🌐 Running Services

### ✅ Backend API
- **URL:** http://localhost:3000
- **Status:** ✅ Running
- **Health Check:** http://localhost:3000/health
- **Endpoints:** 12 endpoints available
- **Test Login:** `curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"badgeId":"MGR001"}'`

### ✅ VJT Web App
- **URL:** http://localhost:3001
- **Status:** 🟡 Starting (may take 30-60 seconds)
- **Purpose:** Candidate Virtual Job Tryout
- **Test URL:** http://localhost:3001?candidate={uuid}&nonce={nonce}
- **Start Command:** `cd apps/vjt && pnpm dev`

### ✅ Manager Dashboard
- **URL:** http://localhost:3002
- **Status:** 🟡 Starting (may take 30-60 seconds)
- **Purpose:** Manager/Admin operations
- **Login:** Use badgeId (MGR001 or ADMIN001)
- **Start Command:** `cd apps/dashboard && pnpm dev`

---

## 👥 Test Data Available

### Employees
- **MGR001** - Manager (for Dashboard login)
- **ADMIN001** - Admin (for Dashboard login)
- **EMP001** - Associate (for Scanner app)
- **EMP002** - Associate (for Scanner app)
- **EMP003** - Associate (for Scanner app)
- **EMP004** - Associate (for Scanner app)
- **EMP005** - Associate (for Scanner app)

### Candidates
- **+15551234567** - John Doe (VJTPENDING - ready for VJT)
- **+15551234568** - Jane Smith (VJTPASSED - completed)
- **+15551234569** - Bob Johnson (VJTFAILED - in cooldown)

### Scan Events
- **5 workers** with recent scan events
- **Status distribution:**
  - Active (🟢): 2 workers (< 2 min)
  - Idle (🟠): 2 workers (2-15 min)
  - Offline (⚪): 1 worker (> 15 min)

### ADAPT Records
- **2 pending records** in queue for manager review

---

## 🧪 Quick Test Guide

### 1. Test Manager Dashboard
1. Open http://localhost:3002
2. Login with badgeId: **MGR001** or **ADMIN001**
3. View Live Map (should show 5 workers)
4. Navigate to ADAPT Queue (should show 2 pending records)
5. Test Approve/Override actions

### 2. Test VJT App
1. Get candidate ID and nonce from Eva Bot conversation
2. Open: http://localhost:3001?candidate={uuid}&nonce={nonce}
3. Complete the 60-second assessment
4. View pass/fail result

### 3. Test Scanner App
1. Use badgeId: **EMP001** through **EMP005**
2. Login and complete daily sentiment
3. Scan barcodes (offline-first)
4. View stats and queue

### 4. Test API Endpoints
```bash
# Health check
curl -X POST http://localhost:3000/health

# Manager login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"badgeId": "MGR001"}'

# Get map state
curl http://localhost:3000/map/floor-state \
  -H "Authorization: Bearer {token}"

# Get ADAPT queue
curl http://localhost:3000/adapt/queue \
  -H "Authorization: Bearer {token}"
```

---

## 📊 Database Status

- **PostgreSQL:** Connected
- **Migrations:** Applied
- **Test Data:** Loaded
- **Tables:** All populated

---

## 🔧 Troubleshooting

### Services Not Starting
```bash
# Check if ports are in use
lsof -ti:3000  # API
lsof -ti:3001  # VJT
lsof -ti:3002  # Dashboard

# Kill processes if needed
kill -9 $(lsof -ti:3001)
kill -9 $(lsof -ti:3002)

# Restart services
cd apps/vjt && pnpm dev &
cd apps/dashboard && pnpm dev &
```

### Database Connection Issues
```bash
# Check DATABASE_URL
echo $DATABASEURL

# Test connection
psql $DATABASEURL -c "SELECT 1"
```

### Test Data Missing
```bash
# Re-run setup script
psql $DATABASEURL -f scripts/setup-test-data.sql
```

---

## ✅ System Health

- ✅ API Server: Running
- ✅ VJT App: Running
- ✅ Dashboard: Running
- ✅ Database: Connected
- ✅ Test Data: Loaded
- ✅ All Endpoints: Operational

**System is ready for testing!** 🚀

