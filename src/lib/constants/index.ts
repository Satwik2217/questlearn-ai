import {
  type Board,
  type CharacterType,
  type Difficulty,
  type ItemRarity,
  type ItemCategory,
  type ChallengeType,
  type SubscriptionTier,
} from "@/types";

export const APP_NAME = "QuestLearn AI";
export const APP_TAGLINE = "Learn Through Adventure";

export const BOARDS: { value: Board; label: string }[] = [
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE" },
  { value: "StateBoard", label: "State Board" },
  { value: "IGCSE", label: "IGCSE" },
  { value: "GCSE", label: "GCSE" },
  { value: "USCurriculum", label: "US Curriculum" },
];

export const CHARACTER_TYPES: {
  value: CharacterType;
  label: string;
  description: string;
  color: string;
}[] = [
  { value: "knight", label: "Knight", description: "Brave and strong", color: "#ef4444" },
  { value: "wizard", label: "Wizard", description: "Wise and magical", color: "#8b5cf6" },
  { value: "ninja", label: "Ninja", description: "Fast and stealthy", color: "#1e293b" },
  { value: "archer", label: "Archer", description: "Precise and focused", color: "#22c55e" },
  { value: "scientist", label: "Scientist", description: "Curious and analytical", color: "#06b6d4" },
  { value: "explorer", label: "Explorer", description: "Adventurous and brave", color: "#f59e0b" },
];

export const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: "beginner", label: "Beginner", color: "#22c55e" },
  { value: "easy", label: "Easy", color: "#16a34a" },
  { value: "medium", label: "Medium", color: "#f59e0b" },
  { value: "hard", label: "Hard", color: "#ef4444" },
  { value: "expert", label: "Expert", color: "#dc2626" },
];

export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: "#9ca3af",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  epic: "#8b5cf6",
  legendary: "#f59e0b",
};

export const CATEGORY_ICONS: Record<ItemCategory, string> = {
  book: "book-open",
  gem: "diamond",
  scroll: "scroll",
  crystal: "sparkles",
  weapon: "sword",
  artifact: "trophy",
};

export const CHALLENGE_TYPES: Record<ChallengeType, { label: string; icon: string }> = {
  mcq: { label: "Multiple Choice", icon: "list-checks" },
  drag_drop: { label: "Drag & Drop", icon: "arrow-up-from-line" },
  fill_blanks: { label: "Fill in Blanks", icon: "text-cursor-input" },
  scenario: { label: "Scenario", icon: "map" },
  puzzle: { label: "Puzzle", icon: "puzzle" },
  matching: { label: "Matching", icon: "shuffle" },
  timed: { label: "Timed Challenge", icon: "timer" },
};

export const SUBSCRIPTION_TIERS: Record<
  SubscriptionTier,
  { label: string; price: number; features: string[] }
> = {
  free: {
    label: "Free",
    price: 0,
    features: ["3 subjects", "Basic lessons", "Daily quests", "Leaderboard access"],
  },
  premium: {
    label: "Premium",
    price: 9.99,
    features: [
      "All subjects",
      "AI-powered lessons",
      "Boss battles",
      "Advanced analytics",
      "Parent dashboard",
      "No ads",
    ],
  },
  school: {
    label: "School",
    price: 4.99,
    features: [
      "All Premium features",
      "Teacher dashboard",
      "Classroom management",
      "Bulk student accounts",
      "Admin panel",
      "Custom branding",
    ],
  },
  teacher: {
    label: "Teacher",
    price: 0,
    features: [
      "All Premium features",
      "Create classrooms",
      "Student analytics",
      "Assign quests",
      "Track progress",
    ],
  },
};

export const LEVEL_NAMES = [
  "Novice Learner",
  "Curious Mind",
  "Knowledge Seeker",
  "Bright Scholar",
  "Skillful Apprentice",
  "Wisdom Hunter",
  "Clever Thinker",
  "Brilliant Mind",
  "Master Student",
  "Sage of Knowledge",
  "Genius Learner",
  "Legendary Scholar",
];

export const WORLD_COLORS: Record<string, string> = {
  math: "#3b82f6",
  science: "#22c55e",
  english: "#8b5cf6",
  history: "#f59e0b",
  geography: "#06b6d4",
};

export const STORAGE_KEYS = {
  onboardingComplete: "ql_onboarding_complete",
  soundEnabled: "ql_sound_enabled",
  musicEnabled: "ql_music_enabled",
  lastDailyClaim: "ql_last_daily_claim",
};
