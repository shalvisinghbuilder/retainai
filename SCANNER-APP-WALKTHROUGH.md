# Scanner App - How It Works

## 🎯 Overview

The Scanner App is an **offline-first** mobile application for warehouse associates to scan barcodes and submit daily sentiment. It uses SQLite for local storage and background sync to the API.

---

## 📱 User Flow

```
┌─────────────┐
│   App Start │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Login Screen   │ ← Enter BadgeId (requires internet)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Sentiment Screen│ ← Daily 1-5 star rating (offline OK)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│   Scan Screen   │ ← Main work interface
│                 │   - Camera barcode scanning
│                 │   - Manual entry fallback
│                 │   - Real-time UPH counter
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Stats Screen   │ ← Queue statistics
│                 │   - Pending/Synced counts
│                 │   - Last sync time
└─────────────────┘
```

---

## 🔄 Complete Data Flow

### 1. **App Initialization**

```typescript
// App.tsx - On startup
useEffect(() => {
  async function initialize() {
    // 1. Initialize SQLite database
    await databaseService.initialize();
    
    // 2. Start background sync service
    await syncService.start(); // Runs every 30s
    
    // 3. Check if user is authenticated
    const authenticated = await authService.isAuthenticated();
    setIsAuthenticated(authenticated);
  }
  initialize();
}, []);
```

**What happens:**
- SQLite database is created/opened
- Queue table is created if it doesn't exist
- Background sync service starts (30-second interval)
- Checks for existing authentication tokens

---

### 2. **Login Flow**

```typescript
// LoginScreen.tsx
const handleLogin = async () => {
  // Check connectivity
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) {
    Alert.alert('No Connectivity', 'Please connect to internet');
    return;
  }
  
  // Call API
  const response = await authService.login(badgeId);
  // Stores: accessToken, refreshToken, employee info in AsyncStorage
};
```

**API Call:**
```
POST /auth/login
Body: { "badgeId": "EMP001" }
Response: { accessToken, refreshToken, employee }
```

**Storage:**
- `accessToken` → AsyncStorage
- `refreshToken` → AsyncStorage  
- `employee` → AsyncStorage

---

### 3. **Sentiment Submission (Offline-First)**

```typescript
// SentimentScreen.tsx
const handleSubmit = async () => {
  // 1. Get employee info
  const employee = await authService.getEmployee();
  
  // 2. Create payload
  const payload = {
    employeeId: employee.id,
    questionId: 'daily_tools_question',
    score: selectedScore, // 1-5
    respondedAt: new Date().toISOString(),
  };
  
  // 3. Write to SQLite immediately (offline-first)
  await databaseService.enqueue(id, 'SENTIMENT', JSON.stringify(payload));
  
  // 4. Trigger background sync (non-blocking)
  syncService.triggerSync();
  
  // 5. Proceed immediately (don't wait for sync)
  onComplete();
};
```

**What happens:**
1. ✅ Sentiment is written to SQLite queue immediately
2. ✅ User can proceed (no waiting)
3. 🔄 Background sync will send it to API later

**SQLite Queue Entry:**
```sql
INSERT INTO mutationqueue (
  id, actiontype, payload, status, retrycount, nextretryat, createdat, updatedat
) VALUES (
  'uuid-123', 
  'SENTIMENT', 
  '{"employeeId":"...","questionId":"...","score":4,"respondedAt":"..."}',
  'PENDING',
  0,
  NULL,
  1234567890,
  1234567890
);
```

---

### 4. **Barcode Scanning (Offline-First)**

```typescript
// ScanScreen.tsx
const handleBarCodeScanned = async ({ data }) => {
  setScanned(true);
  
  // Record scan immediately
  await recordScan(data, 'PICK', 15);
  
  // Reset after 1 second
  setTimeout(() => setScanned(false), 1000);
};

const recordScan = async (barcode, actionType, expectedSeconds) => {
  // 1. Check queue limit (max 2000 pending)
  const canEnqueue = await databaseService.checkQueueLimit();
  if (!canEnqueue) {
    throw new Error('Queue limit reached');
  }
  
  // 2. Get employee info
  const employee = await authService.getEmployee();
  
  // 3. Create scan payload
  const payload = {
    eventId: generateUUID(),
    employeeId: employee.id,
    barcode: barcode,
    location: 'A1-B2',
    actionType: 'PICK',
    timestamp: new Date().toISOString(),
    expectedSeconds: 15,
  };
  
  // 4. Write to SQLite immediately
  await databaseService.enqueue(eventId, 'SCAN', JSON.stringify(payload));
  
  // 5. Trigger background sync (non-blocking)
  syncService.triggerSync();
  
  // 6. Success feedback (haptic + vibration)
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  Vibration.vibrate(100);
};
```

**What happens:**
1. ✅ Scan is written to SQLite queue immediately
2. ✅ User gets instant feedback (haptic + vibration)
3. ✅ UPH counter updates
4. 🔄 Background sync will send it to API later

**SQLite Queue Entry:**
```sql
INSERT INTO mutationqueue (
  id, actiontype, payload, status, ...
) VALUES (
  'scan-uuid-456',
  'SCAN',
  '{"eventId":"...","employeeId":"...","barcode":"BARCODE001",...}',
  'PENDING',
  ...
);
```

---

### 5. **Background Sync Process**

```typescript
// sync.service.ts
async start(): Promise<void> {
  // Sync every 30 seconds
  this.syncInterval = setInterval(() => {
    this.syncIfOnline();
  }, 30000);
  
  // Sync when connectivity is regained
  NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      this.syncIfOnline();
    }
  });
}

private async sync(): Promise<void> {
  // 1. Cleanup old records (SYNCED: 24h, POISON: 72h)
  await databaseService.cleanupOldRecords();
  
  // 2. Get oldest 50 PENDING items
  const pending = await databaseService.getPendingBatch(50);
  if (pending.length === 0) return;
  
  // 3. Group by action type
  const scanEvents = [];
  const sentimentEvents = [];
  
  for (const item of pending) {
    if (item.actionType === 'SCAN') {
      scanEvents.push(JSON.parse(item.payload));
    } else if (item.actionType === 'SENTIMENT') {
      sentimentEvents.push(JSON.parse(item.payload));
    }
  }
  
  // 4. Sync scan events (batch)
  if (scanEvents.length > 0) {
    await this.syncScanEvents(scanEvents, queueItems);
  }
  
  // 5. Sync sentiment events (individual)
  if (sentimentEvents.length > 0) {
    await this.syncSentimentEvents(sentimentEvents, queueItems);
  }
}
```

**Sync Triggers:**
- ⏰ Every 30 seconds (automatic)
- 📶 When connectivity is regained
- 🔄 After new scan/sentiment (triggered manually)

---

### 6. **Sync Scan Events (Batch)**

```typescript
// sync.service.ts
private async syncScanEvents(events, queueItems) {
  const token = await AsyncStorage.getItem('accessToken');
  
  const response = await fetch(`${API_BASE_URL}/events/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ events }),
  });
  
  if (response.status === 200) {
    // ✅ All succeeded - mark all as SYNCED
    for (const item of queueItems) {
      await databaseService.updateStatus(item.id, 'SYNCED');
    }
  } else if (response.status === 206) {
    // ⚠️ Partial success - mark successes SYNCED, failures FAILED_FATAL
    const result = await response.json();
    // Process errors array to identify failures
    // Mark successes as SYNCED
    // Mark failures as FAILED_FATAL
  } else if (response.status === 400) {
    // ❌ Invalid payload - mark all as FAILED_FATAL
    for (const item of queueItems) {
      await databaseService.updateStatus(item.id, 'FAILED_FATAL');
    }
  } else {
    // 🔄 Retryable error (500, timeout) - retry with backoff
    await this.handleRetry(queueItems);
  }
}
```

**API Endpoint:**
```
POST /events/batch
Headers: Authorization: Bearer {token}
Body: {
  "events": [
    {
      "eventId": "uuid-123",
      "employeeId": "emp-456",
      "barcode": "BARCODE001",
      "location": "A1-B2",
      "actionType": "PICK",
      "timestamp": "2025-12-17T10:30:00Z",
      "expectedSeconds": 15
    },
    ...
  ]
}
```

**Response Handling:**
- **200 OK:** All events synced successfully
- **206 Partial Content:** Some succeeded, some failed (errors array)
- **400 Bad Request:** Invalid payload (mark all as FAILED_FATAL)
- **500/Timeout:** Retry with exponential backoff

---

### 7. **Sync Sentiment Events (Individual)**

```typescript
// sync.service.ts
private async syncSentimentEvents(events, queueItems) {
  const token = await AsyncStorage.getItem('accessToken');
  
  // Process each sentiment individually
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const queueItem = queueItems[i];
    
    const response = await fetch(`${API_BASE_URL}/sentiment/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questionId: event.questionId,
        score: event.score,
        respondedAt: event.respondedAt,
      }),
    });
    
    if (response.status === 200 || response.status === 409) {
      // ✅ Success or already submitted (idempotent)
      await databaseService.updateStatus(queueItem.id, 'SYNCED');
    } else if (response.status === 400) {
      // ❌ Validation error
      await databaseService.updateStatus(queueItem.id, 'FAILED_FATAL');
    } else {
      // 🔄 Retryable error
      await this.handleRetry([queueItem]);
    }
  }
}
```

**API Endpoint:**
```
POST /sentiment/submit
Headers: Authorization: Bearer {token}
Body: {
  "questionId": "daily_tools_question",
  "score": 4,
  "respondedAt": "2025-12-17T10:30:00Z"
}
```

---

### 8. **Retry Logic with Exponential Backoff**

```typescript
// sync.service.ts
private async handleRetry(queueItems) {
  for (const item of queueItems) {
    const newRetryCount = item.retryCount + 1;
    
    if (newRetryCount > MAX_RETRIES) {
      // ❌ Max retries exceeded - mark as POISON
      await databaseService.updateStatus(item.id, 'POISON');
    } else {
      // 🔄 Calculate backoff delay
      const backoffIndex = Math.min(newRetryCount - 1, BACKOFF_SCHEDULE.length - 1);
      const backoffMs = BACKOFF_SCHEDULE[backoffIndex]; // 1s, 2s, 5s, 30s, 5m
      const nextRetryAt = Date.now() + backoffMs;
      
      // Update status with retry info
      await databaseService.updateStatus(
        item.id,
        'PENDING',
        newRetryCount,
        nextRetryAt
      );
    }
  }
}
```

**Retry Schedule:**
- Attempt 1: Wait 1 second
- Attempt 2: Wait 2 seconds
- Attempt 3: Wait 5 seconds
- Attempt 4: Wait 30 seconds
- Attempt 5: Wait 5 minutes
- Attempt 6: Wait 5 minutes (repeat)
- After 6 attempts: Mark as **POISON** (permanently failed)

---

### 9. **Queue Status Lifecycle**

```
┌─────────┐
│ PENDING │ ← New scan/sentiment written to SQLite
└────┬────┘
     │
     ├─→ [Sync Success] ─→ ┌────────┐
     │                     │ SYNCED │ ← Successfully synced to API
     │                     └────────┘
     │                            │
     │                            └─→ [After 24h] ─→ Deleted
     │
     ├─→ [Sync Fails] ─→ ┌──────────────┐
     │                   │ FAILED_FATAL │ ← Invalid payload (no retry)
     │                   └──────────────┘
     │
     └─→ [Retry Exhausted] ─→ ┌────────┐
                               │ POISON │ ← Failed after 6 retries
                               └────────┘
                                      │
                                      └─→ [After 72h] ─→ Deleted
```

**Status Meanings:**
- **PENDING:** Waiting to be synced
- **SYNCED:** Successfully synced to API (deleted after 24h)
- **FAILED_FATAL:** Invalid payload, won't retry (stays forever)
- **POISON:** Failed after 6 retries (deleted after 72h)

---

### 10. **Stats Screen**

```typescript
// StatsScreen.tsx
const loadStats = async () => {
  const queueStats = await databaseService.getQueueStats();
  setStats({
    pending: queueStats.pending,    // Items waiting to sync
    synced: queueStats.synced,      // Successfully synced
    poison: queueStats.poison,       // Failed after retries
    total: queueStats.total,         // Total items in queue
  });
};

// Refreshes every 5 seconds
useEffect(() => {
  loadStats();
  const interval = setInterval(loadStats, 5000);
  return () => clearInterval(interval);
}, []);
```

**Displays:**
- **Scans Today:** Total scans (pending + synced)
- **Pending Sync:** Items waiting to be synced
- **Synced:** Successfully synced items
- **Last Sync:** Last successful sync time
- **Failed (Poison):** Items that failed after retries (if any)

---

## 🔑 Key Design Principles

### 1. **Offline-First**
- ✅ All writes go to SQLite first
- ✅ UI never waits for network
- ✅ Background sync handles API communication

### 2. **Non-Blocking**
- ✅ User can continue working while sync happens
- ✅ No loading spinners for scans
- ✅ Instant feedback (haptic + vibration)

### 3. **Resilient**
- ✅ Retry logic with exponential backoff
- ✅ Handles network failures gracefully
- ✅ Queue limits prevent memory issues

### 4. **Efficient**
- ✅ Batch processing (50 items at a time)
- ✅ Automatic cleanup of old records
- ✅ Indexed queries for fast retrieval

---

## 📊 Queue Management

### Queue Limits
- **Max Pending Items:** 2000
- **Batch Size:** 50 items per sync
- **Retention:**
  - SYNCED: 24 hours
  - POISON: 72 hours

### Cleanup Process
```typescript
// Runs before each sync
async cleanupOldRecords() {
  const now = Date.now();
  
  // Delete SYNCED records older than 24h
  DELETE FROM mutationqueue 
  WHERE status = 'SYNCED' AND updatedat < (now - 24h);
  
  // Delete POISON records older than 72h
  DELETE FROM mutationqueue 
  WHERE status = 'POISON' AND updatedat < (now - 72h);
}
```

---

## 🧪 Testing Scenarios

### 1. **Online Flow**
1. Login with `EMP001`
2. Complete sentiment (1-5 stars)
3. Scan barcodes
4. Check Stats → Should sync within 30s

### 2. **Offline Flow**
1. Turn off WiFi/Data
2. Scan barcodes → ✅ Still works
3. Check Stats → Pending count increases
4. Turn network back on
5. Wait 30s → Auto-syncs

### 3. **Queue Limit**
1. Scan 2000+ items
2. Next scan → ❌ Error: "Queue limit reached"

### 4. **Retry Logic**
1. Stop API server
2. Scan items → Queued as PENDING
3. Start API server
4. Wait → Items sync with retry backoff

---

## 🎯 Summary

The Scanner App works by:

1. **Writing locally first** → SQLite queue
2. **Syncing in background** → Every 30s or on connectivity change
3. **Handling failures gracefully** → Retry with backoff, mark poison after 6 attempts
4. **Never blocking the UI** → User can always continue working
5. **Cleaning up automatically** → Old records deleted based on retention rules

This ensures warehouse associates can work continuously, even in areas with poor connectivity, while data is reliably synced to the backend when possible.

