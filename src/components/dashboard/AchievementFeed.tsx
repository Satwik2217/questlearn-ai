"use client";

import { motion } from "framer-motion";
import { Star, Sparkles, Trophy, Award, Medal, Flame } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { UserAchievement } from "@/types";

const achievementIcons: Record<string, React.ReactNode> = {
  trophy: <Trophy className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
  award: <Award className="h-5 w-5" />,
  medal: <Medal className="h-5 w-5" />,
  flame: <Flame className="h-5 w-5" />,
  sparkles: <Sparkles className="h-5 w-5" />,
  default: <Award className="h-5 w-5" />,
};

interface AchievementFeedProps {
  achievements: UserAchievement[];
}

export function AchievementFeed({ achievements }: AchievementFeedProps) {
  if (achievements.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="game-text text-lg font-bold text-foreground">
          Recent Achievements
        </h2>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-8 text-center">
          <Trophy className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No achievements yet. Start learning!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="game-text text-lg font-bold text-foreground">
          Recent Achievements
        </h2>
        <span className="text-xs text-muted-foreground">
          {achievements.length} total
        </span>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background to-transparent" />

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {achievements.map((ua, index) => {
            const achievement = ua.achievement;
            if (!achievement) return null;

            const icon =
              achievementIcons[achievement.icon] || achievementIcons.default;

            return (
              <motion.div
                key={ua.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex w-48 shrink-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-accent/30 hover:shadow-md hover:shadow-accent/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/20">
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {achievement.name}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {new Date(ua.unlocked_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {achievement.description}
                </p>

                <div className="flex items-center gap-3 text-[10px]">
                  {achievement.xp_reward > 0 && (
                    <span className="flex items-center gap-1 text-accent">
                      <Sparkles className="h-3 w-3" />
                      +{achievement.xp_reward} XP
                    </span>
                  )}
                  {achievement.coin_reward > 0 && (
                    <span className="flex items-center gap-1 text-accent">
                      <Star className="h-3 w-3" />
                      +{achievement.coin_reward}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
