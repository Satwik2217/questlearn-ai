"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressGame } from "@/components/ui/progress";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { WorldMap } from "@/components/dashboard/WorldMap";
import { DailyQuests } from "@/components/dashboard/DailyQuests";
import { AchievementFeed } from "@/components/dashboard/AchievementFeed";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import type { Quest, UserAchievement } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const mockQuests: Quest[] = [
  {
    id: "q1",
    user_id: "1",
    title: "Complete 3 Math Lessons",
    description: "Finish three interactive math lessons to earn bonus XP.",
    type: "daily",
    status: "in_progress",
    xp_reward: 150,
    coin_reward: 50,
    item_reward: null,
    requirements: { lessons: 3 },
    progress: 2,
    target: 3,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date().toISOString(),
    completed_at: null,
  },
  {
    id: "q2",
    user_id: "1",
    title: "Score 90% on a Quiz",
    description: "Achieve 90% or higher accuracy on any chapter quiz.",
    type: "daily",
    status: "in_progress",
    xp_reward: 200,
    coin_reward: 75,
    item_reward: null,
    requirements: { accuracy: 90 },
    progress: 75,
    target: 90,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date().toISOString(),
    completed_at: null,
  },
  {
    id: "q3",
    user_id: "1",
    title: "Weekly Challenge: Algebra Master",
    description: "Complete all algebra chapters in Math World.",
    type: "weekly",
    status: "available",
    xp_reward: 500,
    coin_reward: 200,
    item_reward: null,
    requirements: { chapters: 5 },
    progress: 3,
    target: 5,
    expires_at: new Date(Date.now() + 604800000).toISOString(),
    created_at: new Date().toISOString(),
    completed_at: null,
  },
];

const mockAchievements: UserAchievement[] = [
  {
    id: "ua1",
    user_id: "1",
    achievement_id: "a1",
    unlocked_at: new Date(Date.now() - 86400000).toISOString(),
    achievement: {
      id: "a1",
      name: "First Steps",
      description: "Completed your first lesson on the platform.",
      icon: "trophy",
      xp_reward: 100,
      coin_reward: 25,
      criteria: {},
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "ua2",
    user_id: "1",
    achievement_id: "a2",
    unlocked_at: new Date(Date.now() - 172800000).toISOString(),
    achievement: {
      id: "a2",
      name: "Math Whiz",
      description: "Completed 10 math lessons with 80%+ accuracy.",
      icon: "star",
      xp_reward: 250,
      coin_reward: 50,
      criteria: {},
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "ua3",
    user_id: "1",
    achievement_id: "a3",
    unlocked_at: new Date(Date.now() - 259200000).toISOString(),
    achievement: {
      id: "a3",
      name: "Streak Master",
      description: "Maintained a 7-day learning streak.",
      icon: "flame",
      xp_reward: 300,
      coin_reward: 100,
      criteria: {},
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "ua4",
    user_id: "1",
    achievement_id: "a4",
    unlocked_at: new Date(Date.now() - 345600000).toISOString(),
    achievement: {
      id: "a4",
      name: "Quiz Champion",
      description: "Scored 100% on 5 different quizzes.",
      icon: "award",
      xp_reward: 400,
      coin_reward: 150,
      criteria: {},
      created_at: new Date().toISOString(),
    },
  },
];

export default function DashboardPage() {
  const { profile } = useUser();
  const router = useRouter();

  const displayName = profile?.display_name ?? "Adventurer";
  const level = profile?.level ?? 1;
  const totalXp = profile?.total_xp ?? 0;
  const xpToNextLevel = level * 500;
  const coins = profile?.coins ?? 0;
  const streakDays = profile?.streak_days ?? 0;
  const xpProgress = Math.min(100, (totalXp / xpToNextLevel) * 100);

  const handleClaimReward = async (_questId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-6xl space-y-8"
    >
      <motion.div variants={itemVariants}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="game-text text-2xl font-bold text-foreground">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your adventure awaits! Continue where you left off.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="relative h-9 w-9 p-0"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-white">
                3
              </span>
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="game-text text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Level Progress
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                Level {level}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {totalXp} / {xpToNextLevel} XP to next level
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                <span className="game-text text-sm font-bold text-accent">
                  {xpProgress}%
                </span>
              </div>
              <ProgressGame
                value={xpProgress}
                variant="primary"
                className="w-40 sm:w-56"
              />
              <Button
                size="sm"
                variant="game-secondary"
                className="mt-2 h-8 gap-1 text-xs"
                onClick={() => router.push("/worlds/math")}
              >
                Continue Learning
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <StatsOverview
          level={level}
          totalXp={totalXp}
          xpToNextLevel={xpToNextLevel}
          coins={coins}
          streakDays={streakDays}
          subjectsMastered={2}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DailyQuests quests={mockQuests} onClaimReward={handleClaimReward} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <AchievementFeed achievements={mockAchievements} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <WorldMap />
      </motion.div>
    </motion.div>
  );
}
