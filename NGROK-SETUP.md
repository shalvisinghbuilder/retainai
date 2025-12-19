# Ngrok Setup Guide

## Quick Setup

### 1. Sign up for ngrok (Free)
- Go to: https://dashboard.ngrok.com/signup
- Create a free account (email verification required)

### 2. Get Your Authtoken
- After signup, go to: https://dashboard.ngrok.com/get-started/your-authtoken
- Copy your authtoken

### 3. Configure ngrok
```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

### 4. Start ngrok
```bash
ngrok http 3000
```

### 5. Copy the HTTPS URL
You'll see output like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 6. Configure Twilio Webhook
1. Go to Twilio Console: https://console.twilio.com/
2. Phone Numbers → Manage → Active Numbers
3. Click on +12707871701
4. Under "Messaging" → "A MESSAGE COMES IN"
5. Set webhook URL: `https://abc123.ngrok.io/api/bot/webhook`
6. HTTP method: POST
7. Save

### 7. Test
Send SMS from Virtual Phone (+18777804236) to +12707871701

---

## Alternative: Local Testing (Bypass Signature)

For quick local testing without ngrok, you can temporarily disable signature validation:

**⚠️ WARNING: Only for local testing. Never disable in production.**

See `TEST-LOCAL-WEBHOOK.md` for instructions.

---

## Ngrok Dashboard

While ngrok is running, you can view:
- Web interface: http://localhost:4040
- Request inspector: See all incoming requests
- Replay requests: Test webhook multiple times

---

**Status:** ⚠️ Requires ngrok account and authtoken  
**Next:** Sign up, get authtoken, configure, then start ngrok

