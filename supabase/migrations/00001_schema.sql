-- =============================================
-- QuestLearn AI - Complete Database Schema
-- Migration: 00001_schema
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CUSTOM TYPES
-- =============================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'parent', 'teacher', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE board_type AS ENUM ('CBSE', 'ICSE', 'StateBoard', 'IGCSE', 'GCSE', 'USCurriculum');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE character_type AS ENUM ('knight', 'wizard', 'ninja', 'archer', 'scientist', 'explorer');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM ('beginner', 'easy', 'medium', 'hard', 'expert');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE level_type AS ENUM ('story', 'interactive', 'practice', 'quiz', 'boss');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE challenge_type AS ENUM ('mcq', 'drag_drop', 'fill_blanks', 'scenario', 'puzzle', 'matching', 'timed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE item_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE item_category AS ENUM ('book', 'gem', 'scroll', 'crystal', 'weapon', 'artifact');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'school', 'teacher');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE quest_status AS ENUM ('locked', 'available', 'in_progress', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE quest_type AS ENUM ('daily', 'weekly', 'monthly', 'bonus', 'story');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE friend_status AS ENUM ('pending', 'accepted', 'blocked');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('achievement', 'reward', 'quest', 'social', 'system');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE mastery_status AS ENUM ('locked', 'unlocked', 'in_progress', 'mastered');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================
-- TABLES
-- =============================================

-- 1. PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  character_type character_type NOT NULL DEFAULT 'knight',
  age INTEGER,
  class TEXT,
  board board_type,
  role user_role NOT NULL DEFAULT 'student',
  total_xp BIGINT NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  coins BIGINT NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Extended user profiles linked to auth.users';

-- 2. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  world_name TEXT NOT NULL,
  world_description TEXT NOT NULL,
  board board_type NOT NULL,
  class_range TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(name, board, class_range)
);

COMMENT ON TABLE public.subjects IS 'Academic subjects organized by board and class range';

-- 3. CHAPTERS
CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'medium',
  boss_name TEXT NOT NULL,
  boss_description TEXT NOT NULL,
  boss_image_url TEXT,
  total_levels INTEGER NOT NULL DEFAULT 5,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.chapters IS 'Chapters within a subject, each culminating in a boss battle';

-- 4. LEVELS
CREATE TABLE IF NOT EXISTS public.levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  level_type level_type NOT NULL DEFAULT 'interactive',
  difficulty difficulty_level NOT NULL DEFAULT 'medium',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  story_intro TEXT,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.levels IS 'Individual levels/lessons within a chapter';

-- 5. CHALLENGES
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type challenge_type NOT NULL DEFAULT 'mcq',
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'medium',
  points INTEGER NOT NULL DEFAULT 10,
  time_limit INTEGER,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.challenges IS 'Interactive challenges/questions within a level';

-- 6. BOSSES
CREATE TABLE IF NOT EXISTS public.bosses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  hp INTEGER NOT NULL DEFAULT 100,
  max_hp INTEGER NOT NULL DEFAULT 100,
  attack_power INTEGER NOT NULL DEFAULT 10,
  defense_power INTEGER NOT NULL DEFAULT 5,
  special_abilities JSONB DEFAULT '[]'::jsonb,
  difficulty difficulty_level NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.bosses IS 'End-of-chapter boss battles';

-- 7. BOSS CHALLENGES
CREATE TABLE IF NOT EXISTS public.boss_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boss_id UUID NOT NULL REFERENCES public.bosses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  concept TEXT NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'medium',
  damage INTEGER NOT NULL DEFAULT 10,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.boss_challenges IS 'Challenges presented during boss battles';

-- 8. USER PROGRESS
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  score INTEGER,
  xp_earned BIGINT NOT NULL DEFAULT 0,
  coins_earned BIGINT NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,2),
  time_spent INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, level_id)
);

COMMENT ON TABLE public.user_progress IS 'Tracks each user''s progress through levels';

-- 9. QUESTS
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type quest_type NOT NULL DEFAULT 'daily',
  status quest_status NOT NULL DEFAULT 'available',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  coin_reward INTEGER NOT NULL DEFAULT 0,
  item_reward TEXT,
  requirements JSONB NOT NULL DEFAULT '{}'::jsonb,
  progress INTEGER NOT NULL DEFAULT 0,
  target INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.quests IS 'Daily, weekly, and story quests for users';

-- 10. ITEMS
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  rarity item_rarity NOT NULL DEFAULT 'common',
  category item_category NOT NULL DEFAULT 'book',
  image_url TEXT,
  effects JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.items IS 'Global item catalog for the game economy';

-- 11. INVENTORY ITEMS
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  equipped BOOLEAN NOT NULL DEFAULT false,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id)
);

COMMENT ON TABLE public.inventory_items IS 'Items owned by users';

-- 12. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  coin_reward INTEGER NOT NULL DEFAULT 0,
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.achievements IS 'Global achievement definitions';

-- 13. USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

COMMENT ON TABLE public.user_achievements IS 'Achievements unlocked by users';

-- 14. CONCEPTS (Knowledge Map)
CREATE TABLE IF NOT EXISTS public.concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  parent_id UUID REFERENCES public.concepts(id) ON DELETE SET NULL,
  x_position NUMERIC NOT NULL DEFAULT 0,
  y_position NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.concepts IS 'Knowledge map nodes for visualizing concept relationships';

-- 15. CONCEPT MASTERY
CREATE TABLE IF NOT EXISTS public.concept_mastery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  mastery_level INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  correct_attempts INTEGER NOT NULL DEFAULT 0,
  last_practiced TIMESTAMPTZ,
  status mastery_status NOT NULL DEFAULT 'locked',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, concept_id)
);

COMMENT ON TABLE public.concept_mastery IS 'Tracks each user''s mastery of individual concepts';

-- 16. ANALYTICS
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_xp BIGINT NOT NULL DEFAULT 0,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  challenges_solved INTEGER NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 0,
  time_spent_minutes INTEGER NOT NULL DEFAULT 0,
  streak_day INTEGER NOT NULL DEFAULT 0,
  topics_studied JSONB NOT NULL DEFAULT '[]'::jsonb,
  weak_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  strong_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

COMMENT ON TABLE public.analytics IS 'Daily aggregated analytics for each user';

-- 17. CLASSROOMS
CREATE TABLE IF NOT EXISTS public.classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  board board_type,
  class TEXT,
  invite_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.classrooms IS 'Virtual classrooms created by teachers';

-- 18. CLASSROOM STUDENTS
CREATE TABLE IF NOT EXISTS public.classroom_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(classroom_id, student_id)
);

COMMENT ON TABLE public.classroom_students IS 'Students enrolled in classrooms';

-- 19. FRIENDS
CREATE TABLE IF NOT EXISTS public.friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  status friend_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id <> friend_id)
);

COMMENT ON TABLE public.friends IS 'Social connections between users';

-- 20. AI GENERATIONS
CREATE TABLE IF NOT EXISTS public.ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  model TEXT NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.ai_generations IS 'Logs of AI-generated content requests';

-- 21. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'system',
  read BOOLEAN NOT NULL DEFAULT false,
  data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.notifications IS 'User notifications for various events';

-- 22. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '1 month'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.subscriptions IS 'User subscription plans and billing periods';

-- =============================================
-- INDEXES
-- =============================================

-- Profiles
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_board ON public.profiles(board);
CREATE INDEX idx_profiles_total_xp ON public.profiles(total_xp DESC);

-- Subjects
CREATE INDEX idx_subjects_board ON public.subjects(board);
CREATE INDEX idx_subjects_name ON public.subjects(name);

-- Chapters
CREATE INDEX idx_chapters_subject_id ON public.chapters(subject_id);
CREATE INDEX idx_chapters_order ON public.chapters(subject_id, "order");

-- Levels
CREATE INDEX idx_levels_chapter_id ON public.levels(chapter_id);
CREATE INDEX idx_levels_order ON public.levels(chapter_id, "order");
CREATE INDEX idx_levels_type ON public.levels(level_type);

-- Challenges
CREATE INDEX idx_challenges_level_id ON public.challenges(level_id);
CREATE INDEX idx_challenges_order ON public.challenges(level_id, "order");
CREATE INDEX idx_challenges_type ON public.challenges(challenge_type);

-- Bosses
CREATE INDEX idx_bosses_chapter_id ON public.bosses(chapter_id);

-- Boss Challenges
CREATE INDEX idx_boss_challenges_boss_id ON public.boss_challenges(boss_id);
CREATE INDEX idx_boss_challenges_order ON public.boss_challenges(boss_id, "order");

-- User Progress
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_level_id ON public.user_progress(level_id);
CREATE INDEX idx_user_progress_completed ON public.user_progress(user_id, completed);
CREATE INDEX idx_user_progress_started ON public.user_progress(user_id, started_at DESC);

-- Quests
CREATE INDEX idx_quests_user_id ON public.quests(user_id);
CREATE INDEX idx_quests_status ON public.quests(user_id, status);
CREATE INDEX idx_quests_type ON public.quests(user_id, type);
CREATE INDEX idx_quests_expires ON public.quests(expires_at) WHERE expires_at IS NOT NULL;

-- Items
CREATE INDEX idx_items_rarity ON public.items(rarity);
CREATE INDEX idx_items_category ON public.items(category);

-- Inventory Items
CREATE INDEX idx_inventory_items_user_id ON public.inventory_items(user_id);
CREATE INDEX idx_inventory_items_equipped ON public.inventory_items(user_id, equipped);

-- Achievements
CREATE INDEX idx_achievements_name ON public.achievements(name);

-- User Achievements
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);

-- Concepts
CREATE INDEX idx_concepts_chapter_id ON public.concepts(chapter_id);
CREATE INDEX idx_concepts_parent_id ON public.concepts(parent_id);
CREATE INDEX idx_concepts_order ON public.concepts(chapter_id, "order");

-- Concept Mastery
CREATE INDEX idx_concept_mastery_user_id ON public.concept_mastery(user_id);
CREATE INDEX idx_concept_mastery_concept_id ON public.concept_mastery(concept_id);
CREATE INDEX idx_concept_mastery_status ON public.concept_mastery(user_id, status);

-- Analytics
CREATE INDEX idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX idx_analytics_date ON public.analytics(user_id, date DESC);

-- Classrooms
CREATE INDEX idx_classrooms_teacher_id ON public.classrooms(teacher_id);
CREATE INDEX idx_classrooms_invite_code ON public.classrooms(invite_code);
CREATE INDEX idx_classrooms_subject_id ON public.classrooms(subject_id);

-- Classroom Students
CREATE INDEX idx_classroom_students_classroom ON public.classroom_students(classroom_id);
CREATE INDEX idx_classroom_students_student ON public.classroom_students(student_id);

-- Friends
CREATE INDEX idx_friends_user_id ON public.friends(user_id);
CREATE INDEX idx_friends_friend_id ON public.friends(friend_id);
CREATE INDEX idx_friends_status ON public.friends(user_id, status);

-- AI Generations
CREATE INDEX idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX idx_ai_generations_type ON public.ai_generations(type);
CREATE INDEX idx_ai_generations_created ON public.ai_generations(user_id, created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, read);
CREATE INDEX idx_notifications_type ON public.notifications(user_id, type);
CREATE INDEX idx_notifications_created ON public.notifications(user_id, created_at DESC);

-- Subscriptions
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(user_id, status);

-- =============================================
-- TRIGGER FUNCTIONS
-- =============================================

-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply updated_at trigger to all tables that have updated_at column
DO $$
DECLARE
  t TEXT;
  tables_with_updated_at TEXT[] := ARRAY[
    'profiles', 'subjects', 'chapters', 'levels', 'challenges',
    'bosses', 'boss_challenges', 'user_progress', 'quests', 'items',
    'inventory_items', 'achievements', 'concepts', 'concept_mastery',
    'analytics', 'classrooms', 'classroom_students', 'friends',
    'subscriptions'
  ];
BEGIN
  FOREACH t IN ARRAY tables_with_updated_at
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
      EXECUTE format(
        'DROP TRIGGER IF EXISTS trg_%s_updated_at ON public.%I; CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();',
        t, t, t, t
      );
    END IF;
  END LOOP;
END;
$$;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url',
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'student'::user_role)
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update last_active and streak on profile access
CREATE OR REPLACE FUNCTION public.update_last_active()
RETURNS TRIGGER AS $$
DECLARE
  last_active_date DATE;
  today DATE := CURRENT_DATE;
BEGIN
  last_active_date := OLD.last_active::DATE;

  IF last_active_date = today - INTERVAL '1 day' THEN
    NEW.streak_days := OLD.streak_days + 1;
  ELSIF last_active_date < today - INTERVAL '1 day' THEN
    NEW.streak_days := 1;
  ELSE
    NEW.streak_days := OLD.streak_days;
  END IF;

  NEW.last_active := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_profiles_last_active ON public.profiles;
CREATE TRIGGER trg_profiles_last_active
  BEFORE UPDATE OF last_active ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_last_active();

-- =============================================
-- FUNCTIONS
-- =============================================

-- Calculate level from total XP
CREATE OR REPLACE FUNCTION public.calculate_level(xp BIGINT)
RETURNS INTEGER AS $$
DECLARE
  lvl INTEGER := 1;
  xp_needed BIGINT := 100;
  accumulated BIGINT := 0;
BEGIN
  IF xp < 0 THEN
    RETURN 1;
  END IF;

  LOOP
    accumulated := accumulated + xp_needed;
    EXIT WHEN accumulated > xp;
    lvl := lvl + 1;
    IF lvl <= 10 THEN
      xp_needed := 100;
    ELSIF lvl <= 20 THEN
      xp_needed := 250;
    ELSIF lvl <= 30 THEN
      xp_needed := 500;
    ELSIF lvl <= 50 THEN
      xp_needed := 1000;
    ELSE
      xp_needed := 2000;
    END IF;
  END LOOP;

  RETURN lvl;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Calculate XP needed for next level
CREATE OR REPLACE FUNCTION public.xp_for_next_level(current_level INTEGER)
RETURNS BIGINT AS $$
BEGIN
  IF current_level < 1 THEN
    RETURN 100;
  ELSIF current_level < 10 THEN
    RETURN 100;
  ELSIF current_level < 20 THEN
    RETURN 250;
  ELSIF current_level < 30 THEN
    RETURN 500;
  ELSIF current_level < 50 THEN
    RETURN 1000;
  ELSE
    RETURN 2000;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add XP and recalculate level
CREATE OR REPLACE FUNCTION public.add_xp(
  p_user_id UUID,
  p_xp_amount BIGINT
)
RETURNS TABLE(
  new_total_xp BIGINT,
  old_level INTEGER,
  new_level INTEGER,
  leveled_up BOOLEAN
) AS $$
DECLARE
  v_old_level INTEGER;
  v_new_level INTEGER;
  v_new_total_xp BIGINT;
BEGIN
  SELECT level, total_xp INTO v_old_level, v_new_total_xp
  FROM public.profiles WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found for user_id: %', p_user_id;
  END IF;

  v_new_total_xp := v_new_total_xp + p_xp_amount;
  v_new_level := public.calculate_level(v_new_total_xp);

  UPDATE public.profiles
  SET total_xp = v_new_total_xp,
      level = v_new_level
  WHERE user_id = p_user_id;

  RETURN QUERY
  SELECT v_new_total_xp, v_old_level, v_new_level, (v_new_level > v_old_level);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update daily analytics for a user
CREATE OR REPLACE FUNCTION public.update_daily_analytics(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_xp_today BIGINT;
  v_lessons_completed INTEGER;
  v_challenges_solved INTEGER;
  v_accuracy NUMERIC(5,2);
  v_time_spent INTEGER;
  v_streak INTEGER;
  v_topics JSONB;
  v_weak JSONB;
  v_strong JSONB;
BEGIN
  -- Aggregate today's progress
  SELECT
    COALESCE(SUM(xp_earned), 0),
    COUNT(*) FILTER (WHERE completed),
    COALESCE(SUM(challenges_solved), 0),
    COALESCE(AVG(accuracy) FILTER (WHERE accuracy IS NOT NULL), 0),
    COALESCE(SUM(time_spent), 0)
  INTO
    v_xp_today,
    v_lessons_completed,
    v_challenges_solved,
    v_accuracy,
    v_time_spent
  FROM public.user_progress
  WHERE user_id = p_user_id
    AND started_at::DATE = v_today;

  -- Get streak
  SELECT streak_days INTO v_streak
  FROM public.profiles WHERE user_id = p_user_id;

  -- Get topics studied today (from progress)
  SELECT COALESCE(
    jsonb_agg(DISTINCT l.title) FILTER (WHERE l.title IS NOT NULL),
    '[]'::jsonb
  ) INTO v_topics
  FROM public.user_progress up
  JOIN public.levels l ON l.id = up.level_id
  WHERE up.user_id = p_user_id
    AND up.started_at::DATE = v_today;

  -- Determine weak and strong areas from concept mastery
  SELECT
    COALESCE(
      jsonb_agg(c.name) FILTER (WHERE cm.mastery_level < 3 AND c.name IS NOT NULL),
      '[]'::jsonb
    ),
    COALESCE(
      jsonb_agg(c.name) FILTER (WHERE cm.mastery_level >= 4 AND c.name IS NOT NULL),
      '[]'::jsonb
    )
  INTO v_weak, v_strong
  FROM public.concept_mastery cm
  JOIN public.concepts c ON c.id = cm.concept_id
  WHERE cm.user_id = p_user_id;

  -- Upsert analytics
  INSERT INTO public.analytics (
    user_id, date, total_xp, lessons_completed, challenges_solved,
    accuracy, time_spent_minutes, streak_day, topics_studied, weak_areas, strong_areas
  ) VALUES (
    p_user_id, v_today, v_xp_today, v_lessons_completed, v_challenges_solved,
    v_accuracy, v_time_spent, v_streak, v_topics, v_weak, v_strong
  )
  ON CONFLICT (user_id, date) DO UPDATE SET
    total_xp = EXCLUDED.total_xp,
    lessons_completed = EXCLUDED.lessons_completed,
    challenges_solved = EXCLUDED.challenges_solved,
    accuracy = EXCLUDED.accuracy,
    time_spent_minutes = EXCLUDED.time_spent_minutes,
    streak_day = EXCLUDED.streak_day,
    topics_studied = EXCLUDED.topics_studied,
    weak_areas = EXCLUDED.weak_areas,
    strong_areas = EXCLUDED.strong_areas,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Helper function to check if user is teacher
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Enable RLS on all tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
  END LOOP;
END;
$$;

-- =============================================
-- RLS POLICIES
-- =============================================

-- PROFILES
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "profiles_select_teacher" ON public.profiles
  FOR SELECT USING (
    public.is_teacher() AND
    EXISTS (
      SELECT 1 FROM public.classroom_students cs
      JOIN public.classrooms c ON c.id = cs.classroom_id
      WHERE c.teacher_id = auth.uid() AND cs.student_id = profiles.user_id
    )
  );

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "profiles_insert_admin" ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin());

-- SUBJECTS (readable by all authenticated, writable by admins)
CREATE POLICY "subjects_select_auth" ON public.subjects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "subjects_insert_admin" ON public.subjects
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "subjects_update_admin" ON public.subjects
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "subjects_delete_admin" ON public.subjects
  FOR DELETE USING (public.is_admin());

-- CHAPTERS
CREATE POLICY "chapters_select_auth" ON public.chapters
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "chapters_insert_admin" ON public.chapters
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "chapters_update_admin" ON public.chapters
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "chapters_delete_admin" ON public.chapters
  FOR DELETE USING (public.is_admin());

-- LEVELS
CREATE POLICY "levels_select_auth" ON public.levels
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "levels_insert_admin" ON public.levels
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "levels_update_admin" ON public.levels
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "levels_delete_admin" ON public.levels
  FOR DELETE USING (public.is_admin());

-- CHALLENGES
CREATE POLICY "challenges_select_auth" ON public.challenges
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "challenges_insert_admin" ON public.challenges
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "challenges_update_admin" ON public.challenges
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "challenges_delete_admin" ON public.challenges
  FOR DELETE USING (public.is_admin());

-- BOSSES
CREATE POLICY "bosses_select_auth" ON public.bosses
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "bosses_insert_admin" ON public.bosses
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "bosses_update_admin" ON public.bosses
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "bosses_delete_admin" ON public.bosses
  FOR DELETE USING (public.is_admin());

-- BOSS CHALLENGES
CREATE POLICY "boss_challenges_select_auth" ON public.boss_challenges
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "boss_challenges_insert_admin" ON public.boss_challenges
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "boss_challenges_update_admin" ON public.boss_challenges
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "boss_challenges_delete_admin" ON public.boss_challenges
  FOR DELETE USING (public.is_admin());

-- USER PROGRESS
CREATE POLICY "user_progress_select_own" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_progress_select_teacher" ON public.user_progress
  FOR SELECT USING (
    public.is_teacher() AND
    EXISTS (
      SELECT 1 FROM public.classroom_students cs
      JOIN public.classrooms c ON c.id = cs.classroom_id
      WHERE c.teacher_id = auth.uid() AND cs.student_id = user_progress.user_id
    )
  );

CREATE POLICY "user_progress_insert_own" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_progress_update_own" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- QUESTS
CREATE POLICY "quests_select_own" ON public.quests
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "quests_insert_own" ON public.quests
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "quests_update_own" ON public.quests
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "quests_delete_own" ON public.quests
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- ITEMS
CREATE POLICY "items_select_auth" ON public.items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "items_insert_admin" ON public.items
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "items_update_admin" ON public.items
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "items_delete_admin" ON public.items
  FOR DELETE USING (public.is_admin());

-- INVENTORY ITEMS
CREATE POLICY "inventory_items_select_own" ON public.inventory_items
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "inventory_items_insert_own" ON public.inventory_items
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "inventory_items_update_own" ON public.inventory_items
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "inventory_items_delete_admin" ON public.inventory_items
  FOR DELETE USING (public.is_admin());

-- ACHIEVEMENTS
CREATE POLICY "achievements_select_auth" ON public.achievements
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "achievements_insert_admin" ON public.achievements
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "achievements_update_admin" ON public.achievements
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "achievements_delete_admin" ON public.achievements
  FOR DELETE USING (public.is_admin());

-- USER ACHIEVEMENTS
CREATE POLICY "user_achievements_select_own" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "user_achievements_insert_admin" ON public.user_achievements
  FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() = user_id);

-- CONCEPTS
CREATE POLICY "concepts_select_auth" ON public.concepts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "concepts_insert_admin" ON public.concepts
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "concepts_update_admin" ON public.concepts
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "concepts_delete_admin" ON public.concepts
  FOR DELETE USING (public.is_admin());

-- CONCEPT MASTERY
CREATE POLICY "concept_mastery_select_own" ON public.concept_mastery
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "concept_mastery_select_teacher" ON public.concept_mastery
  FOR SELECT USING (
    public.is_teacher() AND
    EXISTS (
      SELECT 1 FROM public.classroom_students cs
      JOIN public.classrooms c ON c.id = cs.classroom_id
      WHERE c.teacher_id = auth.uid() AND cs.student_id = concept_mastery.user_id
    )
  );

CREATE POLICY "concept_mastery_insert_own" ON public.concept_mastery
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "concept_mastery_update_own" ON public.concept_mastery
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- ANALYTICS
CREATE POLICY "analytics_select_own" ON public.analytics
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "analytics_select_teacher" ON public.analytics
  FOR SELECT USING (
    public.is_teacher() AND
    EXISTS (
      SELECT 1 FROM public.classroom_students cs
      JOIN public.classrooms c ON c.id = cs.classroom_id
      WHERE c.teacher_id = auth.uid() AND cs.student_id = analytics.user_id
    )
  );

CREATE POLICY "analytics_insert_admin" ON public.analytics
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "analytics_update_admin" ON public.analytics
  FOR UPDATE USING (public.is_admin());

-- CLASSROOMS
CREATE POLICY "classrooms_select_own" ON public.classrooms
  FOR SELECT USING (
    auth.uid() = teacher_id OR
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.classroom_students
      WHERE classroom_id = classrooms.id AND student_id = auth.uid()
    )
  );

CREATE POLICY "classrooms_insert_teacher" ON public.classrooms
  FOR INSERT WITH CHECK (public.is_teacher());

CREATE POLICY "classrooms_update_teacher" ON public.classrooms
  FOR UPDATE USING (auth.uid() = teacher_id OR public.is_admin());

CREATE POLICY "classrooms_delete_teacher" ON public.classrooms
  FOR DELETE USING (auth.uid() = teacher_id OR public.is_admin());

-- CLASSROOM STUDENTS
CREATE POLICY "classroom_students_select_own" ON public.classroom_students
  FOR SELECT USING (
    auth.uid() = student_id OR
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.classrooms
      WHERE id = classroom_students.classroom_id AND teacher_id = auth.uid()
    )
  );

CREATE POLICY "classroom_students_insert_teacher" ON public.classroom_students
  FOR INSERT WITH CHECK (
    public.is_teacher() OR
    public.is_admin()
  );

CREATE POLICY "classroom_students_delete_own" ON public.classroom_students
  FOR DELETE USING (
    auth.uid() = student_id OR
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.classrooms
      WHERE id = classroom_students.classroom_id AND teacher_id = auth.uid()
    )
  );

-- FRIENDS
CREATE POLICY "friends_select_own" ON public.friends
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id OR public.is_admin());

CREATE POLICY "friends_insert_own" ON public.friends
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "friends_update_own" ON public.friends
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "friends_delete_own" ON public.friends
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- AI GENERATIONS
CREATE POLICY "ai_generations_select_own" ON public.ai_generations
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "ai_generations_insert_own" ON public.ai_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "ai_generations_delete_admin" ON public.ai_generations
  FOR DELETE USING (public.is_admin());

-- NOTIFICATIONS
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "notifications_insert_admin" ON public.notifications
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- SUBSCRIPTIONS
CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "subscriptions_insert_admin" ON public.subscriptions
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "subscriptions_update_admin" ON public.subscriptions
  FOR UPDATE USING (public.is_admin());

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant table permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon, service_role;

-- Grant function execution
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon, service_role;

-- Revoke delete on critical tables for non-admin (handled via RLS)
ALTER TABLE public.subjects FORCE ROW LEVEL SECURITY;
ALTER TABLE public.chapters FORCE ROW LEVEL SECURITY;
ALTER TABLE public.levels FORCE ROW LEVEL SECURITY;
ALTER TABLE public.challenges FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bosses FORCE ROW LEVEL SECURITY;
ALTER TABLE public.boss_challenges FORCE ROW LEVEL SECURITY;
ALTER TABLE public.items FORCE ROW LEVEL SECURITY;
ALTER TABLE public.achievements FORCE ROW LEVEL SECURITY;
ALTER TABLE public.concepts FORCE ROW LEVEL SECURITY;

-- =============================================
-- STORED PROCEDURES
-- =============================================

-- Complete a level and track progress
CREATE OR REPLACE FUNCTION public.complete_level(
  p_user_id UUID,
  p_level_id UUID,
  p_score INTEGER DEFAULT NULL,
  p_accuracy NUMERIC DEFAULT NULL,
  p_time_spent INTEGER DEFAULT NULL,
  p_xp_earned BIGINT DEFAULT 0,
  p_coins_earned BIGINT DEFAULT 0
)
RETURNS public.user_progress AS $$
DECLARE
  v_progress public.user_progress;
BEGIN
  INSERT INTO public.user_progress (
    user_id, level_id, completed, score, accuracy,
    time_spent, xp_earned, coins_earned, attempts,
    started_at, completed_at
  ) VALUES (
    p_user_id, p_level_id, true, p_score, p_accuracy,
    p_time_spent, p_xp_earned, p_coins_earned, 1,
    now(), now()
  )
  ON CONFLICT (user_id, level_id) DO UPDATE SET
    completed = true,
    score = GREATEST(COALESCE(user_progress.score, 0), COALESCE(p_score, 0)),
    accuracy = COALESCE(p_accuracy, user_progress.accuracy),
    time_spent = COALESCE(user_progress.time_spent, 0) + COALESCE(p_time_spent, 0),
    xp_earned = user_progress.xp_earned + p_xp_earned,
    coins_earned = user_progress.coins_earned + p_coins_earned,
    attempts = user_progress.attempts + 1,
    completed_at = now(),
    updated_at = now()
  RETURNING * INTO v_progress;

  PERFORM public.add_xp(p_user_id, p_xp_earned);

  UPDATE public.profiles
  SET coins = coins + p_coins_earned,
      last_active = now()
  WHERE user_id = p_user_id;

  RETURN v_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get leaderboard (top users by XP)
CREATE OR REPLACE FUNCTION public.get_leaderboard(
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  rank BIGINT,
  user_id UUID,
  display_name TEXT,
  avatar_url TEXT,
  level INTEGER,
  total_xp BIGINT,
  streak_days INTEGER,
  character_type character_type
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY p.total_xp DESC)::BIGINT,
    p.user_id,
    p.display_name,
    p.avatar_url,
    p.level,
    p.total_xp,
    p.streak_days,
    p.character_type
  FROM public.profiles p
  WHERE p.role = 'student'
  ORDER BY p.total_xp DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =============================================
-- END OF SCHEMA
-- =============================================
