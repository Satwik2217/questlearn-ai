-- Clear existing data first
TRUNCATE public.subjects, public.chapters, public.levels, public.challenges, public.bosses, public.boss_challenges, public.items, public.achievements, public.classrooms, public.classroom_students, public.concepts, public.subscriptions, public.user_progress, public.analytics, public.inventory_items, public.user_achievements, public.concept_mastery, public.notifications CASCADE;

-- Update profiles for demo users
UPDATE public.profiles SET display_name = 'QuestMaster', role = 'admin', character_type = 'wizard', total_xp = 50000, level = 50, coins = 10000, streak_days = 30 WHERE user_id = '00000000-0000-0000-0000-000000000001';
UPDATE public.profiles SET display_name = 'ProfessorAlex', role = 'teacher', character_type = 'scientist', total_xp = 25000, level = 30, coins = 5000, streak_days = 15 WHERE user_id = '00000000-0000-0000-0000-000000000002';
UPDATE public.profiles SET display_name = 'CodeNinja', role = 'student', character_type = 'ninja', board = 'CBSE', class = '10', age = 15, total_xp = 1500, level = 5, coins = 250, streak_days = 3 WHERE user_id = '00000000-0000-0000-0000-000000000003';

-- Subjects
INSERT INTO public.subjects (name, display_name, icon, color, world_name, world_description, board, class_range) VALUES
  ('mathematics', 'Mathematics', 'calculator', '#6366f1', 'Math World', 'A realm of numbers, equations, and logical puzzles.', 'CBSE', '9-10'),
  ('science', 'Science', 'flask', '#22c55e', 'Science World', 'Explore the wonders of physics, chemistry, and biology.', 'CBSE', '9-10'),
  ('english', 'English', 'book-open', '#f59e0b', 'English Kingdom', 'Journey through literature and language.', 'CBSE', '9-10'),
  ('history', 'History', 'landmark', '#ef4444', 'History Empire', 'Travel through time to ancient civilizations.', 'CBSE', '9-10'),
  ('geography', 'Geography', 'globe', '#06b6d4', 'Geography Realm', 'Discover continents, climates, and cultures.', 'CBSE', '9-10');

-- Chapters
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Algebraic Foundations', 'Master linear equations, quadratic equations, and polynomials.', 1, 'beginner', 'The Equation Overlord', 'A fearsome entity that bends mathematical reality.', 5, 500 FROM public.subjects s WHERE s.name = 'mathematics' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Geometry & Trigonometry', 'Explore shapes, angles, and trigonometric ratios.', 2, 'medium', 'The Angle Tyrant', 'A geometric monstrosity that twists space itself.', 5, 500 FROM public.subjects s WHERE s.name = 'mathematics' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Statistics & Probability', 'Learn to analyze data and predict outcomes.', 3, 'hard', 'The Probability Phantom', 'An ethereal being that manipulates chance.', 5, 500 FROM public.subjects s WHERE s.name = 'mathematics' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Chemical Reactions & Equations', 'Understand how substances transform.', 1, 'beginner', 'The Corrosion Colossus', 'A giant of rust and decay.', 5, 500 FROM public.subjects s WHERE s.name = 'science' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Light & Optics', 'Study the behavior of light, reflection, and refraction.', 2, 'medium', 'The Shadow Weaver', 'A creature that bends light to create illusions.', 5, 500 FROM public.subjects s WHERE s.name = 'science' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Electricity & Circuits', 'Master the flow of electrons.', 3, 'hard', 'The Voltage Vanguard', 'An electrified titan crackling with energy.', 5, 500 FROM public.subjects s WHERE s.name = 'science' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Grammar & Composition', 'Build a strong foundation in grammar rules.', 1, 'beginner', 'The Syntax Serpent', 'A massive snake made of tangled sentences.', 5, 500 FROM public.subjects s WHERE s.name = 'english' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Poetry & Prose', 'Analyze literary devices and explore language.', 2, 'medium', 'The Rhyme Reaper', 'A dark poet who traps victims in endless verses.', 5, 500 FROM public.subjects s WHERE s.name = 'english' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Drama & Communication', 'Study plays, dialogues, and communication.', 3, 'medium', 'The Monologue Monarch', 'A theatrical tyrant.', 5, 500 FROM public.subjects s WHERE s.name = 'english' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Ancient Civilizations', 'Explore the Indus Valley and ancient empires.', 1, 'beginner', 'The Mummy Pharaoh', 'An ancient ruler awakened from slumber.', 5, 500 FROM public.subjects s WHERE s.name = 'history' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Medieval India', 'Study the Delhi Sultanate and Mughal Empire.', 2, 'medium', 'The Sultan of Shadows', 'A ghostly ruler from the medieval era.', 5, 500 FROM public.subjects s WHERE s.name = 'history' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Modern World', 'Understand nationalism and world wars.', 3, 'hard', 'The War Machine', 'A clockwork behemoth fueled by conflict.', 5, 500 FROM public.subjects s WHERE s.name = 'history' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Physical Geography', 'Study landforms, climate, and natural processes.', 1, 'beginner', 'The Terra Titan', 'A massive earth elemental.', 5, 500 FROM public.subjects s WHERE s.name = 'geography' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Human Geography', 'Explore population and resources.', 2, 'medium', 'The Urban Hydra', 'A sprawling city-monster.', 5, 500 FROM public.subjects s WHERE s.name = 'geography' AND s.board = 'CBSE';

INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT s.id, 'Maps & Cartography', 'Master map reading and coordinates.', 3, 'hard', 'The Cartographic Kraken', 'An ancient sea monster that distorts maps.', 5, 500 FROM public.subjects s WHERE s.name = 'geography' AND s.board = 'CBSE';

-- Levels
DO $$ DECLARE ch RECORD; lvl RECORD; BEGIN
  FOR ch IN SELECT id, title FROM public.chapters LOOP
    FOR lvl IN SELECT * FROM jsonb_to_recordset('[{"order":1,"title_suffix":"Introduction","desc_suffix":"Learn the fundamental concepts.","type":"story","xp":50},{"order":2,"title_suffix":"Exploration","desc_suffix":"Practice with interactive exercises.","type":"interactive","xp":75},{"order":3,"title_suffix":"Practice","desc_suffix":"Test your skills with challenging problems.","type":"practice","xp":100},{"order":4,"title_suffix":"Mastery","desc_suffix":"Apply advanced techniques and strategies.","type":"quiz","xp":125},{"order":5,"title_suffix":"Final Challenge","desc_suffix":"Prepare for the boss battle!","type":"boss","xp":150}]'::jsonb AS ("order" INTEGER, "title_suffix" TEXT, "desc_suffix" TEXT, "type" TEXT, "xp" INTEGER)) LOOP
      INSERT INTO public.levels (chapter_id, title, description, "order", level_type, difficulty, xp_reward, content_json)
      VALUES (ch.id, ch.title || ': ' || lvl.title_suffix, lvl.desc_suffix, lvl."order", lvl.type::level_type,
        CASE WHEN lvl."order" <= 1 THEN 'beginner'::difficulty_level WHEN lvl."order" <= 2 THEN 'easy' WHEN lvl."order" <= 3 THEN 'medium' WHEN lvl."order" <= 4 THEN 'hard' ELSE 'expert' END,
        lvl.xp, jsonb_build_object('objectives', jsonb_build_array(jsonb_build_object('description', 'Complete all challenges', 'points', lvl.xp)), 'rewards', jsonb_build_object('xp', lvl.xp, 'coins', lvl.xp / 2)));
    END LOOP;
  END LOOP;
END $$;

-- Challenges
DO $$ DECLARE lvl RECORD; BEGIN
  FOR lvl IN SELECT id, xp_reward FROM public.levels LOOP
    INSERT INTO public.challenges (level_id, title, description, challenge_type, question, options, correct_answer, explanation, difficulty, points, "order") VALUES
      (lvl.id, 'Challenge 1', 'Test your understanding.', 'mcq', 'Sample question?', '["Option A","Option B","Option C","Option D"]'::jsonb, 'Option A', 'Explanation text.', 'beginner', lvl.xp_reward / 3, 1),
      (lvl.id, 'Challenge 2', 'Test your understanding.', 'mcq', 'Sample question?', '["Option A","Option B","Option C","Option D"]'::jsonb, 'Option B', 'Explanation text.', 'easy', lvl.xp_reward / 3, 2),
      (lvl.id, 'Challenge 3', 'Test your understanding.', 'fill_blanks', 'Fill in the blank: ___', NULL, 'answer', 'Explanation text.', 'medium', lvl.xp_reward / 3, 3);
  END LOOP;
END $$;

-- Bosses
INSERT INTO public.bosses (chapter_id, name, description, hp, max_hp, attack_power, defense_power, special_abilities, difficulty)
SELECT c.id, c.boss_name, c.boss_description,
  CASE c.difficulty WHEN 'beginner' THEN 50 WHEN 'easy' THEN 75 WHEN 'medium' THEN 100 WHEN 'hard' THEN 150 ELSE 200 END,
  CASE c.difficulty WHEN 'beginner' THEN 50 WHEN 'easy' THEN 75 WHEN 'medium' THEN 100 WHEN 'hard' THEN 150 ELSE 200 END,
  CASE c.difficulty WHEN 'beginner' THEN 5 WHEN 'easy' THEN 8 WHEN 'medium' THEN 12 WHEN 'hard' THEN 18 ELSE 25 END,
  CASE c.difficulty WHEN 'beginner' THEN 2 WHEN 'easy' THEN 4 WHEN 'medium' THEN 6 WHEN 'hard' THEN 10 ELSE 15 END,
  '[{"name":"Power Strike","damage_multiplier":1.5,"cooldown":2},{"name":"Shield Up","defense_boost":10,"cooldown":3},{"name":"Enrage","attack_boost":5,"cooldown":5}]'::jsonb,
  c.difficulty
FROM public.chapters c;

-- Boss Challenges
DO $$ DECLARE b RECORD; i INTEGER; BEGIN
  FOR b IN SELECT id FROM public.bosses LOOP
    FOR i IN 1..3 LOOP
      INSERT INTO public.boss_challenges (boss_id, question, options, correct_answer, explanation, concept, difficulty, damage, "order")
      VALUES (b.id, 'Boss challenge question ' || i, '["Strategy A","Strategy B","Strategy C","Strategy D"]'::jsonb, 'strategy_' || i, 'Explanation.', 'concept_' || i,
        CASE i WHEN 1 THEN 'easy' WHEN 2 THEN 'medium' ELSE 'hard' END::difficulty_level,
        CASE i WHEN 1 THEN 15 WHEN 2 THEN 25 ELSE 40 END, i);
    END LOOP;
  END LOOP;
END $$;

-- Items
INSERT INTO public.items (name, description, rarity, category, image_url, effects) VALUES
  ('Knowledge Tome', 'Increases XP gain by 10%.', 'common', 'book', '/items/tome.png', '{"xp_multiplier":1.1,"type":"passive"}'::jsonb),
  ('Focus Crystal', 'Improves accuracy by 5%.', 'uncommon', 'crystal', '/items/crystal.png', '{"accuracy_boost":5,"type":"passive"}'::jsonb),
  ('Scroll of Wisdom', 'Doubles quest XP rewards.', 'rare', 'scroll', '/items/scroll.png', '{"quest_xp_multiplier":2,"type":"passive"}'::jsonb),
  ('Phoenix Feather', 'Restores full streak on failure.', 'epic', 'artifact', '/items/feather.png', '{"streak_save":true,"type":"consumable"}'::jsonb),
  ('Gem of Insight', 'Unlocks bonus challenges.', 'legendary', 'gem', '/items/gem.png', '{"bonus_challenges":true,"type":"passive"}'::jsonb),
  ('Sword of Truth', 'Doubles boss battle damage.', 'legendary', 'weapon', '/items/sword.png', '{"boss_damage_multiplier":2,"type":"equipment"}'::jsonb);

-- Achievements
INSERT INTO public.achievements (name, description, icon, xp_reward, coin_reward, criteria) VALUES
  ('First Quest', 'Complete your first quest!', '🎯', 100, 50, '{"type":"quests_completed","target":1}'::jsonb),
  ('Level Up', 'Reach level 5.', '⭐', 250, 100, '{"type":"player_level","target":5}'::jsonb),
  ('Streak Master', '7-day learning streak.', '🔥', 500, 200, '{"type":"streak_days","target":7}'::jsonb),
  ('Boss Slayer', 'Defeat your first boss.', '⚔️', 300, 150, '{"type":"bosses_defeated","target":1}'::jsonb),
  ('Knowledge Seeker', 'Complete 25 levels.', '📚', 750, 300, '{"type":"levels_completed","target":25}'::jsonb),
  ('Perfect Score', '100% accuracy on any challenge.', '💯', 200, 100, '{"type":"perfect_score","target":1}'::jsonb),
  ('Explorer', 'Study 3 different subjects.', '🌍', 400, 175, '{"type":"subjects_studied","target":3}'::jsonb),
  ('Scholar', 'Master 10 concepts.', '🎓', 1000, 500, '{"type":"concepts_mastered","target":10}'::jsonb);

-- Classrooms
INSERT INTO public.classrooms (teacher_id, name, description, board, class, invite_code) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Class 10 Alpha', 'Advanced CBSE Class 10 batch.', 'CBSE', '10', 'ALPHA2025'),
  ('00000000-0000-0000-0000-000000000002', 'Class 10 Beta', 'General CBSE Class 10 batch.', 'CBSE', '10', 'BETA2025');

-- Classroom students
INSERT INTO public.classroom_students (classroom_id, student_id)
SELECT c.id, '00000000-0000-0000-0000-000000000003' FROM public.classrooms c;

-- Concepts
DO $$ DECLARE ch RECORD; BEGIN
  FOR ch IN SELECT id FROM public.chapters LOOP
    INSERT INTO public.concepts (chapter_id, name, description, "order", parent_id, x_position, y_position) VALUES
      (ch.id, 'Core Foundations', 'Core concept 1', 1, NULL, 0, 100),
      (ch.id, 'Key Principles', 'Core concept 2', 2, NULL, 200, 100),
      (ch.id, 'Advanced Applications', 'Core concept 3', 3, NULL, 400, 100),
      (ch.id, 'Problem Solving', 'Core concept 4', 4, NULL, 600, 100),
      (ch.id, 'Expert Techniques', 'Core concept 5', 5, NULL, 800, 100);
  END LOOP;
END $$;

-- Subscriptions
INSERT INTO public.subscriptions (user_id, tier, status, current_period_start, current_period_end) VALUES
  ('00000000-0000-0000-0000-000000000001', 'premium', 'active', now(), now() + INTERVAL '1 year'),
  ('00000000-0000-0000-0000-000000000002', 'teacher', 'active', now(), now() + INTERVAL '1 year'),
  ('00000000-0000-0000-0000-000000000003', 'free', 'active', now(), now() + INTERVAL '1 month');

-- Demo progress
INSERT INTO public.user_progress (user_id, level_id, completed, score, xp_earned, coins_earned, accuracy, time_spent, attempts, started_at, completed_at)
SELECT '00000000-0000-0000-0000-000000000003', l.id, true, 85, l.xp_reward, l.xp_reward / 2, 85.00, 15, 1, now() - INTERVAL '7 days', now() - INTERVAL '6 days'
FROM public.levels l JOIN public.chapters c ON c.id = l.chapter_id JOIN public.subjects s ON s.id = c.subject_id
WHERE s.name = 'mathematics' AND s.board = 'CBSE' AND c."order" = 1 AND l."order" <= 3;

-- Analytics
INSERT INTO public.analytics (user_id, date, total_xp, lessons_completed, challenges_solved, accuracy, time_spent_minutes, streak_day, topics_studied, weak_areas, strong_areas) VALUES
  ('00000000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '1 day', 225, 3, 9, 85.00, 45, 3, '["Algebraic Foundations"]'::jsonb, '[]'::jsonb, '["Linear Equations","Polynomials"]'::jsonb),
  ('00000000-0000-0000-0000-000000000003', CURRENT_DATE, 75, 1, 3, 90.00, 20, 3, '["Algebraic Foundations"]'::jsonb, '["Quadratic Equations"]'::jsonb, '["Linear Equations"]'::jsonb);

-- Verify
DO $$ DECLARE v_subjects INTEGER; v_chapters INTEGER; v_levels INTEGER; v_challenges INTEGER; v_bosses INTEGER; v_items INTEGER; v_achievements INTEGER; v_concepts INTEGER; v_classrooms INTEGER; BEGIN
  SELECT COUNT(*) INTO v_subjects FROM public.subjects;
  SELECT COUNT(*) INTO v_chapters FROM public.chapters;
  SELECT COUNT(*) INTO v_levels FROM public.levels;
  SELECT COUNT(*) INTO v_challenges FROM public.challenges;
  SELECT COUNT(*) INTO v_bosses FROM public.bosses;
  SELECT COUNT(*) INTO v_items FROM public.items;
  SELECT COUNT(*) INTO v_achievements FROM public.achievements;
  SELECT COUNT(*) INTO v_concepts FROM public.concepts;
  SELECT COUNT(*) INTO v_classrooms FROM public.classrooms;
  RAISE NOTICE '✅ Seed Complete! Subjects: %, Chapters: %, Levels: %, Challenges: %, Bosses: %, Items: %, Achievements: %, Concepts: %, Classrooms: %',
    v_subjects, v_chapters, v_levels, v_challenges, v_bosses, v_items, v_achievements, v_concepts, v_classrooms;
END $$;
