// ==========================================
// QuestLearn AI - Type Definitions
// ==========================================

// ---- Enums & Constants ----

export type UserRole = "student" | "parent" | "teacher" | "admin";
export type Board = "CBSE" | "ICSE" | "StateBoard" | "IGCSE" | "GCSE" | "USCurriculum";
export type CharacterType = "knight" | "wizard" | "ninja" | "archer" | "scientist" | "explorer";
export type Difficulty = "beginner" | "easy" | "medium" | "hard" | "expert";
export type QuestStatus = "locked" | "available" | "in_progress" | "completed";
export type LevelType = "story" | "interactive" | "practice" | "quiz" | "boss";
export type ChallengeType = "mcq" | "drag_drop" | "fill_blanks" | "scenario" | "puzzle" | "matching" | "timed";
export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ItemCategory = "book" | "gem" | "scroll" | "crystal" | "weapon" | "artifact";
export type SubscriptionTier = "free" | "premium" | "school" | "teacher";
export type BossStatus = "locked" | "available" | "defeated";

// ---- Profiles ----

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  character_type: CharacterType;
  age: number | null;
  class: string | null;
  board: Board | null;
  role: UserRole;
  total_xp: number;
  level: number;
  coins: number;
  streak_days: number;
  last_active: string;
  created_at: string;
  updated_at: string;
}

// ---- Subjects & Curriculum ----

export interface Subject {
  id: string;
  name: string;
  display_name: string;
  icon: string;
  color: string;
  world_name: string;
  world_description: string;
  board: Board;
  class_range: string;
  created_at: string;
}

export interface Chapter {
  id: string;
  subject_id: string;
  title: string;
  description: string;
  order: number;
  difficulty: Difficulty;
  boss_name: string;
  boss_description: string;
  boss_image_url: string | null;
  total_levels: number;
  xp_reward: number;
  created_at: string;
}

export interface Level {
  id: string;
  chapter_id: string;
  title: string;
  description: string;
  order: number;
  level_type: LevelType;
  difficulty: Difficulty;
  xp_reward: number;
  story_intro: string | null;
  content_json: Record<string, unknown>;
  created_at: string;
}

// ---- Quests & Challenges ----

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly" | "bonus" | "story";
  status: QuestStatus;
  xp_reward: number;
  coin_reward: number;
  item_reward: string | null;
  requirements: Record<string, unknown>;
  progress: number;
  target: number;
  expires_at: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Challenge {
  id: string;
  level_id: string;
  title: string;
  description: string;
  challenge_type: ChallengeType;
  question: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string;
  difficulty: Difficulty;
  points: number;
  time_limit: number | null;
  order: number;
  created_at: string;
}

// ---- Boss Battles ----

export interface Boss {
  id: string;
  chapter_id: string;
  name: string;
  description: string;
  image_url: string | null;
  hp: number;
  max_hp: number;
  attack_power: number;
  defense_power: number;
  special_abilities: Record<string, unknown>;
  difficulty: Difficulty;
  created_at: string;
}

export interface BossChallenge {
  id: string;
  boss_id: string;
  question: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string;
  concept: string;
  difficulty: Difficulty;
  damage: number;
  order: number;
  created_at: string;
}

export interface BattleState {
  bossId: string;
  bossHp: number;
  bossMaxHp: number;
  playerHp: number;
  playerMaxHp: number;
  playerAttack: number;
  playerDefense: number;
  phase: "intro" | "question" | "player_turn" | "boss_turn" | "victory" | "defeat";
  currentQuestionIndex: number;
  totalQuestions: number;
  correctAnswers: number;
  totalDamage: number;
  specialCharge: number;
}

// ---- Rewards & Inventory ----

export interface Item {
  id: string;
  name: string;
  description: string;
  rarity: ItemRarity;
  category: ItemCategory;
  image_url: string | null;
  effects: Record<string, unknown> | null;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  equipped: boolean;
  acquired_at: string;
  item?: Item;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  coin_reward: number;
  criteria: Record<string, unknown>;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

// ---- Knowledge Map ----

export interface ConceptNode {
  id: string;
  chapter_id: string;
  name: string;
  description: string;
  order: number;
  parent_id: string | null;
  x_position: number;
  y_position: number;
  created_at: string;
}

export interface ConceptMastery {
  id: string;
  user_id: string;
  concept_id: string;
  mastery_level: number;
  attempts: number;
  correct_attempts: number;
  last_practiced: string | null;
  status: "locked" | "unlocked" | "in_progress" | "mastered";
}

// ---- Progress & Analytics ----

export interface UserProgress {
  id: string;
  user_id: string;
  level_id: string;
  completed: boolean;
  score: number | null;
  xp_earned: number;
  coins_earned: number;
  accuracy: number | null;
  time_spent: number | null;
  attempts: number;
  started_at: string;
  completed_at: string | null;
}

export interface Analytics {
  id: string;
  user_id: string;
  date: string;
  total_xp: number;
  lessons_completed: number;
  challenges_solved: number;
  accuracy: number;
  time_spent_minutes: number;
  streak_day: number;
  topics_studied: string[];
  weak_areas: string[];
  strong_areas: string[];
}

// ---- Social & Classrooms ----

export interface Classroom {
  id: string;
  teacher_id: string;
  name: string;
  description: string;
  subject_id: string | null;
  board: Board | null;
  class: string | null;
  invite_code: string;
  created_at: string;
}

export interface ClassroomStudent {
  id: string;
  classroom_id: string;
  student_id: string;
  joined_at: string;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: "pending" | "accepted" | "blocked";
  created_at: string;
  friend?: Profile;
}

// ---- AI Generation ----

export interface AIGeneration {
  id: string;
  user_id: string;
  prompt: string;
  content: Record<string, unknown>;
  model: string;
  tokens_used: number;
  type: string;
  created_at: string;
}

// ---- Subscriptions ----

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: "active" | "cancelled" | "expired";
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

// ---- Notifications ----

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "achievement" | "reward" | "quest" | "social" | "system";
  read: boolean;
  data: Record<string, unknown> | null;
  created_at: string;
}

// ---- API Types ----

export interface AIGenerateRequest {
  subject: string;
  chapter: string;
  board: Board;
  class: string;
  difficulty: Difficulty;
  studentLevel?: number;
  contentType: "lesson" | "quest" | "story" | "challenge" | "quiz" | "boss" | "flashcard" | "summary";
}

export interface AIGenerateResponse {
  success: boolean;
  content: Record<string, unknown>;
  error?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
