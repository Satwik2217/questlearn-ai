-- QuestLearn AI - Minimal Seed (only data that doesn't need auth users)

-- Clear existing data
TRUNCATE public.subjects, public.chapters, public.items, public.achievements CASCADE;

-- Subjects
INSERT INTO public.subjects (name, display_name, icon, color, world_name, world_description, board, class_range) VALUES
('mathematics', 'Mathematics', 'calculator', '#6366f1', 'Math World', 'A realm of numbers and equations.', 'CBSE', '9-10'),
('science', 'Science', 'flask', '#22c55e', 'Science World', 'Explore the wonders of science.', 'CBSE', '9-10'),
('english', 'English', 'book-open', '#f59e0b', 'English Kingdom', 'Journey through literature.', 'CBSE', '9-10'),
('history', 'History', 'landmark', '#ef4444', 'History Empire', 'Travel through time.', 'CBSE', '9-10'),
('geography', 'Geography', 'globe', '#06b6d4', 'Geography Realm', 'Discover the world.', 'CBSE', '9-10');

-- Chapters
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Algebraic Foundations', 'Master linear equations.', 1, 'beginner', 'The Equation Overlord', 'A fearsome entity.', 5, 500 FROM public.subjects WHERE name='mathematics';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Geometry & Trigonometry', 'Explore shapes.', 2, 'medium', 'The Angle Tyrant', 'A geometric monstrosity.', 5, 500 FROM public.subjects WHERE name='mathematics';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Statistics & Probability', 'Analyze data.', 3, 'hard', 'The Probability Phantom', 'An ethereal being.', 5, 500 FROM public.subjects WHERE name='mathematics';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Chemical Reactions', 'Transform substances.', 1, 'beginner', 'The Corrosion Colossus', 'A giant of rust.', 5, 500 FROM public.subjects WHERE name='science';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Light & Optics', 'Study light.', 2, 'medium', 'The Shadow Weaver', 'A light-bending creature.', 5, 500 FROM public.subjects WHERE name='science';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Electricity & Circuits', 'Master electrons.', 3, 'hard', 'The Voltage Vanguard', 'An electrified titan.', 5, 500 FROM public.subjects WHERE name='science';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Grammar & Composition', 'Build grammar.', 1, 'beginner', 'The Syntax Serpent', 'A snake of sentences.', 5, 500 FROM public.subjects WHERE name='english';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Poetry & Prose', 'Analyze literature.', 2, 'medium', 'The Rhyme Reaper', 'A dark poet.', 5, 500 FROM public.subjects WHERE name='english';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Drama & Communication', 'Study plays.', 3, 'medium', 'The Monologue Monarch', 'A theatrical tyrant.', 5, 500 FROM public.subjects WHERE name='english';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Ancient Civilizations', 'Explore empires.', 1, 'beginner', 'The Mummy Pharaoh', 'An ancient ruler.', 5, 500 FROM public.subjects WHERE name='history';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Medieval India', 'Study Mughals.', 2, 'medium', 'The Sultan of Shadows', 'A ghostly ruler.', 5, 500 FROM public.subjects WHERE name='history';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Modern World', 'Understand wars.', 3, 'hard', 'The War Machine', 'A clockwork behemoth.', 5, 500 FROM public.subjects WHERE name='history';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Physical Geography', 'Study landforms.', 1, 'beginner', 'The Terra Titan', 'An earth elemental.', 5, 500 FROM public.subjects WHERE name='geography';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Human Geography', 'Explore population.', 2, 'medium', 'The Urban Hydra', 'A city-monster.', 5, 500 FROM public.subjects WHERE name='geography';
INSERT INTO public.chapters (subject_id, title, description, "order", difficulty, boss_name, boss_description, total_levels, xp_reward) SELECT id, 'Maps & Cartography', 'Master maps.', 3, 'hard', 'The Cartographic Kraken', 'A map-distorting sea monster.', 5, 500 FROM public.subjects WHERE name='geography';

-- Items
INSERT INTO public.items (name, description, rarity, category, image_url, effects) VALUES
('Knowledge Tome', '+10% XP gain.', 'common', 'book', '/items/tome.png', '{"xp_multiplier":1.1,"type":"passive"}'::jsonb),
('Focus Crystal', '+5% accuracy.', 'uncommon', 'crystal', '/items/crystal.png', '{"accuracy_boost":5,"type":"passive"}'::jsonb),
('Scroll of Wisdom', '2x quest XP.', 'rare', 'scroll', '/items/scroll.png', '{"quest_xp_multiplier":2,"type":"passive"}'::jsonb),
('Phoenix Feather', 'Save streak.', 'epic', 'artifact', '/items/feather.png', '{"streak_save":true,"type":"consumable"}'::jsonb),
('Gem of Insight', 'Bonus challenges.', 'legendary', 'gem', '/items/gem.png', '{"bonus_challenges":true,"type":"passive"}'::jsonb),
('Sword of Truth', '2x boss damage.', 'legendary', 'weapon', '/items/sword.png', '{"boss_damage_multiplier":2,"type":"equipment"}'::jsonb);

-- Achievements
INSERT INTO public.achievements (name, description, icon, xp_reward, coin_reward, criteria) VALUES
('First Quest', 'Complete your first quest!', chr(127919), 100, 50, '{"type":"quests_completed","target":1}'::jsonb),
('Level Up', 'Reach level 5.', chr(11088), 250, 100, '{"type":"player_level","target":5}'::jsonb),
('Streak Master', '7-day streak.', chr(128293), 500, 200, '{"type":"streak_days","target":7}'::jsonb),
('Boss Slayer', 'Defeat first boss.', chr(9876), 300, 150, '{"type":"bosses_defeated","target":1}'::jsonb),
('Knowledge Seeker', 'Complete 25 levels.', chr(128218), 750, 300, '{"type":"levels_completed","target":25}'::jsonb),
('Perfect Score', '100% accuracy.', chr(128175), 200, 100, '{"type":"perfect_score","target":1}'::jsonb),
('Explorer', 'Study 3 subjects.', chr(127757), 400, 175, '{"type":"subjects_studied","target":3}'::jsonb),
('Scholar', 'Master 10 concepts.', chr(127891), 1000, 500, '{"type":"concepts_mastered","target":10}'::jsonb);

-- Verify
SELECT '? Seed complete!' as result, (SELECT count(*) FROM public.subjects) as subjects, (SELECT count(*) FROM public.chapters) as chapters, (SELECT count(*) FROM public.items) as items, (SELECT count(*) FROM public.achievements) as achievements;
