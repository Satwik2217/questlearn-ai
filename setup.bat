@echo off
setlocal enabledelayedexpansion

title QuestLearn AI - Setup

echo ============================================
echo   QuestLearn AI - Setup
echo   Learn Through Adventure
echo ============================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node -v

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)

echo [OK] npm found:
npm -v
echo.

REM Install dependencies
echo [STEP 1/4] Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b 1
)
echo [OK] Dependencies installed.
echo.

REM Copy environment file
echo [STEP 2/4] Setting up environment variables...
if not exist ".env.local" (
    if exist ".env.example" (
        copy ".env.example" ".env.local" >nul
        echo [OK] Created .env.local from .env.example
        echo [!] Please edit .env.local with your configuration values.
    ) else (
        echo [WARN] .env.example not found. Creating empty .env.local...
        type nul > ".env.local"
    )
) else (
    echo [OK] .env.local already exists.
)
echo.

REM Database migrations
echo [STEP 3/4] Database setup...
echo [!] To run migrations, use the Supabase CLI:
echo     supabase link --project-ref your-project-ref
echo     supabase db push
echo.
echo [!] Or run the SQL files manually in your Supabase dashboard:
echo     1. supabase\migrations\00001_schema.sql
echo     2. supabase\seed.sql (for demo data)
echo.

REM Build check
echo [STEP 4/4] Running type check and build...
call npx tsc --noEmit
if %ERRORLEVEL% neq 0 (
    echo [WARN] TypeScript check found issues. Please review and fix.
) else (
    echo [OK] TypeScript check passed.
)
echo.

echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo   Next steps:
echo   1. Edit .env.local with your configuration
echo   2. Run database migrations (see instructions above)
echo   3. Start the dev server: npm run dev
echo   4. Open http://localhost:3000
echo.
echo   Happy learning! ^<3
echo ============================================
echo.

pause
