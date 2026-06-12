-- QuestLearn AI - Simple Seed (No DO blocks, No ON CONFLICT)

-- Clear existing data
TRUNCATE public.subjects, public.chapters, public.levels, public.challenges, public.bosses, public.boss_challenges, public.items, public.achievements, public.classrooms, public.classroom_students, public.concepts, public.subscriptions, public.user_progress, public.analytics, public.inventory_items, public.user_achievements, public.concept_mastery, public.notifications CASCADE;

-- Update demo user profiles
UPDATE public.profiles SET display_name='QuestMaster', role='admin', character_type='wizard', total_xp=50000, level=50, coins=10000, streak_days=30 WHERE user_id='00000000-0000-0000-0000-000000000001';
UPDATE public.profiles SET display_name='ProfessorAlex', role='teacher', character_type='scientist', total_xp=25000, level=30, coins=5000, streak_days=15 WHERE user_id='00000000-0000-0000-0000-000000000002';
UPDATE public.profiles SET display_name='CodeNinja', role='student', character_type='ninja', board='CBSE', class='10', age=15, total_xp=1500, level=5, coins=250, streak_days=3 WHERE user_id='00000000-0000-0000-0000-000000000003';

-- Subjects
INSERT INTO public.subjects (name, display_name, icon, color, world_name, world_description, board, class_range) VALUES
('mathematics', 'Mathematics', 'calculator', '#6366f1', 'Math World', 'A realm of numbers and equations.', 'CBSE', '9-10'),
('science', 'Science', 'flask', '#22c55e', 'Science World', 'Explore the wonders of science.', 'CBSE', '9-10'),
('english', 'English', 'book-open', '#f59e0b', 'English Kingdom', 'Journey through literature.', 'CBSE', '9-10'),
('history', 'History', 'landmark', '#ef4444', 'History Empire', 'Travel through time.', 'CBSE', '9-10'),
('geography', 'Geography', 'globe', '#06b6d4', 'Geography Realm', 'Discover the world.', 'CBSE', '9-10');

-- Chapters (15 total)
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Algebraic Foundations', 'Master linear equations and polynomials.', 1, 'beginner', 'The Equation Overlord', 'A fearsome entity that bends mathematical reality.', 5, 500 FROM public.subjects WHERE name='mathematics';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Geometry & Trigonometry', 'Explore shapes and angles.', 2, 'medium', 'The Angle Tyrant', 'A geometric monstrosity.', 5, 500 FROM public.subjects WHERE name='mathematics';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Statistics & Probability', 'Learn to analyze data.', 3, 'hard', 'The Probability Phantom', 'An ethereal being that manipulates chance.', 5, 500 FROM public.subjects WHERE name='mathematics';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Chemical Reactions', 'Understand how substances transform.', 1, 'beginner', 'The Corrosion Colossus', 'A giant of rust and decay.', 5, 500 FROM public.subjects WHERE name='science';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Light & Optics', 'Study the behavior of light.', 2, 'medium', 'The Shadow Weaver', 'A creature that bends light.', 5, 500 FROM public.subjects WHERE name='science';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Electricity & Circuits', 'Master the flow of electrons.', 3, 'hard', 'The Voltage Vanguard', 'An electrified titan.', 5, 500 FROM public.subjects WHERE name='science';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Grammar & Composition', 'Build grammar foundations.', 1, 'beginner', 'The Syntax Serpent', 'A snake of tangled sentences.', 5, 500 FROM public.subjects WHERE name='english';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Poetry & Prose', 'Analyze literary devices.', 2, 'medium', 'The Rhyme Reaper', 'A dark poet.', 5, 500 FROM public.subjects WHERE name='english';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Drama & Communication', 'Study plays and dialogues.', 3, 'medium', 'The Monologue Monarch', 'A theatrical tyrant.', 5, 500 FROM public.subjects WHERE name='english';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Ancient Civilizations', 'Explore ancient empires.', 1, 'beginner', 'The Mummy Pharaoh', 'An ancient ruler awakened.', 5, 500 FROM public.subjects WHERE name='history';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Medieval India', 'Study Mughal Empire.', 2, 'medium', 'The Sultan of Shadows', 'A ghostly ruler.', 5, 500 FROM public.subjects WHERE name='history';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Modern World', 'Understand world wars.', 3, 'hard', 'The War Machine', 'A clockwork behemoth.', 5, 500 FROM public.subjects WHERE name='history';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Physical Geography', 'Study landforms and climate.', 1, 'beginner', 'The Terra Titan', 'A massive earth elemental.', 5, 500 FROM public.subjects WHERE name='geography';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Human Geography', 'Explore population.', 2, 'medium', 'The Urban Hydra', 'A sprawling city-monster.', 5, 500 FROM public.subjects WHERE name='geography';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward)
SELECT id, 'Maps & Cartography', 'Master map reading.', 3, 'hard', 'The Cartographic Kraken', 'A map-distorting sea monster.', 5, 500 FROM public.subjects WHERE name='geography';

-- Items
INSERT INTO public.items (name, description, rarity, category, image_url, effects) VALUES
('Knowledge Tome', '+10% XP gain.', 'common', 'book', '/items/tome.png', '{"xp_multiplier":1.1,"type":"passive"}'::jsonb),
('Focus Crystal', '+5% accuracy.', 'uncommon', 'crystal', '/items/crystal.png', '{"accuracy_boost":5,"type":"passive"}'::jsonb),
('Scroll of Wisdom', '2x quest XP.', 'rare', 'scroll', '/items/scroll.png', '{"quest_xp_multiplier":2,"type":"passive"}'::jsonb),
('Phoenix Feather', 'Save streak on failure.', 'epic', 'artifact', '/items/feather.png', '{"streak_save":true,"type":"consumable"}'::jsonb),
('Gem of Insight', 'Unlock bonus challenges.', 'legendary', 'gem', '/items/gem.png', '{"bonus_challenges":true,"type":"passive"}'::jsonb),
('Sword of Truth', '2x boss damage.', 'legendary', 'weapon', '/items/sword.png', '{"boss_damage_multiplier":2,"type":"equipment"}'::jsonb);

-- Achievements
INSERT INTO public.achievements (name, description, icon, xp_reward, coin_reward, criteria) VALUES
('First Quest', 'Complete your first quest!', '🎯', 100, 50, '{"type":"quests_completed","target":1}'::jsonb),
('Level Up', 'Reach level 5.', '⭐', 250, 100, '{"type":"player_level","target":5}'::jsonb),
('Streak Master', '7-day streak.', '🔥', 500, 200, '{"type":"streak_days","target":7}'::jsonb),
('Boss Slayer', 'Defeat first boss.', '⚔️', 300, 150, '{"type":"bosses_defeated","target":1}'::jsonb),
('Knowledge Seeker', 'Complete 25 levels.', '📚', 750, 300, '{"type":"levels_completed","target":25}'::jsonb),
('Perfect Score', '100% accuracy.', '💯', 200, 100, '{"type":"perfect_score","target":1}'::jsonb),
('Explorer', 'Study 3 subjects.', '🌍', 400, 175, '{"type":"subjects_studied","target":3}'::jsonb),
('Scholar', 'Master 10 concepts.', '🎓', 1000, 500, '{"type":"concepts_mastered","target":10}'::jsonb);

-- Classrooms
INSERT INTO public.classrooms (teacher_id, name, description, board, class, invite_code) VALUES
('00000000-0000-0000-0000-000000000002', 'Class 10 Alpha', 'Advanced CBSE Class 10.', 'CBSE', '10', 'ALPHA2025'),
('00000000-0000-0000-0000-000000000002', 'Class 10 Beta', 'General CBSE Class 10.', 'CBSE', '10', 'BETA2025');

INSERT INTO public.classroom_students (classroom_id, student_id)
SELECT c.id, '00000000-0000-0000-0000-000000000003' FROM public.classrooms c;

-- Subscriptions
INSERT INTO public.subscriptions (user_id, tier, status, current_period_start, current_period_end) VALUES
('00000000-0000-0000-0000-000000000001', 'premium', 'active', now(), now() + INTERVAL '1 year'),
('00000000-0000-0000-0000-000000000002', 'teacher', 'active', now(), now() + INTERVAL '1 year'),
('00000000-0000-0000-0000-000000000003', 'free', 'active', now(), now() + INTERVAL '1 month');

-- Verify
SELECT '✅ Seed complete!' as result;
