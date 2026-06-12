"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Flame,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  Gift,
  Swords,
  Star,
  Coins,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressGame } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DailyRewards } from "@/components/quests/DailyRewards";
import { toast } from "sonner";
import type { Quest, QuestStatus } from "@/types";

interface DailyQuest extends Quest {
  typeLabel?: string;
}

const mockDailyQuests: DailyQuest[] = [
  {
    id: "dq1",
    user_id: "1",
    title: "Complete 3 Lessons",
    description: "Finish three interactive lessons to earn bonus XP.",
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
    id: "dq2",
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
    id: "dq3",
    user_id: "1",
    title: "Study for 30 Minutes",
    description: "Spend at least 30 minutes learning on the platform.",
    type: "daily",
    status: "in_progress",
    xp_reward: 100,
    coin_reward: 30,
    item_reward: null,
    requirements: { minutes: 30 },
    progress: 18,
    target: 30,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date().toISOString(),
    completed_at: null,
  },
  {
    id: "dq4",
    user_id: "1",
    title: "Review 10 Flashcards",
    description: "Review at least 10 flashcards in the Flashcard Arena.",
    type: "daily",
    status: "completed",
    xp_reward: 120,
    coin_reward: 40,
    item_reward: null,
    requirements: { cards: 10 },
    progress: 10,
    target: 10,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  },
];

export default function DailyQuestPage() {
  const [quests, setQuests] = useState<DailyQuest[]>(mockDailyQuests);
  const [streak, setStreak] = useState(5);
  const [xpBoostActive, setXpBoostActive] = useState(true);
  const [timeUntilReset, setTimeUntilReset] = useState("");

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

  const handleClaimQuest = useCallback(async (questId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, status: "completed" as QuestStatus, completed_at: new Date().toISOString() }
          : q
      )
    );
    toast.success("Quest completed! Rewards claimed!");
  }, []);

  const handleClaimDay = useCallback(async (day: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, []);

  const handleRefresh = useCallback(() => {
    toast.success("Quests refreshed!");
  }, []);

  const activeQuests = quests.filter((q) => q.status !== "completed");
  const completedCount = quests.filter((q) => q.status === "completed").length;
  const totalXp = quests.reduce((s, q) => s + q.xp_reward, 0);
  const totalCoins = quests.reduce((s, q) => s + q.coin_reward, 0);

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="game-text text-3xl font-bold text-foreground">
            Daily Quests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete daily quests to earn rewards and maintain your streak
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <Flame className="h-7 w-7 text-accent" />
              </div>
              <div>
                <p className="game-text text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Current Streak
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {streak} days
                </p>
                <p className="text-xs text-muted-foreground">
                  Resets in {timeUntilReset}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {xpBoostActive && (
                <Badge variant="accent" className="gap-1.5 px-3 py-1.5">
                  <Zap className="h-4 w-4" />
                  XP Boost Active
                </Badge>
              )}
              <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                <Clock className="h-4 w-4" />
                {timeUntilReset}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DailyRewards streak={streak} onClaimDay={handleClaimDay} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="game-text flex items-center gap-2 text-base">
              <Target className="h-5 w-5 text-primary" />
              Active Quests
              <Badge variant="outline" className="ml-1 text-xs">
                {activeQuests.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeQuests.map((quest, i) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative overflow-hidden rounded-xl border border-border bg-card p-5"
                >
                  <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary/5 opacity-50 blur-2xl" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-foreground">
                          {quest.title}
                        </h4>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {quest.description}
                        </p>
                      </div>
                      {quest.progress >= quest.target && (
                        <Button
                          size="sm"
                          variant="game-primary"
                          onClick={() => handleClaimQuest(quest.id)}
                          className="shrink-0 gap-1.5"
                        >
                          <Gift className="h-4 w-4" />
                          Claim
                        </Button>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">
                          {quest.progress}/{quest.target}
                        </span>
                      </div>
                      <ProgressGame
                        value={(quest.progress / quest.target) * 100}
                        variant={
                          quest.progress >= quest.target ? "success" : "primary"
                        }
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        +{quest.xp_reward} XP
                      </span>
                      <span className="flex items-center gap-1">
                        <Coins className="h-3.5 w-3.5 text-accent" />
                        +{quest.coin_reward}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {activeQuests.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-success" />
                  <p className="text-lg font-semibold text-foreground">
                    All quests completed!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    New quests will be available tomorrow.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {[
          { label: "Active", value: activeQuests.length, icon: Swords, color: "text-primary" },
          { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-success" },
          { label: "Total XP", value: totalXp.toLocaleString(), icon: Zap, color: "text-accent" },
          { label: "Total Coins", value: totalCoins.toLocaleString(), icon: Coins, color: "text-accent" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4 text-center"
          >
            <stat.icon className={cn("mx-auto h-5 w-5", stat.color)} />
            <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {completedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="game-text flex items-center gap-2 text-base">
                <RotateCcw className="h-5 w-5 text-primary" />
                Completed Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quests
                  .filter((q) => q.status === "completed")
                  .map((quest) => (
                    <div
                      key={quest.id}
                      className="flex items-center justify-between rounded-lg border border-success/30 bg-success/5 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {quest.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>+{quest.xp_reward} XP</span>
                            <span>+{quest.coin_reward} coins</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="success">Claimed</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
