# Remaining Tasks for RetainAI MVP

## Status Overview

**Overall MVP Completion:** ~98% Complete

### ✅ Completed Components
1. ✅ Backend API - 12 endpoints (health, auth, bot, candidates, events, adapt, map, sentiment)
2. ✅ Scanner App - All 4 screens (Login, Sentiment Gate, Work/Scan, Stats)
3. ✅ VJT Web App - All 3 screens (Landing, Game, Result)
4. ✅ Manager Dashboard - All 3 screens (Login, Map, Queue)
5. ✅ Database Setup - PostgreSQL staging configured
6. ✅ Environment Variables - All configured
7. ✅ Ngrok - Running and configured

---

## ❌ Missing: Sentiment Endpoint

### Issue
The scanner app has a **Daily Sentiment Gate** screen (A1b) that collects sentiment responses (1-5 stars), but **the API endpoint to receive these submissions is missing**.

### Evidence
1. **Scanner App** (`apps/scanner/src/services/sync.service.ts:88`):
   ```typescript
   // Sync sentiment events (if endpoint exists)
   // TODO: Implement sentiment endpoint sync
   ```

2. **FINAL-SPEC.md** (line 30):
   - "ASSOCIATE: can ingest scans and **submit sentiment**"

3. **FINAL-SPEC.md** (lines 63-65):
   - "Store SentimentResponse with score 1..5"
   - "Enforce 'one per employee per day' in service logic"

4. **Database Schema** (`schema.prisma`):
   - `SentimentResponse` model exists with fields:
     - `id`, `employeeId`, `questionId`, `score` (1-5), `respondedAt`

5. **Scanner App** (`apps/scanner/src/screens/SentimentScreen.tsx`):
   - Collects sentiment and enqueues to SQLite
   - But sync service cannot send it (no endpoint)

### Required Implementation

**Endpoint:** `POST /sentiment` or `POST /sentiment/submit`

**Requirements:**
- JWT authentication required (ASSOCIATE+)
- Accept sentiment payload:
  ```json
  {
    "questionId": "string",
    "score": 1-5,
    "respondedAt": "ISO8601"
  }
  ```
- Validation:
  - `score` must be 1-5
  - `questionId` required
  - `respondedAt` required
- Business Logic:
  - Enforce "one per employee per day" (check existing SentimentResponse for same employeeId and date bucket)
  - If duplicate for same day → return 409 Conflict or treat as idempotent success
- Response:
  - 200: Success
  - 400: Validation error
  - 409: Already submitted today
  - 401: Unauthorized

**Files to Create:**
- `apps/api/src/sentiment/sentiment.module.ts`
- `apps/api/src/sentiment/sentiment.controller.ts`
- `apps/api/src/sentiment/sentiment.service.ts`
- `apps/api/src/sentiment/dto/sentiment-submit.dto.ts`

**Update:**
- `apps/api/src/app.module.ts` - Import SentimentModule
- `apps/scanner/src/services/sync.service.ts` - Implement sentiment sync (line 88)

---

## 🔍 Other Potential Gaps

### 1. Testing
- ❌ No unit tests
- ❌ No integration tests
- ❌ No E2E tests

### 2. Documentation
- ✅ API endpoints documented in BUILD-LOG.md
- ❌ No OpenAPI/Swagger documentation
- ❌ No API usage examples

### 3. Error Handling Edge Cases
- ✅ Standard error format implemented
- ⚠️ Some edge cases may need additional validation

### 4. Production Readiness
- ✅ Environment variables configured
- ✅ Health check for database connectivity (added to `/health` endpoint)
- ⚠️ No rate limiting
- ⚠️ No request logging/monitoring

### 5. WebSocket (Optional)
- FINAL-SPEC.md mentions WebSocket for real-time map updates (optional)
- Currently using polling (5s interval) - acceptable for MVP

---

## Priority: Low

**All critical features are now complete!** The remaining items are enhancements or nice-to-haves for production deployment.

---

## Next Steps

1. **Test End-to-End** (Medium Priority)
   - Test scanner app → sentiment submission
   - Test duplicate submission handling
   - Verify database constraints

2. **Documentation** (Low Priority)
   - Add OpenAPI spec
   - Update API documentation

3. **Production Enhancements** (Low Priority)
   - Add rate limiting
   - Add request logging/monitoring
   - Set up CI/CD pipeline

---

**Last Updated:** December 17, 2025  
**Status:** All critical features complete! ✅

