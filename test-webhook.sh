#!/bin/bash
# Test script for Eva Bot webhook (local testing without signature validation)

echo "Testing Eva Bot webhook..."
echo "Note: This requires signature validation to be temporarily disabled"
echo ""

curl -X POST http://localhost:3000/api/bot/webhook \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "From=+18777804236" \
  -d "To=+12707871701" \
  -d "Body=Hello" \
  -v

echo ""
echo ""
echo "Check the response above. If you see TwiML XML, the webhook is working!"

