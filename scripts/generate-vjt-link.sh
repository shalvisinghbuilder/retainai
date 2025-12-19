#!/bin/bash
# Generate a test VJT link using the test candidate

echo "🔗 Generating Test VJT Link..."
echo ""

# Get test candidate ID (first VJTPENDING candidate)
CANDIDATE_ID=$(psql $DATABASEURL -t -c "SELECT id FROM candidates WHERE status = 'VJTPENDING' LIMIT 1;" 2>/dev/null | xargs)

if [ -z "$CANDIDATE_ID" ]; then
  echo "❌ No candidate in VJTPENDING status found"
  echo ""
  echo "💡 To create a test candidate:"
  echo "   1. Send SMS to Twilio number to start Eva Bot conversation"
  echo "   2. Complete screening (name, age, lift confirmation)"
  echo "   3. Eva Bot will send VJT link"
  echo ""
  exit 1
fi

# Get JWT secret from .env
JWT_SECRET=$(grep JWTSECRET .env | cut -d '=' -f2 | tr -d ' ')

if [ -z "$JWT_SECRET" ]; then
  echo "❌ JWTSECRET not found in .env file"
  exit 1
fi

# Generate nonce using Node.js (simple JWT)
NONCE=$(node -e "
const jwt = require('jsonwebtoken');
const payload = { candidateId: '$CANDIDATE_ID', type: 'vjt' };
const secret = '$JWT_SECRET';
const token = jwt.sign(payload, secret, { expiresIn: '24h' });
console.log(token);
" 2>/dev/null)

if [ -z "$NONCE" ]; then
  echo "❌ Failed to generate nonce. Make sure jsonwebtoken is installed in apps/api"
  echo ""
  echo "💡 Alternative: Use the test candidate ID directly:"
  echo "   Candidate ID: $CANDIDATE_ID"
  echo "   You'll need to generate a nonce via the API or Eva Bot"
  exit 1
fi

URL="http://localhost:3001?candidate=$CANDIDATE_ID&nonce=$NONCE"

echo "✅ Test VJT Link Generated:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Details:"
echo "   Candidate ID: $CANDIDATE_ID"
echo "   Nonce expires: 24 hours from now"
echo ""
echo "💡 Copy and paste this URL in your browser to test the VJT app."
echo ""

