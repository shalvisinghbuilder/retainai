# Local Webhook Testing (Without ngrok)

## Quick Test Option

For local testing without ngrok, you can temporarily disable Twilio signature validation.

**⚠️ WARNING: This bypasses security. Only use for local development testing.**

### Option 1: Temporarily Disable Guard (Quick Test)

1. Comment out the guard in `apps/api/src/bot/bot.controller.ts`:
```typescript
// @UseGuards(TwilioSignatureGuard)  // Temporarily disabled for local testing
```

2. Restart the server

3. Test with curl:
```bash
curl -X POST http://localhost:3000/api/bot/webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=+18777804236" \
  -d "To=+12707871701" \
  -d "Body=Hello"
```

4. **IMPORTANT:** Re-enable the guard before committing:
```typescript
@UseGuards(TwilioSignatureGuard)  // Re-enabled
```

### Option 2: Environment-Based Guard (Better)

Modify the guard to skip validation in development:

```typescript
// In TwilioSignatureGuard
async canActivate(context: ExecutionContext): Promise<boolean> {
  // Skip validation in development
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_TWILIO_SIG === 'true') {
    return true;
  }
  // ... rest of validation
}
```

Then set in `.env`:
```env
SKIP_TWILIO_SIG=true  # Only for local testing
```

### Option 3: Test Script

Create a test script that simulates Twilio webhook:

```bash
# test-webhook.sh
curl -X POST http://localhost:3000/api/bot/webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=+18777804236" \
  -d "To=+12707871701" \
  -d "Body=Hello"
```

---

## Expected Response

The webhook should return TwiML XML:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Hello! Thank you for your interest. What is your full legal name?</Message>
</Response>
```

## Verify in Database

After testing, check:
```sql
-- New candidate created
SELECT * FROM candidates ORDER BY "createdAt" DESC LIMIT 1;

-- Conversation started
SELECT * FROM conversationsessions ORDER BY id DESC LIMIT 1;

-- Messages logged
SELECT * FROM messagelogs ORDER BY timestamp DESC LIMIT 5;
```

---

**Recommended:** Use ngrok for proper testing with signature validation.  
**Quick Test:** Use Option 1 or 2 for immediate local testing.

