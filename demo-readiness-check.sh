#!/bin/bash
# =========================================================
# STEMPlay AI — DEMO READINESS CHECK SCRIPT
# =========================================================
# Copilot: Run this from the project root.
# It will:
#   - Check that all critical backend/frontend files exist
#   - Check env vars inside backend/.env
#   - Print a quick "DEMO READY / MISSING" summary
#   - Print the commands you should run for the demo:
#       * backend:  npm run dev:backend
#       * frontend: npm run dev
# =========================================================

PROJECT_ROOT="$(pwd)"

echo "==============================================="
echo " STEMPlay AI — Demo Readiness Check"
echo " Current directory: $PROJECT_ROOT"
echo "==============================================="

# 1) Helper to check a file
check_file () {
  local path="$1"
  if [ -f "$path" ]; then
    echo "✅ Found: $path"
  else
    echo "❌ MISSING: $path"
  fi
}

# 2) Backend core files
echo ""
echo "🔧 Backend structure"
check_file "backend/package.json"
check_file "backend/tsconfig.json"
check_file "backend/src/server.ts"
check_file "backend/src/routes/parseDocument.ts"
check_file "backend/src/routes/youtubeParse.ts"
check_file "backend/src/routes/sentryDemo.ts"
check_file "backend/src/sentry.ts"
check_file "backend/src/services/daytonaClient.ts"

# 3) Frontend core files
echo ""
echo "🎨 Frontend structure"
check_file "package.json"
# adjust App filename if you use .jsx or .tsx
if [ -f "src/App.tsx" ]; then
  check_file "src/App.tsx"
elif [ -f "src/App.jsx" ]; then
  check_file "src/App.jsx"
fi
check_file "src/components/AnalysisPanel.tsx"
check_file "src/components/DaytonaAutoParser.tsx"
check_file "src/components/FormulaSimulator.tsx"
check_file "src/components/OnboardingOverlay.tsx"
check_file "src/components/SocialSharePanel.tsx"

# 4) Repo meta
echo ""
echo "📦 Repo meta"
check_file ".coderabbit.yaml"

# 5) Backend environment variables
echo ""
echo "🔐 backend/.env status"
if [ -f "backend/.env" ]; then
  echo "✅ Found: backend/.env"
  if grep -q "^DAYTONA_API_KEY=" backend/.env; then
    echo "   ✅ DAYTONA_API_KEY present"
  else
    echo "   ❌ DAYTONA_API_KEY missing"
  fi
  if grep -q "^SENTRY_DSN=" backend/.env; then
    echo "   ✅ SENTRY_DSN present (optional but good)"
  else
    echo "   ⚠️  SENTRY_DSN not set (Sentry will be disabled)"
  fi
else
  echo "❌ MISSING: backend/.env  (no DAYTONA_API_KEY / SENTRY_DSN configured)"
fi

# 6) Quick summary flags
echo ""
echo "==============================================="
echo " SUMMARY:"
BACKEND_OK=true
FRONTEND_OK=true

for path in \
  "backend/package.json" \
  "backend/tsconfig.json" \
  "backend/src/server.ts" \
  "backend/src/routes/parseDocument.ts" \
  "backend/src/routes/youtubeParse.ts"
do
  if [ ! -f "$path" ]; then BACKEND_OK=false; fi
done

for path in \
  "src/components/AnalysisPanel.tsx" \
  "src/components/DaytonaAutoParser.tsx" \
  "src/components/FormulaSimulator.tsx" \
  "src/components/SocialSharePanel.tsx"
do
  if [ ! -f "$path" ]; then FRONTEND_OK=false; fi
done

if [ "$BACKEND_OK" = true ]; then
  echo " ✅ Backend files: OK"
else
  echo " ❌ Backend files: MISSING something (see above)"
fi

if [ "$FRONTEND_OK" = true ]; then
  echo " ✅ Frontend files: OK"
else
  echo " ❌ Frontend files: MISSING something (see above)"
fi

if [ -f "backend/.env" ] && grep -q "^DAYTONA_API_KEY=" backend/.env; then
  echo " ✅ Daytona API key configured"
else
  echo " ⚠️  Daytona API key NOT configured (demo will use fallback patterns)"
fi

echo "==============================================="
echo " DEMO COMMANDS (run manually):"
echo ""
echo " 1) Start backend (terminal #1):"
echo "      npm run dev:backend"
echo ""
echo "    - Backend runs on: http://localhost:3001"
echo "    - Test endpoints:"
echo "      http://localhost:3001/api/health"
echo "      http://localhost:3001/api/youtube-parse (POST)"
echo ""
echo " 2) Start frontend (terminal #2):"
echo "      npm run dev"
echo ""
echo "    - Frontend runs on: http://localhost:5173"
echo ""
echo " 3) In the UI demo, show:"
echo "      • Onboarding overlay walkthrough"
echo "      • YouTube video parsing with Daytona AI branding"
echo "      • FormulaSimulator with slide & rocket labs"
echo "      • Social share panel with friends & lesson feed"
echo "      • Daytona Auto Parser integration"
echo "      • Custom branding (logo & background)"
echo "==============================================="
echo ""
echo "🎥 Demo Flow Suggestion:"
echo "  1. Let onboarding play (4 steps)"
echo "  2. Paste YouTube URL: https://www.youtube.com/watch?v=nR1kMuT03Wg"
echo "  3. Click 'Analyze Video' - show Daytona AI extracting formulas"
echo "  4. Switch between Slide Lab & Rocket Lab"
echo "  5. Share lesson with friends panel"
echo "  6. Mention: Daytona workspace automation, Sentry monitoring, CodeRabbit reviews"
echo "==============================================="
