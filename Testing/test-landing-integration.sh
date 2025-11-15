#!/bin/bash

# EventHive Landing Page Integration - Quick Start Script
# This script helps you test the landing page integration

echo "🎉 EventHive Landing Page Integration Test"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if dev server is running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✓${NC} Dev server is running on port 3000"
    echo ""
    echo -e "${BLUE}Available URLs:${NC}"
    echo "  📄 Landing Page:  http://localhost:3000/landing_page/index.html"
    echo "  🏠 Main App:      http://localhost:3000/"
    echo "  🧪 Test Page:     http://localhost:3000/test-integration.html"
    echo ""
    echo -e "${YELLOW}Quick Test Steps:${NC}"
    echo "  1. Open the landing page URL above"
    echo "  2. Click 'Sign Up Free' or 'Sign In'"
    echo "  3. Fill in the form with test data"
    echo "  4. Submit and watch the magic! ✨"
    echo ""
    echo -e "${BLUE}Or use the test page:${NC}"
    echo "  Open http://localhost:3000/test-integration.html"
    echo "  It has convenient buttons and tools for testing"
    echo ""
else
    echo -e "${YELLOW}⚠${NC} Dev server is not running"
    echo ""
    echo "To start the dev server, run:"
    echo "  npm run dev"
    echo ""
    echo "Then run this script again or visit:"
    echo "  http://localhost:3000/test-integration.html"
    echo ""
fi

# Check if landing page files exist
if [ -f "public/landing_page/index.html" ]; then
    echo -e "${GREEN}✓${NC} Landing page files are in place"
else
    echo -e "${YELLOW}⚠${NC} Landing page files not found in public directory"
    echo "Copying now..."
    mkdir -p public
    cp -r landing_page public/
    echo -e "${GREEN}✓${NC} Files copied successfully"
fi

echo ""
echo "📚 Documentation:"
echo "  - INTEGRATION_COMPLETE.md  (Quick overview)"
echo "  - LANDING_PAGE_INTEGRATION.md  (Detailed guide)"
echo ""
echo "Happy testing! 🚀"
