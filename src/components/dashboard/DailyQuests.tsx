"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Gift,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { ProgressGame } from "@/components/ui/progress";
import { toast } from "sonner";
import type { Quest, QuestStatus } from "@/types";

const questColors: Record<Quest["type"], string> = {
  daily: "#8b5cf6",
  weekly: "#3b82f6",
  monthly: "#f59e0b",
  bonus: "#22c55e",
  story: "#ef4444",
};

const questIcons: Record<Quest["type"], string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  bonus: "Bonus",
  story: "Story",
};

interface DailyQuestsProps {
  quests: Quest[];
  onClaimReward: (questId: string) => Promise<void>;
  onRefresh?: () => void;
}

export function DailyQuests({
  quests,
  onClaimReward,
  onRefresh,
}: DailyQuestsProps) {
  const [timeUntilReset, setTimeUntilReset] = useState("");
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilReset(`${hours}h ${minutes}m`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async (questId: string) => {
    setClaiming(questId);
    try {
      await onClaimReward(questId);
      toast.success("Reward claimed!");
    } catch {
      toast.error("Failed to claim reward");
    } finally {
      setClaiming(null);
    }
  };

  const activeQuests = quests.filter((q) => q.status !== "locked");
  const completedQuests = quests.filter(
    (q) => q.status === "completed"
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="game-text text-lg font-bold text-foreground">
            Quests
          </h2>
          <span className="text-xs text-muted-foreground">
            ({completedQuests}/{activeQuests.length})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeUntilReset}
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="h-7 w-7 p-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {activeQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "relative overflow-hidden rounded-xl border p-4",
                quest.status === "completed"
                  ? "border-success/30 bg-success/5"
                  : "border-border bg-card"
              )}
            >
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-[0.06] blur-2xl"
                style={{ backgroundColor: questColors[quest.type] }}
              />

              <div className="relative z-10 flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold uppercase"
                  style={{
                    backgroundColor: `${questColors[quest.type]}20`,
                    color: questColors[quest.type],
                  }}
                >
                  {questIcons[quest.type]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {quest.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {quest.description}
                      </p>
                    </div>

                    {quest.status === "completed" ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    ) : quest.progress >= quest.target ? (
                      <Button
                        size="sm"
                        variant="game-primary"
                        className="h-8 shrink-0 text-xs"
                        onClick={() => handleClaim(quest.id)}
                        disabled={claiming === quest.id}
                      >
                        {claiming === quest.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <Gift className="h-3 w-3" />
                            Claim
                          </>
                        )}
                      </Button>
                    ) : null}
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span
                        className="font-medium"
                        style={{ color: questColors[quest.type] }}
                      >
                        {Math.min(quest.progress, quest.target)}/{quest.target}
                      </span>
                    </div>
                    <ProgressGame
                      value={(quest.progress / quest.target) * 100}
                      variant={
                        quest.status === "completed"
                          ? "success"
                          : quest.type === "daily"
                            ? "primary"
                            : quest.type === "weekly"
                              ? "secondary"
                              : "accent"
                      }
                    />
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-accent" />
                      +{quest.xp_reward} XP
                    </span>
                    {quest.coin_reward > 0 && (
                      <span className="flex items-center gap-1 text-accent">
                        +{quest.coin_reward} coins
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {activeQuests.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Gift className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No quests available right now
          </p>
        </div>
      )}
    </div>
  );
}
