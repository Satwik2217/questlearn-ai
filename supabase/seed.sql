-- =============================================
-- QuestLearn AI - Seed Data
-- =============================================

-- =============================================
-- SEED USERS (auth.users + auth.identities)
-- =============================================

-- Admin user
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_sent_at, is_sso_user, deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated', 'admin@questlearn.ai',
  crypt('admin123', gen_salt('bf')),
  now(), '{"provider": "email", "providers": ["email"]}',
  '{"display_name": "QuestMaster", "role": "admin"}',
  now(), now(), now(), false, NULL
) ON CONFLICT (id) DO NOTHING;

-- Teacher user
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_sent_at, is_sso_user, deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000002',
  'authenticated', 'authenticated', 'teacher@questlearn.ai',
  crypt('teacher123', gen_salt('bf')),
  now(), '{"provider": "email", "providers": ["email"]}',
  '{"display_name": "ProfessorAlex", "role": "teacher"}',
  now(), now(), now(), false, NULL
) ON CONFLICT (id) DO NOTHING;

-- Demo student user
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_sent_at, is_sso_user, deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000003',
  'authenticated', 'authenticated', 'student@questlearn.ai',
  crypt('student123', gen_salt('bf')),
  now(), '{"provider": "email", "providers": ["email"]}',
  '{"display_name": "CodeNinja", "role": "student"}',
  now(), now(), now(), false, NULL
) ON CONFLICT (id) DO NOTHING;

-- Auth identities
INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT id, id, jsonb_build_object('sub', id::text, 'email', email), 'email', now(), now(), now()
FROM auth.users
WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003'
)
ON CONFLICT (id, provider) DO NOTHING;

-- =============================================
-- UPDATE PROFILES (created by trigger)
-- =============================================

UPDATE public.profiles SET
  display_name = 'QuestMaster',
  role = 'admin',
  character_type = 'wizard',
  total_xp = 50000,
  level = 50,
  coins = 10000,
  streak_days = 30
WHERE user_id = '00000000-0000-0000-0000-000000000001';

UPDATE public.profiles SET
  display_name = 'ProfessorAlex',
  role = 'teacher',
  character_type = 'scientist',
  total_xp = 25000,
  level = 30,
  coins = 5000,
  streak_days = 15
WHERE user_id = '00000000-0000-0000-0000-000000000002';

UPDATE public.profiles SET
  display_name = 'CodeNinja',
  role = 'student',
  character_type = 'ninja',
  board = 'CBSE',
  class = '10',
  age = 15,
  total_xp = 1500,
  level = 5,
  coins = 250,
  streak_days = 3
WHERE user_id = '00000000-0000-0000-0000-000000000003';

-- =============================================
-- SUBJECTS (CBSE Class 10)
-- =============================================

WITH board_val AS (SELECT 'CBSE'::board_type AS board)
INSERT INTO public.subjects (name, display_name, icon, color, world_name, world_description, board, class_range) VALUES
  ('mathematics', 'Mathematics', 'calculator', '#6366f1', 'Math World',
   'A realm of numbers, equations, and logical puzzles. Master algebra, geometry, and trigonometry to unlock the secrets of the universe.',
   'CBSE', '9-10'),
  ('science', 'Science', 'flask', '#22c55e', 'Science World',
   'Explore the wonders of physics, chemistry, and biology. Conduct experiments and discover the laws of nature.',
   'CBSE', '9-10'),
  ('english', 'English', 'book-open', '#f59e0b', 'English Kingdom',
   'Journey through literature and language. Master grammar, poetry, and prose to become a wordsmith warrior.',
   'CBSE', '9-10'),
  ('history', 'History', 'landmark', '#ef4444', 'History Empire',
   'Travel through time to ancient civilizations and modern revolutions. Learn from the past to shape the future.',
   'CBSE', '9-10'),
  ('geography', 'Geography', 'globe', '#06b6d4', 'Geography Realm',
   'Discover continents, climates, and cultures. Map your way through physical and human geography.',
   'CBSE', '9-10')
ON CONFLICT (name, board, class_range) DO NOTHING;

-- =============================================
-- CHAPTERS (3 per subject)
-- =============================================

-- Mathematics Chapters
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Algebraic Foundations', 'Master linear equations, quadratic equations, and polynomials. Build your algebraic arsenal.', 1, 'beginner'::difficulty_level,
  'The Equation Overlord', 'A fearsome entity that bends mathematical reality. Defeat it by solving complex equations!',
  5, 500
FROM public.subjects s WHERE s.name = 'mathematics' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Geometry & Trigonometry', 'Explore shapes, angles, and trigonometric ratios. Measure the world around you.', 2, 'medium'::difficulty_level,
  'The Angle Tyrant', 'A geometric monstrosity that twists space itself. Use your knowledge of angles and shapes to defeat it!',
  5, 500
FROM public.subjects s WHERE s.name = 'mathematics' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Statistics & Probability', 'Learn to analyze data and predict outcomes. Chance favors the prepared mind.', 3, 'hard'::difficulty_level,
  'The Probability Phantom', 'An ethereal being that manipulates chance. Calculate the odds and strike when they are in your favor!',
  5, 500
FROM public.subjects s WHERE s.name = 'mathematics' AND s.board = 'CBSE';

-- Science Chapters
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Chemical Reactions & Equations', 'Understand how substances transform. Balance equations like a true alchemist.', 1, 'beginner'::difficulty_level,
  'The Corrosion Colossus', 'A giant of rust and decay born from uncontrolled reactions. Neutralize it with balanced equations!',
  5, 500
FROM public.subjects s WHERE s.name = 'science' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Light & Optics', 'Study the behavior of light, reflection, and refraction. See the invisible.', 2, 'medium'::difficulty_level,
  'The Shadow Weaver', 'A creature that bends light to create illusions. Use optics to reveal its true form!',
  5, 500
FROM public.subjects s WHERE s.name = 'science' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Electricity & Circuits', 'Master the flow of electrons. Power up your knowledge of circuits and current.', 3, 'hard'::difficulty_level,
  'The Voltage Vanguard', 'An electrified titan crackling with energy. Master circuits to ground its power!',
  5, 500
FROM public.subjects s WHERE s.name = 'science' AND s.board = 'CBSE';

-- English Chapters
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Grammar & Composition', 'Build a strong foundation in grammar rules and writing skills.', 1, 'beginner'::difficulty_level,
  'The Syntax Serpent', 'A massive snake made of tangled sentences. Untangle its grammar to defeat it!',
  5, 500
FROM public.subjects s WHERE s.name = 'english' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Poetry & Prose', 'Analyze literary devices and explore the beauty of language.', 2, 'medium'::difficulty_level,
  'The Rhyme Reaper', 'A dark poet who traps victims in endless verses. Break free with your literary analysis!',
  5, 500
FROM public.subjects s WHERE s.name = 'english' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Drama & Communication', 'Study plays, dialogues, and effective communication techniques.', 3, 'medium'::difficulty_level,
  'The Monologue Monarch', 'A theatrical tyrant who speaks only in soliloquies. Respond with dramatic understanding!',
  5, 500
FROM public.subjects s WHERE s.name = 'english' AND s.board = 'CBSE';

-- History Chapters
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Ancient Civilizations', 'Explore the Indus Valley, Mesopotamia, and ancient empires.', 1, 'beginner'::difficulty_level,
  'The Mummy Pharaoh', 'An ancient ruler awakened from slumber. Answer historical riddles to lay it to rest!',
  5, 500
FROM public.subjects s WHERE s.name = 'history' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Medieval India', 'Study the Delhi Sultanate, Mughal Empire, and cultural fusion.', 2, 'medium'::difficulty_level,
  'The Sultan of Shadows', 'A ghostly ruler from the medieval era commanding shadow armies. Prove your historical knowledge!',
  5, 500
FROM public.subjects s WHERE s.name = 'history' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Modern World', 'Understand nationalism, world wars, and independence movements.', 3, 'hard'::difficulty_level,
  'The War Machine', 'A clockwork behemoth fueled by conflict. Master modern history to dismantle it!',
  5, 500
FROM public.subjects s WHERE s.name = 'history' AND s.board = 'CBSE';

-- Geography Chapters
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Physical Geography', 'Study landforms, climate, and natural processes shaping Earth.', 1, 'beginner'::difficulty_level,
  'The Terra Titan', 'A massive earth elemental born from tectonic fury. Use geographical knowledge to calm it!',
  5, 500
FROM public.subjects s WHERE s.name = 'geography' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Human Geography', 'Explore population, resources, and human-environment interaction.', 2, 'medium'::difficulty_level,
  'The Urban Hydra', 'A sprawling city-monster with endless heads representing urban challenges. Plan sustainable solutions!',
  5, 500
FROM public.subjects s WHERE s.name = 'geography' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Maps & Cartography', 'Master map reading, coordinates, and spatial analysis.', 3, 'hard'::difficulty_level,
  'The Cartographic Kraken', 'An ancient sea monster that distorts maps and coordinates. Navigate accurately to defeat it!',
  5, 500
FROM public.subjects s WHERE s.name = 'geography' AND s.board = 'CBSE';

-- =============================================
-- LEVELS (5 per chapter = 75 total)
-- =============================================

-- Helper: Insert 5 levels for each chapter
DO $$
DECLARE
  ch RECORD;
  lvl_data JSONB;
  lvl RECORD;
BEGIN
  FOR ch IN SELECT id, title FROM public.chapters LOOP
    FOR lvl IN SELECT * FROM jsonb_to_recordset('[
      {"order": 1, "title_suffix": "Introduction", "desc_suffix": "Learn the fundamental concepts.", "type": "story", "xp": 50},
      {"order": 2, "title_suffix": "Exploration", "desc_suffix": "Practice with interactive exercises.", "type": "interactive", "xp": 75},
      {"order": 3, "title_suffix": "Practice", "desc_suffix": "Test your skills with challenging problems.", "type": "practice", "xp": 100},
      {"order": 4, "title_suffix": "Mastery", "desc_suffix": "Apply advanced techniques and strategies.", "type": "quiz", "xp": 125},
      {"order": 5, "title_suffix": "Final Challenge", "desc_suffix": "Prepare for the boss battle!", "type": "boss", "xp": 150}
    ]'::jsonb AS (
      "order" INTEGER,
      "title_suffix" TEXT,
      "desc_suffix" TEXT,
      "type" TEXT,
      "xp" INTEGER
    ) LOOP
      INSERT INTO public.levels (chapter_id, title, description, "order", level_type, difficulty, xp_reward, content_json)
      VALUES (
        ch.id,
        ch.title || ': ' || lvl.title_suffix,
        lvl.desc_suffix,
        lvl."order",
        lvl.type::level_type,
        CASE
          WHEN lvl."order" <= 1 THEN 'beginner'::difficulty_level
          WHEN lvl."order" <= 2 THEN 'easy'::difficulty_level
          WHEN lvl."order" <= 3 THEN 'medium'::difficulty_level
          WHEN lvl."order" <= 4 THEN 'hard'::difficulty_level
          ELSE 'expert'::difficulty_level
        END,
        lvl.xp,
        jsonb_build_object(
          'objectives', jsonb_build_array(
            jsonb_build_object('description', 'Complete all challenges in this level', 'points', lvl.xp)
          ),
          'prerequisites', jsonb_build_array(),
          'rewards', jsonb_build_object(
            'xp', lvl.xp,
            'coins', lvl.xp / 2
          )
        )
      );
    END LOOP;
  END LOOP;
END;
$$;

-- =============================================
-- CHALLENGES (3 per level)
-- =============================================

DO $$
DECLARE
  lvl RECORD;
  challenge_num INTEGER;
  difficulties difficulty_level[] := ARRAY['beginner'::difficulty_level, 'easy'::difficulty_level, 'medium'::difficulty_level];
  challenge_types challenge_type[] := ARRAY['mcq'::challenge_type, 'mcq'::challenge_type, 'fill_blanks'::challenge_type];
BEGIN
  FOR lvl IN SELECT id, xp_reward FROM public.levels LOOP
    FOR challenge_num IN 1..3 LOOP
      INSERT INTO public.challenges (
        level_id, title, description, challenge_type, question,
        options, correct_answer, explanation, difficulty, points, "order"
      ) VALUES (
        lvl.id,
        'Challenge ' || challenge_num,
        'Test your understanding with this challenge.',
        challenge_types[challenge_num],
        'Sample question for this challenge. Replace with actual content.',
        CASE WHEN challenge_types[challenge_num] = 'mcq' THEN
          jsonb_build_array(
            'Option A - First possible answer',
            'Option B - Second possible answer',
            'Option C - Third possible answer',
            'Option D - Fourth possible answer'
          )
        ELSE NULL END,
        'answer_' || challenge_num,
        'This is the explanation for the correct answer. Replace with meaningful content.',
        difficulties[challenge_num],
        lvl.xp_reward / 3,
        challenge_num
      );
    END LOOP;
  END LOOP;
END;
$$;

-- =============================================
-- BOSSES (1 per chapter)
-- =============================================

INSERT INTO public.bosses (chapter_id, name, description, hp, max_hp, attack_power, defense_power, special_abilities, difficulty)
SELECT
  c.id, c.boss_name, c.boss_description,
  CASE c.difficulty
    WHEN 'beginner'::difficulty_level THEN 50
    WHEN 'easy'::difficulty_level THEN 75
    WHEN 'medium'::difficulty_level THEN 100
    WHEN 'hard'::difficulty_level THEN 150
    ELSE 200
  END,
  CASE c.difficulty
    WHEN 'beginner'::difficulty_level THEN 50
    WHEN 'easy'::difficulty_level THEN 75
    WHEN 'medium'::difficulty_level THEN 100
    WHEN 'hard'::difficulty_level THEN 150
    ELSE 200
  END,
  CASE c.difficulty
    WHEN 'beginner'::difficulty_level THEN 5
    WHEN 'easy'::difficulty_level THEN 8
    WHEN 'medium'::difficulty_level THEN 12
    WHEN 'hard'::difficulty_level THEN 18
    ELSE 25
  END,
  CASE c.difficulty
    WHEN 'beginner'::difficulty_level THEN 2
    WHEN 'easy'::difficulty_level THEN 4
    WHEN 'medium'::difficulty_level THEN 6
    WHEN 'hard'::difficulty_level THEN 10
    ELSE 15
  END,
  jsonb_build_array(
    jsonb_build_object('name', 'Power Strike', 'description', 'A powerful basic attack', 'damage_multiplier', 1.5, 'cooldown', 2),
    jsonb_build_object('name', 'Shield Up', 'description', 'Raises defense temporarily', 'defense_boost', 10, 'cooldown', 3),
    jsonb_build_object('name', 'Enrage', 'description', 'Enters a rage state increasing attack', 'attack_boost', 5, 'cooldown', 5)
  ),
  c.difficulty
FROM public.chapters c;

-- =============================================
-- BOSS CHALLENGES (3 per boss)
-- =============================================

DO $$
DECLARE
  b RECORD;
  i INTEGER;
  difficulties difficulty_level[] := ARRAY['easy'::difficulty_level, 'medium'::difficulty_level, 'hard'::difficulty_level];
  damages INTEGER[] := ARRAY[15, 25, 40];
BEGIN
  FOR b IN SELECT id, difficulty FROM public.bosses LOOP
    FOR i IN 1..3 LOOP
      INSERT INTO public.boss_challenges (boss_id, question, options, correct_answer, explanation, concept, difficulty, damage, "order")
      VALUES (
        b.id,
        'Boss challenge question ' || i || '. Solve this to damage the boss!',
        jsonb_build_array(
          'Strategy option A',
          'Strategy option B',
          'Strategy option C',
          'Strategy option D'
        ),
        'strategy_' || i,
        'Explanation of why this is the correct approach against this boss.',
        'boss_battle_concept_' || i,
        difficulties[i],
        damages[i],
        i
      );
    END LOOP;
  END LOOP;
END;
$$;

-- =============================================
-- ITEMS (6 items of different rarities/categories)
-- =============================================

INSERT INTO public.items (name, description, rarity, category, image_url, effects) VALUES
  ('Knowledge Tome', 'A beginner''s book filled with fundamental knowledge. Increases XP gain by 10%.',
   'common'::item_rarity, 'book'::item_category, '/items/tome.png',
   jsonb_build_object('xp_multiplier', 1.1, 'type', 'passive')),
  ('Focus Crystal', 'A shimmering crystal that enhances concentration. Improves accuracy by 5%.',
   'uncommon'::item_rarity, 'crystal'::item_category, '/items/crystal.png',
   jsonb_build_object('accuracy_boost', 5, 'type', 'passive')),
  ('Scroll of Wisdom', 'Ancient scrolls containing secret knowledge. Doubles quest XP rewards.',
   'rare'::item_rarity, 'scroll'::item_category, '/items/scroll.png',
   jsonb_build_object('quest_xp_multiplier', 2.0, 'type', 'passive')),
  ('Phoenix Feather', 'A legendary feather from a phoenix. Revives and restores full streak on failure.',
   'epic'::item_rarity, 'artifact'::item_category, '/items/feather.png',
   jsonb_build_object('streak_save', true, 'type', 'consumable')),
  ('Gem of Insight', 'A radiant gem that reveals hidden knowledge. Unlocks bonus challenges.',
   'legendary'::item_rarity, 'gem'::item_category, '/items/gem.png',
   jsonb_build_object('bonus_challenges', true, 'type', 'passive')),
  ('Sword of Truth', 'A mighty weapon forged from pure knowledge. Doubles boss battle damage.',
   'legendary'::item_rarity, 'weapon'::item_category, '/items/sword.png',
   jsonb_build_object('boss_damage_multiplier', 2.0, 'type', 'equipment'))
ON CONFLICT DO NOTHING;

-- =============================================
-- ACHIEVEMENTS (8 achievements)
-- =============================================

INSERT INTO public.achievements (name, description, icon, xp_reward, coin_reward, criteria) VALUES
  ('First Quest', 'Complete your very first quest in QuestLearn AI!',
   '🎯', 100, 50,
   jsonb_build_object('type', 'quests_completed', 'target', 1, 'description', 'Complete 1 quest')),
  ('Level Up', 'Reach level 5 and prove your dedication to learning.',
   '⭐', 250, 100,
   jsonb_build_object('type', 'player_level', 'target', 5, 'description', 'Reach level 5')),
  ('Streak Master', 'Maintain a 7-day learning streak. Consistency is key!',
   '🔥', 500, 200,
   jsonb_build_object('type', 'streak_days', 'target', 7, 'description', 'Achieve a 7-day streak')),
  ('Boss Slayer', 'Defeat your first boss and conquer a chapter.',
   '⚔️', 300, 150,
   jsonb_build_object('type', 'bosses_defeated', 'target', 1, 'description', 'Defeat 1 boss')),
  ('Knowledge Seeker', 'Complete 25 levels across any subjects.',
   '📚', 750, 300,
   jsonb_build_object('type', 'levels_completed', 'target', 25, 'description', 'Complete 25 levels')),
  ('Perfect Score', 'Achieve 100% accuracy on any challenge.',
   '💯', 200, 100,
   jsonb_build_object('type', 'perfect_score', 'target', 1, 'description', 'Get 100% on any challenge')),
  ('Explorer', 'Study topics across 3 different subjects.',
   '🌍', 400, 175,
   jsonb_build_object('type', 'subjects_studied', 'target', 3, 'description', 'Study 3 different subjects')),
  ('Scholar', 'Master 10 concepts to become a true scholar.',
   '🎓', 1000, 500,
   jsonb_build_object('type', 'concepts_mastered', 'target', 10, 'description', 'Master 10 concepts'))
ON CONFLICT DO NOTHING;

-- =============================================
-- CLASSROOMS (2 examples)
-- =============================================

INSERT INTO public.classrooms (teacher_id, name, description, subject_id, board, class, invite_code)
SELECT
  '00000000-0000-0000-0000-000000000002',
  'Class 10 Alpha', 'Advanced CBSE Class 10 batch focusing on Mathematics and Science.',
  s.id, 'CBSE'::board_type, '10', 'ALPHA2025'
FROM public.subjects s WHERE s.name = 'mathematics' AND s.board = 'CBSE'
ON CONFLICT (invite_code) DO NOTHING;

INSERT INTO public.classrooms (teacher_id, name, description, board, class, invite_code) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Class 10 Beta', 'General CBSE Class 10 batch covering all subjects.',
   'CBSE'::board_type, '10', 'BETA2025')
ON CONFLICT (invite_code) DO NOTHING;

-- Enroll the demo student in both classrooms
INSERT INTO public.classroom_students (classroom_id, student_id)
SELECT c.id, '00000000-0000-0000-0000-000000000003'
FROM public.classrooms c
WHERE c.invite_code IN ('ALPHA2025', 'BETA2025')
ON CONFLICT (classroom_id, student_id) DO NOTHING;

-- =============================================
-- CONCEPTS (Knowledge Map nodes per chapter)
-- =============================================

DO $$
DECLARE
  ch RECORD;
  concept_num INTEGER;
  concept_names TEXT[] := ARRAY[
    'Core Foundations', 'Key Principles', 'Advanced Applications',
    'Problem Solving', 'Expert Techniques'
  ];
BEGIN
  FOR ch IN SELECT id FROM public.chapters LOOP
    FOR concept_num IN 1..5 LOOP
      INSERT INTO public.concepts (chapter_id, name, description, "order", parent_id, x_position, y_position)
      VALUES (
        ch.id,
        concept_names[concept_num],
        'Core concept ' || concept_num || ' for this chapter. Covers fundamental understanding and application.',
        concept_num,
        NULL,
        (concept_num - 1) * 200,
        100
      );
    END LOOP;
  END LOOP;
END;
$$;

-- =============================================
-- SUBSCRIPTIONS (for seeded users)
-- =============================================

INSERT INTO public.subscriptions (user_id, tier, status, current_period_start, current_period_end) VALUES
  ('00000000-0000-0000-0000-000000000001', 'premium'::subscription_tier, 'active'::subscription_status, now(), now() + INTERVAL '1 year'),
  ('00000000-0000-0000-0000-000000000002', 'teacher'::subscription_tier, 'active'::subscription_status, now(), now() + INTERVAL '1 year'),
  ('00000000-0000-0000-0000-000000000003', 'free'::subscription_tier, 'active'::subscription_status, now(), now() + INTERVAL '1 month')
ON CONFLICT DO NOTHING;

-- =============================================
-- DEMO USER PROGRESS (student has completed some levels)
-- =============================================

INSERT INTO public.user_progress (user_id, level_id, completed, score, xp_earned, coins_earned, accuracy, time_spent, attempts, started_at, completed_at)
SELECT
  '00000000-0000-0000-0000-000000000003',
  l.id, true, 85, l.xp_reward, l.xp_reward / 2, 85.00, 15, 1,
  now() - INTERVAL '7 days',
  now() - INTERVAL '6 days'
FROM public.levels l
JOIN public.chapters c ON c.id = l.chapter_id
JOIN public.subjects s ON s.id = c.subject_id
WHERE s.name = 'mathematics' AND s.board = 'CBSE' AND c."order" = 1 AND l."order" <= 3
ON CONFLICT (user_id, level_id) DO NOTHING;

-- =============================================
-- ANALYTICS (seed daily analytics for demo student)
-- =============================================

INSERT INTO public.analytics (user_id, date, total_xp, lessons_completed, challenges_solved, accuracy, time_spent_minutes, streak_day, topics_studied, weak_areas, strong_areas)
SELECT
  '00000000-0000-0000-0000-000000000003',
  CURRENT_DATE - INTERVAL '1 day',
  225, 3, 9, 85.00, 45, 3,
  '["Algebraic Foundations"]'::jsonb,
  '[]'::jsonb,
  '["Linear Equations", "Polynomials"]'::jsonb
ON CONFLICT (user_id, date) DO NOTHING;

INSERT INTO public.analytics (user_id, date, total_xp, lessons_completed, challenges_solved, accuracy, time_spent_minutes, streak_day, topics_studied, weak_areas, strong_areas)
SELECT
  '00000000-0000-0000-0000-000000000003',
  CURRENT_DATE,
  75, 1, 3, 90.00, 20, 3,
  '["Algebraic Foundations"]'::jsonb,
  '["Quadratic Equations"]'::jsonb,
  '["Linear Equations"]'::jsonb
ON CONFLICT (user_id, date) DO NOTHING;

-- =============================================
-- VERIFICATION LOG
-- =============================================

DO $$
DECLARE
  v_subjects INTEGER;
  v_chapters INTEGER;
  v_levels INTEGER;
  v_challenges INTEGER;
  v_bosses INTEGER;
  v_boss_challenges INTEGER;
  v_items INTEGER;
  v_achievements INTEGER;
  v_concepts INTEGER;
  v_classrooms INTEGER;
  v_users INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_subjects FROM public.subjects;
  SELECT COUNT(*) INTO v_chapters FROM public.chapters;
  SELECT COUNT(*) INTO v_levels FROM public.levels;
  SELECT COUNT(*) INTO v_challenges FROM public.challenges;
  SELECT COUNT(*) INTO v_bosses FROM public.bosses;
  SELECT COUNT(*) INTO v_boss_challenges FROM public.boss_challenges;
  SELECT COUNT(*) INTO v_items FROM public.items;
  SELECT COUNT(*) INTO v_achievements FROM public.achievements;
  SELECT COUNT(*) INTO v_concepts FROM public.concepts;
  SELECT COUNT(*) INTO v_classrooms FROM public.classrooms;
  SELECT COUNT(*) INTO v_users FROM auth.users WHERE email LIKE '%@questlearn.ai';

  RAISE NOTICE '=== QuestLearn AI Seed Verification ===';
  RAISE NOTICE 'Subjects: %', v_subjects;
  RAISE NOTICE 'Chapters: %', v_chapters;
  RAISE NOTICE 'Levels: %', v_levels;
  RAISE NOTICE 'Challenges: %', v_challenges;
  RAISE NOTICE 'Bosses: %', v_bosses;
  RAISE NOTICE 'Boss Challenges: %', v_boss_challenges;
  RAISE NOTICE 'Items: %', v_items;
  RAISE NOTICE 'Achievements: %', v_achievements;
  RAISE NOTICE 'Concepts: %', v_concepts;
  RAISE NOTICE 'Classrooms: %', v_classrooms;
  RAISE NOTICE 'Seed Users: %', v_users;
  RAISE NOTICE '========================================';
END;
$$;

-- =============================================
-- END OF SEED
-- =============================================
