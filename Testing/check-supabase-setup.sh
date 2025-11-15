#!/bin/bash

# EventHive Supabase Integration - Quick Check Script
echo "🚀 EventHive Supabase Integration Check"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local file exists"
    
    # Check if Supabase URL is set
    if grep -q "NEXT_PUBLIC_SUPABASE_URL=https://" .env.local; then
        echo -e "${GREEN}✓${NC} Supabase URL is configured"
    else
        echo -e "${RED}✗${NC} Supabase URL not configured"
        echo -e "${YELLOW}  →${NC} Add your Supabase URL to .env.local"
    fi
    
    # Check if Supabase Key is set
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ" .env.local; then
        echo -e "${GREEN}✓${NC} Supabase Anon Key is configured"
    else
        echo -e "${RED}✗${NC} Supabase Anon Key not configured"
        echo -e "${YELLOW}  →${NC} Add your Supabase Anon Key to .env.local"
    fi
else
    echo -e "${RED}✗${NC} .env.local file not found"
    echo -e "${YELLOW}  →${NC} Copy .env.local.example to .env.local"
    echo -e "${YELLOW}  →${NC} Run: cp .env.local.example .env.local"
fi

echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${RED}✗${NC} Dependencies not installed"
    echo -e "${YELLOW}  →${NC} Run: npm install"
fi

echo ""

# Check if Supabase client exists
if [ -f "src/lib/supabase.ts" ]; then
    echo -e "${GREEN}✓${NC} Supabase client configured"
else
    echo -e "${RED}✗${NC} Supabase client not found"
fi

# Check if schema file exists
if [ -f "supabase-schema.sql" ]; then
    echo -e "${GREEN}✓${NC} Database schema file exists"
else
    echo -e "${RED}✗${NC} Database schema file not found"
fi

echo ""
echo "============================================"
echo ""

# Check if .env.local is properly configured
if [ -f ".env.local" ] && grep -q "NEXT_PUBLIC_SUPABASE_URL=https://" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ" .env.local; then
    echo -e "${GREEN}✓ Configuration looks good!${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "  1. Make sure you've run the SQL schema in Supabase"
    echo "  2. Start the dev server: npm run dev"
    echo "  3. Test signup at: http://localhost:3000"
    echo ""
    echo "📚 Documentation:"
    echo "  - SUPABASE_SETUP.md (detailed setup guide)"
    echo "  - supabase-schema.sql (database schema)"
    echo ""
else
    echo -e "${YELLOW}⚠ Setup Required${NC}"
    echo ""
    echo -e "${BLUE}To complete setup:${NC}"
    echo ""
    echo "1. Create Supabase project at https://supabase.com"
    echo "2. Copy .env.local.example to .env.local"
    echo "3. Add your Supabase credentials to .env.local"
    echo "4. Run the SQL schema in Supabase SQL Editor"
    echo "5. Run: npm install"
    echo "6. Run: npm run dev"
    echo ""
    echo "📖 See SUPABASE_SETUP.md for detailed instructions"
    echo ""
fi

# Check if dev server is running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Dev server is running on port 3000"
    echo -e "${BLUE}→${NC} http://localhost:3000"
else
    echo -e "${YELLOW}○${NC} Dev server not running"
    echo -e "${BLUE}→${NC} Start with: npm run dev"
fi

echo ""
