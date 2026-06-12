"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Flame,
  CheckCircle2,
  Lock,
  Sparkles,
  Coins,
  Zap,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DayReward {
  day: number;
  reward: string;
  rewardValue: number;
  rewardType: "xp" | "coins" | "item";
  claimed: boolean;
  date: string;
}

interface DailyRewardsProps {
  streak: number;
  onClaimDay: (day: number) => Promise<void>;
  currentDay?: number;
}

function generateMockDays(currentDay: number): DayReward[] {
  const rewards = [
    { reward: "XP", rewardValue: 50, rewardType: "xp" as const },
    { reward: "Coins", rewardValue: 25, rewardType: "coins" as const },
    { reward: "XP", rewardValue: 75, rewardType: "xp" as const },
    { reward: "XP Boost", rewardValue: 15, rewardType: "item" as const },
    { reward: "Coins", rewardValue: 50, rewardType: "coins" as const },
    { reward: "XP", rewardValue: 100, rewardType: "xp" as const },
    { reward: "Mega Chest", rewardValue: 200, rewardType: "item" as const },
  ];

  return rewards.map((r, i) => ({
    day: i + 1,
    reward: r.reward,
    rewardValue: r.rewardValue,
    rewardType: r.rewardType,
    claimed: i < currentDay - 1,
    date: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
  }));
}

function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[target.getDay()];
}

export function DailyRewards({
  streak,
  onClaimDay,
  currentDay: externalDay,
}: DailyRewardsProps) {
  const [days, setDays] = useState<DayReward[]>([]);
  const [claiming, setClaiming] = useState(false);
  const [claimedDay, setClaimedDay] = useState<number | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const currentDay = externalDay ?? days.filter((d) => !d.claimed).length + 1;

  useEffect(() => {
    const todayIndex = days.length;
    setDays(generateMockDays(todayIndex));
  }, []);

  const handleClaim = async () => {
    if (claimedDay !== null) return;
    setClaiming(true);
    try {
      await onClaimDay(currentDay);
      setClaimedDay(currentDay);
      setShowAnimation(true);
      toast.success(`Day ${currentDay} reward claimed!`, {
        icon: <Sparkles className="h-4 w-4" />,
      });
      setTimeout(() => setShowAnimation(false), 2000);
    } catch {
      toast.error("Failed to claim reward");
    } finally {
      setClaiming(false);
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "xp":
        return <Zap className="h-4 w-4 text-accent" />;
      case "coins":
        return <Coins className="h-4 w-4 text-accent" />;
      case "item":
        return <Gift className="h-4 w-4 text-primary" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const todayReward = days[currentDay - 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="game-text text-lg font-bold text-foreground">
            Daily Rewards
          </h3>
          <Badge variant="accent" className="gap-1">
            <Flame className="h-3.5 w-3.5" />
            {streak} day streak
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-card p-4">
        {days.map((day, i) => {
          const isToday = i === currentDay - 1;
          const isPast = i < currentDay - 1;
          const isFuture = i > currentDay - 1;
          const wasClaimed = day.claimed || (isPast && i < claimedDay!);

          return (
            <div
              key={day.day}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-2 rounded-lg p-3 transition-all min-w-[80px]",
                isToday && !wasClaimed
                  ? "border border-accent/50 bg-accent/10 shadow-lg shadow-accent/10"
                  : wasClaimed
                    ? "border border-success/30 bg-success/5"
                    : isFuture
                      ? "border border-border bg-muted/30 opacity-50"
                      : "border border-border bg-card"
              )}
            >
              {isToday && !wasClaimed && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2"
                >
                  <Badge variant="accent" className="text-[9px] px-1.5 py-0">
                    TODAY
                  </Badge>
                </motion.div>
              )}

              <span
                className={cn(
                  "text-xs font-bold",
                  wasClaimed
                    ? "text-success"
                    : isToday
                      ? "text-accent"
                      : "text-muted-foreground"
                )}
              >
                Day {day.day}
              </span>

              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2",
                  wasClaimed
                    ? "border-success bg-success/10"
                    : isToday
                      ? "border-accent bg-accent/10 animate-pulse"
                      : isFuture
                        ? "border-muted bg-muted/20"
                        : "border-border bg-card"
                )}
              >
                {wasClaimed ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : isFuture ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  getRewardIcon(day.rewardType)
                )}
              </div>

              <div className="text-center">
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    wasClaimed
                      ? "text-success"
                      : isToday
                        ? "text-accent"
                        : "text-muted-foreground"
                  )}
                >
                  {day.rewardValue}
                </span>
                <span className="block text-[8px] text-muted-foreground">
                  {day.reward}
                </span>
              </div>

              <span className="text-[9px] text-muted-foreground">
                {getDayLabel(day.date)}
              </span>

              {wasClaimed && (
                <Badge variant="success" className="text-[8px] px-1 py-0">
                  Claimed
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {todayReward && !todayReward.claimed && claimedDay === null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between rounded-xl border border-accent/30 bg-accent/5 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                {getRewardIcon(todayReward.rewardType)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Day {currentDay} Reward
                </p>
                <p className="text-xs text-muted-foreground">
                  {todayReward.rewardValue} {todayReward.reward}
                </p>
              </div>
            </div>
            <Button
              variant="game-primary"
              size="sm"
              onClick={handleClaim}
              disabled={claiming}
              className="gap-2"
            >
              {claiming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Gift className="h-4 w-4" />
              )}
              Claim
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {showAnimation && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
          onClick={() => setShowAnimation(false)}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/20">
              <Sparkles className="h-12 w-12 text-accent" />
            </div>
            <h2 className="game-text text-2xl font-bold text-foreground">
              Reward Claimed!
            </h2>
            <p className="text-muted-foreground">
              +{todayReward?.rewardValue} {todayReward?.reward}
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
