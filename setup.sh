#!/usr/bin/env bash
set -euo pipefail

echo "============================================"
echo "  QuestLearn AI - Setup"
echo "  Learn Through Adventure"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed."
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
echo "[OK] Node.js found: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed."
    exit 1
fi
echo "[OK] npm found: $(npm -v)"
echo ""

# Install dependencies
echo "[STEP 1/4] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies."
    exit 1
fi
echo "[OK] Dependencies installed."
echo ""

# Copy environment file
echo "[STEP 2/4] Setting up environment variables..."
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "[OK] Created .env.local from .env.example"
        echo "[!] Please edit .env.local with your configuration values."
    else
        echo "[WARN] .env.example not found. Creating empty .env.local..."
        touch .env.local
    fi
else
    echo "[OK] .env.local already exists."
fi
echo ""

# Database migrations
echo "[STEP 3/4] Database setup..."
echo "[!] To run migrations, use the Supabase CLI:"
echo "    supabase link --project-ref your-project-ref"
echo "    supabase db push"
echo ""
echo "[!] Or run the SQL files manually in your Supabase dashboard:"
echo "    1. supabase/migrations/00001_schema.sql"
echo "    2. supabase/seed.sql (for demo data)"
echo ""

# Type check
echo "[STEP 4/4] Running type check..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "[WARN] TypeScript check found issues. Please review and fix."
else
    echo "[OK] TypeScript check passed."
fi
echo ""

echo "============================================"
echo "  Setup Complete!"
echo "============================================"
echo ""
echo "  Next steps:"
echo "  1. Edit .env.local with your configuration"
echo "  2. Run database migrations (see instructions above)"
echo "  3. Start the dev server: npm run dev"
echo "  4. Open http://localhost:3000"
echo ""
echo "  Happy learning! <3"
echo "============================================"
echo ""
