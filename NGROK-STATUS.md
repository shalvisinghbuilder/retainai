# Ngrok Status

**Status:** ✅ **RUNNING**

## Public URL

**HTTPS URL:** `https://idella-ariose-lan.ngrok-free.dev`

**Webhook Endpoint:** `https://idella-ariose-lan.ngrok-free.dev/api/bot/webhook`

## Configure Twilio Webhook

1. Go to Twilio Console: https://console.twilio.com/
2. Navigate to: **Phone Numbers** → **Manage** → **Active Numbers**
3. Click on: **+12707871701**
4. Scroll to: **Messaging** section
5. Under **"A MESSAGE COMES IN"**:
   - Webhook URL: `https://idella-ariose-lan.ngrok-free.dev/api/bot/webhook`
   - HTTP Method: **POST**
6. Click **Save**

## Test the Webhook

1. Send SMS from Virtual Phone (+18777804236) to +12707871701
2. Message: "Hello" or any text
3. Eva Bot should respond asking for your name

## Verify in Database

After sending a test SMS, check:
```sql
-- Check new candidate
SELECT * FROM candidates ORDER BY "createdAt" DESC LIMIT 1;

-- Check conversation
SELECT * FROM conversationsessions ORDER BY id DESC LIMIT 1;

-- Check messages
SELECT * FROM messagelogs ORDER BY timestamp DESC LIMIT 5;
```

## Ngrok Dashboard

View requests and inspect webhooks:
- **Web Interface:** http://localhost:4040
- **Request Inspector:** See all incoming requests
- **Replay Requests:** Test webhook multiple times

## Important Notes

- Ngrok URL changes each time you restart ngrok (unless you have a paid plan with static domain)
- Keep ngrok running while testing
- The webhook URL must be HTTPS (ngrok provides this automatically)

---

**Ngrok Status:** ✅ Running  
**Public URL:** https://idella-ariose-lan.ngrok-free.dev  
**Webhook URL:** https://idella-ariose-lan.ngrok-free.dev/api/bot/webhook  
**Ready for:** Twilio webhook configuration

