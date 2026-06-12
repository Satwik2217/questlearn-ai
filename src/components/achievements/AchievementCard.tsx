"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Lock,
  Star,
  Coins,
  CheckCircle2,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatXp } from "@/lib/utils/helpers";
import type { ItemRarity } from "@/types";

interface AchievementDisplay {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  coin_reward: number;
  criteria: Record<string, unknown>;
  unlocked?: boolean;
  unlocked_at?: string | null;
  progress?: number;
  target?: number;
}

const rarityBorders: Record<string, string> = {
  beginner: "border-gray-500",
  easy: "border-green-500",
  medium: "border-blue-500",
  hard: "border-purple-500",
  expert: "border-amber-400",
};

const rarityGlows: Record<string, string> = {
  beginner: "shadow-[0_0_8px_-2px] shadow-gray-500/30",
  easy: "shadow-[0_0_8px_-2px] shadow-green-500/30",
  medium: "shadow-[0_0_8px_-2px] shadow-blue-500/30",
  hard: "shadow-[0_0_8px_-2px] shadow-purple-500/30",
  expert: "shadow-[0_0_12px_-2px] shadow-amber-400/40",
};

interface AchievementCardProps {
  achievement: AchievementDisplay;
  index?: number;
}

export function AchievementCard({ achievement, index = 0 }: AchievementCardProps) {
  const isUnlocked = achievement.unlocked;
  const difficulty = (achievement.criteria?.difficulty as string) || "beginner";
const border = rarityBorders[difficulty] || rarityBorders.beginner;
const glow = rarityGlows[difficulty] || rarityGlows.beginner;
  const hasProgress =
    typeof achievement.progress === "number" &&
    typeof achievement.target === "number" &&
    achievement.target > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={isUnlocked ? { scale: 1.02, y: -2 } : undefined}
      className={cn(
        "relative overflow-hidden rounded-xl border-2 p-5 transition-all duration-300",
        isUnlocked ? [border, glow, "bg-card hover:brightness-110"] : "border-border/50 bg-muted/30 opacity-60",
        isUnlocked && "cursor-pointer"
      )}
    >
      {isUnlocked && (
        <div className="absolute right-3 top-3">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border text-2xl",
            isUnlocked
              ? "border-border bg-card shadow-lg"
              : "border-border/30 bg-muted/50"
          )}
        >
          {isUnlocked ? achievement.icon : <Lock className="h-6 w-6 text-muted-foreground" />}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <h3
            className={cn(
              "truncate text-sm font-bold",
              isUnlocked ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {isUnlocked ? achievement.name : "???"}
          </h3>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {isUnlocked
              ? achievement.description
              : "Complete challenges to unlock this achievement"}
          </p>

          {isUnlocked && achievement.unlocked_at && (
            <p className="text-[10px] text-muted-foreground">
              Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {hasProgress && (
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {achievement.progress}/{achievement.target}
            </span>
          </div>
          <Progress
            value={(achievement.progress! / achievement.target!) * 100}
            className="h-2"
          />
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Badge variant="secondary" className="gap-1 text-xs">
          <Star className="h-3 w-3 text-accent" />
          {formatXp(achievement.xp_reward)} XP
        </Badge>
        <Badge variant="outline" className="gap-1 text-xs">
          <Coins className="h-3 w-3 text-accent" />
          {achievement.coin_reward}
        </Badge>
      </div>
    </motion.div>
  );
}
