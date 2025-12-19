# Testing Twilio Webhook

## Twilio Configuration

**Active Phone Number:** +12707871701  
**Virtual Phone (for testing):** +18777804236

## Test the Eva Bot Webhook

### 1. Using curl (with signature validation disabled for local testing)

For local testing without signature validation, you can temporarily disable the guard or use ngrok for proper signature validation.

### 2. Test Command

```bash
curl -X POST http://localhost:3000/api/bot/webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=+18777804236" \
  -d "To=+12707871701" \
  -d "Body=Hello"
```

**Note:** This will fail signature validation. For proper testing:
- Use ngrok to expose localhost:3000
- Configure webhook URL in Twilio Console
- Twilio will automatically sign requests

### 3. Using Twilio Console

1. Go to Twilio Console → Phone Numbers → Manage → Active Numbers
2. Click on +12707871701
3. Under "Messaging" → "A MESSAGE COMES IN", set webhook URL:
   - For local: Use ngrok URL: `https://your-ngrok-url.ngrok.io/api/bot/webhook`
   - For production: `https://your-domain.com/api/bot/webhook`
4. Save configuration
5. Send SMS from Virtual Phone (+18777804236) to +12707871701

### 4. Expected Flow

1. Candidate sends SMS to +12707871701
2. Twilio sends webhook to your API
3. Eva Bot processes message through state machine
4. Response sent back via TwiML

## Testing Steps

1. **Set up ngrok (for local testing):**
   ```bash
   ngrok http 3000
   # Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
   ```

2. **Configure Twilio Webhook:**
   - Use ngrok URL: `https://abc123.ngrok.io/api/bot/webhook`
   - Set HTTP method: POST

3. **Send test SMS:**
   - From: Virtual Phone (+18777804236)
   - To: Twilio Number (+12707871701)
   - Message: "Hello" or any text

4. **Expected Response:**
   - Eva Bot should respond asking for name
   - Check database for new Candidate and ConversationSession

## Verification

Check database for new records:
```sql
SELECT * FROM candidates ORDER BY "createdAt" DESC LIMIT 5;
SELECT * FROM conversationsessions ORDER BY id DESC LIMIT 5;
SELECT * FROM messagelogs ORDER BY timestamp DESC LIMIT 10;
```

---

**Status:** ✅ Twilio number configured  
**Next:** Set up ngrok and configure webhook URL in Twilio Console

