#!/bin/bash

echo "🔍 Signup Issue Diagnostic"
echo "============================"
echo ""

# Check 1: Environment Variables
echo "1️⃣  Environment Variables:"
if [ -f .env.local ]; then
    echo "✅ .env.local exists"
    if grep -q "NEXT_PUBLIC_SUPABASE_URL=https://" .env.local; then
        echo "✅ SUPABASE_URL configured"
        grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | sed 's/=.*/=***/'
    else
        echo "❌ SUPABASE_URL missing or invalid!"
    fi
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ" .env.local; then
        echo "✅ SUPABASE_ANON_KEY configured"
    else
        echo "❌ SUPABASE_ANON_KEY missing or invalid!"
    fi
else
    echo "❌ .env.local NOT FOUND!"
    echo "   Create it with: cp .env.local.example .env.local"
fi
echo ""

# Check 2: API Route
echo "2️⃣  API Route:"
if [ -f "src/app/api/landing-auth/route.ts" ]; then
    echo "✅ /api/landing-auth/route.ts exists"
    if grep -q "supabase.auth.signUp" "src/app/api/landing-auth/route.ts"; then
        echo "✅ API uses Supabase authentication"
    else
        echo "❌ API not using Supabase!"
    fi
else
    echo "❌ API route missing!"
    echo "   The file should be at: src/app/api/landing-auth/route.ts"
fi
echo ""

# Check 3: Landing Page Updated
echo "3️⃣  Landing Page:"
if grep -q "fetch('/api/landing-auth'" landing_page/script.js 2>/dev/null; then
    echo "✅ Landing page calls API endpoint"
else
    echo "❌ Landing page NOT calling API!"
fi
if grep -q "async function" landing_page/script.js 2>/dev/null; then
    echo "✅ Landing page uses async/await"
else
    echo "⚠️  Landing page might not be using async properly"
fi
echo ""

# Check 4: Supabase Package
echo "4️⃣  Supabase Package:"
if npm list @supabase/supabase-js 2>/dev/null | grep -q "@supabase/supabase-js"; then
    echo "✅ @supabase/supabase-js installed"
else
    echo "❌ Supabase package missing!"
    echo "   Run: npm install @supabase/supabase-js"
fi
echo ""

# Check 5: Dev Server
echo "5️⃣  Dev Server:"
if lsof -i :3000 >/dev/null 2>&1; then
    echo "✅ Server running on port 3000"
    echo "   URL: http://localhost:3000"
else
    echo "⚠️  Server not running"
    echo "   Start with: npm run dev"
fi
echo ""

echo "============================"
echo ""
echo "🎯 NEXT STEPS:"
echo ""

# Count issues
issues=0
[ ! -f .env.local ] && ((issues++))
[ ! -f "src/app/api/landing-auth/route.ts" ] && ((issues++))

if [ $issues -eq 0 ]; then
    echo "✅ Setup looks good!"
    echo ""
    echo "To test signup:"
    echo "1. Make sure server is running: npm run dev"
    echo "2. Go to: http://localhost:3000/landing_page/index.html"
    echo "3. Click 'Sign Up Free' and fill the form"
    echo "4. Check your Supabase dashboard:"
    echo "   Authentication → Users"
    echo ""
    echo "If signup fails, check browser console (F12) for errors"
else
    echo "⚠️  Found $issues issue(s) - fix them first!"
    echo ""
    echo "1. Make sure .env.local has valid Supabase credentials"
    echo "2. Restart dev server after adding env vars"
    echo "3. Try signup again"
fi
echo ""
