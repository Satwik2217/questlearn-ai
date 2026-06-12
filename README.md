# ⚔️ QuestLearn AI

**Learn Through Adventure**

QuestLearn AI is a gamified learning platform that transforms education into an epic RPG adventure. Students master subjects through interactive quests, boss battles, and challenges while parents and teachers track progress through comprehensive dashboards.

Built with Next.js and Supabase, powered by AI for dynamic content generation.

## ✨ Features

### For Students
- **Interactive Worlds** - Immersive subject-based worlds (Math World, Science World, etc.)
- **Quest-Based Learning** - Complete quests, earn XP, level up your character
- **Boss Battles** - Test your knowledge against epic boss fights
- **Knowledge Map** - Visual progress tracking across concepts
- **Achievements & Rewards** - Unlock achievements, collect items, build streaks
- **Leaderboard** - Compete with friends and classmates
- **Character System** - Customize your avatar (Knight, Wizard, Ninja, etc.)
- **Daily Quests** - Fresh challenges every day
- **AI-Generated Content** - Personalized lesson plans and challenges

### For Teachers
- **Classroom Management** - Create and manage classes
- **Student Analytics** - Track individual and class performance
- **Custom Assignments** - Assign specific quests and chapters
- **Progress Reports** - Detailed insights into student learning

### For Parents
- **Activity Dashboard** - Monitor your child's learning journey
- **Progress Tracking** - View completed lessons and achievements
- **Time Management** - Set learning goals and limits

### For Administrators
- **Platform Overview** - System-wide analytics and metrics
- **User Management** - Manage students, teachers, and parents
- **Content Moderation** - Oversee AI-generated content

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (React 19) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | Radix UI Primitives |
| **State Management** | Zustand |
| **Animations** | Framer Motion |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Email + Google OAuth) |
| **AI** | OpenAI API (or compatible) |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Deployment** | Vercel |

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                    Client                        │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Next.js  │  │  Zustand  │  │  Framer       │  │
│  │  App      │  │  Stores   │  │  Motion       │  │
│  │  Router   │  │  (Auth,   │  │  Animations   │  │
│  │           │  │   Game)   │  │               │  │
│  └────┬─────┘  └──────────┘  └───────────────┘  │
│       │                                           │
│  ┌────▼─────────────────────────────────────┐    │
│  │         Supabase SSR Client              │    │
│  │    (Browser + Server + Admin Clients)    │    │
│  └──────────────────┬──────────────────────┘    │
└─────────────────────┼───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│                   Server                         │
│  ┌──────────────┐  ┌────────────┐  ┌────────┐  │
│  │  Next.js API  │  │  Supabase  │  │  OpenAI │  │
│  │  Routes       │  │  Server    │  │  API    │  │
│  │  (REST)       │  │  Client   │  │         │  │
│  └──────┬───────┘  └─────┬──────┘  └────┬───┘  │
└─────────┼────────────────┼──────────────┼───────┘
          │                │              │
┌─────────▼────────────────▼──────────────▼───────┐
│                   Infrastructure                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │  Supabase   │  │  PostgreSQL │  │  Vercel    │ │
│  │  (Auth,     │  │  (Database) │  │  (Hosting) │ │
│  │   Storage)  │  │            │  │            │ │
│  └────────────┘  └────────────┘  └────────────┘ │
└─────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **pnpm** or **yarn**
- A **Supabase** project (free tier works)
- An **OpenAI API key** (or compatible provider)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd questlearn-ai
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
# Supabase - Get these from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI Compatible AI Provider
OPENAI_API_KEY=your-openai-api-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=QuestLearn AI

# Optional: Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 3. Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Run the migration file: `supabase/migrations/00001_schema.sql`
4. Run the seed file: `supabase/seed.sql` for demo data

Or use the Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

### 4. AI Provider Setup

This platform supports any OpenAI-compatible API:

| Provider | Base URL |
|----------|----------|
| OpenAI | `https://api.openai.com/v1` |
| Azure OpenAI | `https://<resource>.openai.azure.com` |
| Groq | `https://api.groq.com/openai/v1` |
| Together AI | `https://api.together.xyz/v1` |
| Local (Ollama) | `http://localhost:11434/v1` |

Set `OPENAI_BASE_URL` in `.env.local` accordingly.

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🌐 Deployment (Vercel)

1. Push your code to a GitHub repository
2. Import the project in [Vercel](https://vercel.com)
3. Configure **Environment Variables** in Vercel dashboard:

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase API Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase API Settings (service_role) |
| `OPENAI_API_KEY` | Your AI provider |
| `OPENAI_BASE_URL` | Your AI provider |
| `OPENAI_MODEL` | Model name |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL |
| `NEXT_PUBLIC_APP_NAME` | `QuestLearn AI` |

4. Deploy! Vercel automatically detects Next.js configuration.

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Auth pages (login, signup)
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   ├── achievements/       # Achievements page
│   ├── boss-battle/        # Boss battle gameplay
│   ├── chapters/           # Chapter content
│   ├── dashboard/          # User dashboard
│   ├── exam/               # Exam mode
│   ├── friends/            # Social features
│   ├── guilds/             # Guilds/groups
│   ├── inventory/          # Player inventory
│   ├── knowledge-map/      # Knowledge map visualization
│   ├── leaderboard/        # Leaderboard
│   ├── levels/             # Level content
│   ├── onboarding/         # First-time user flow
│   ├── parent/             # Parent dashboard
│   ├── profile/            # User profile
│   ├── quests/             # Quest management
│   ├── revision/           # Revision mode
│   ├── settings/           # User settings
│   ├── teacher/            # Teacher dashboard
│   └── worlds/             # World selection
│
├── components/             # React components
│   ├── auth/               # Authentication components
│   ├── boss-battle/        # Battle UI components
│   ├── dashboard/          # Dashboard components
│   ├── game/               # Game-related components
│   ├── layout/             # Layout components
│   ├── onboarding/         # Onboarding components
│   └── ui/                 # Reusable UI primitives
│
├── hooks/                  # Custom React hooks
├── lib/                    # Library code
│   ├── ai/                 # AI integration
│   ├── constants/          # App constants
│   ├── supabase/           # Supabase clients & types
│   └── utils/              # Utility functions
│
├── store/                  # Zustand state stores
└── types/                  # TypeScript type definitions
```

## 🔌 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/callback` | GET | OAuth callback handler |
| `/api/ai/generate` | POST | Generate AI lesson content |
| `/api/ai/explain` | POST | AI-powered concept explanation |
| `/api/ai/quiz` | POST | Generate quiz questions |
| `/api/ai/story` | POST | Generate story content |
| `/api/analytics/overview` | GET | User analytics summary |
| `/api/boss-battle/start` | POST | Start a boss battle |
| `/api/boss-battle/answer` | POST | Submit battle answer |
| `/api/quests/daily` | GET | Get daily quests |
| `/api/quests/claim` | POST | Claim quest rewards |

## 🗄 Database Schema

### Core Tables
- `profiles` - User profiles with XP, level, coins, character type
- `subjects` - Subject definitions (Math, Science, English, etc.)
- `chapters` - Chapter content within subjects
- `levels` - Individual levels within chapters
- `challenges` - Questions and exercises within levels
- `bosses` - Boss definitions for chapter battles
- `boss_challenges` - Questions for boss battles

### Progress & Rewards
- `user_progress` - Track level completion and scores
- `user_achievements` - Unlocked achievements
- `inventory_items` - User item collection
- `concept_mastery` - Knowledge map progression

### Social & Management
- `classrooms` - Teacher-created classes
- `classroom_students` - Student enrollment
- `friends` - Social connections
- `notifications` - User notifications

### Analytics
- `analytics` - Daily learning analytics
- `ai_generations` - AI content generation log

### Configuration
- `items` - Game items catalog
- `achievements` - Achievement definitions
- `concepts` - Knowledge map nodes
- `quests` - User quests
- `subscriptions` - User subscription tiers
- `study_plans` - Student study schedules

Full schema: `supabase/migrations/00001_schema.sql`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write TypeScript with proper types
- Use Tailwind CSS for styling (v4 syntax)
- Ensure your code passes `npm run lint`
- Run `npx tsc --noEmit` for type checking before PR
- Test all new features thoroughly

## 📄 License

This project is private and proprietary. All rights reserved.
