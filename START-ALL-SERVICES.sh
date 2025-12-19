#!/bin/bash
# RetainAI - Start All Services Script

echo "🚀 Starting RetainAI MVP Services..."
echo ""

# Check if API is running
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "✅ API (port 3000): Already running"
else
  echo "❌ API (port 3000): Not running. Start with: cd apps/api && pnpm start:dev"
fi

# Install dependencies if needed
echo ""
echo "📦 Checking dependencies..."
cd "$(dirname "$0")"

if [ ! -d "apps/vjt/node_modules" ]; then
  echo "Installing VJT dependencies..."
  cd apps/vjt && pnpm install && cd ../..
fi

if [ ! -d "apps/dashboard/node_modules" ]; then
  echo "Installing Dashboard dependencies..."
  cd apps/dashboard && pnpm install && cd ../..
fi

# Start VJT App
echo ""
echo "🌐 Starting VJT App (port 3001)..."
cd apps/vjt
pnpm dev > /tmp/vjt.log 2>&1 &
VJT_PID=$!
echo "VJT App started with PID: $VJT_PID"
cd ../..

# Start Dashboard
echo ""
echo "📊 Starting Manager Dashboard (port 3002)..."
cd apps/dashboard
pnpm dev > /tmp/dashboard.log 2>&1 &
DASH_PID=$!
echo "Dashboard started with PID: $DASH_PID"
cd ../..

# Wait for services to start
echo ""
echo "⏳ Waiting for services to start (15 seconds)..."
sleep 15

# Check status
echo ""
echo "=== Service Status ==="
if lsof -ti:3001 > /dev/null 2>&1; then
  echo "✅ VJT App (3001): RUNNING - http://localhost:3001"
else
  echo "❌ VJT App (3001): NOT RUNNING (check /tmp/vjt.log)"
fi

if lsof -ti:3002 > /dev/null 2>&1; then
  echo "✅ Dashboard (3002): RUNNING - http://localhost:3002"
else
  echo "❌ Dashboard (3002): NOT RUNNING (check /tmp/dashboard.log)"
fi

if lsof -ti:3000 > /dev/null 2>&1; then
  echo "✅ API (3000): RUNNING - http://localhost:3000"
else
  echo "❌ API (3000): NOT RUNNING"
fi

echo ""
echo "📝 Test Data Available:"
echo "   - Manager: MGR001"
echo "   - Admin: ADMIN001"
echo "   - Associates: EMP001-005"
echo ""
echo "✅ System ready for testing!"

