"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Gift,
  Flame,
  Zap,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  RotateCcw,
  Star,
  Trophy,
  Lock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressGame } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Quest, QuestStatus } from "@/types";

export default function DailyQuestsPage() {
  const supabase = createClient();
  const { user, profile } = useAuthStore();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
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
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchQuests = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quests")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "daily")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuests((data || []) as Quest[]);
    } catch (error) {
      console.error("Failed to fetch daily quests:", error);
      toast.error("Failed to load daily quests");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const handleClaim = async (questId: string) => {
    setClaiming(questId);
    try {
      const { error } = await supabase
        .from("quests")
        .update({
          status: "completed" as QuestStatus,
          completed_at: new Date().toISOString(),
        })
        .eq("id", questId);

      if (error) throw error;

      const quest = quests.find((q) => q.id === questId);
      toast.success(`+${quest?.xp_reward} XP, +${quest?.coin_reward} coins claimed!`);
      fetchQuests();
    } catch (error) {
      console.error("Failed to claim reward:", error);
      toast.error("Failed to claim reward");
    } finally {
      setClaiming(null);
    }
  };

  const activeQuests = quests.filter((q) => q.status !== "completed");
  const completedQuests = quests.filter((q) => q.status === "completed");
  const streakDays = profile?.streak_days || 0;

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="game-text text-3xl font-bold text-foreground">Daily Quests</h1>
          <p className="text-sm text-muted-foreground">Complete daily challenges to earn rewards</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchQuests} disabled={loading} className="gap-2">
          <RotateCcw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="game-text text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  Active Daily Quests
                  <Badge variant="outline" className="ml-1 text-[10px]">{activeQuests.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
                    ))}
                  </div>
                ) : activeQuests.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <Gift className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">All daily quests completed!</p>
                    <p className="text-xs text-muted-foreground">Check back tomorrow for new quests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {activeQuests.map((quest, i) => (
                        <motion.div
                          key={quest.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: i * 0.05 }}
                          className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md"
                        >
                          <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary/[0.04] blur-2xl transition-all duration-500 group-hover:bg-primary/[0.08]" />

                          <div className="relative z-10 flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Zap className="h-5 w-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground">{quest.title}</h4>
                                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{quest.description}</p>
                                </div>

                                {quest.progress >= quest.target && (
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
                                        <Gift className="h-3 w-3" /> Claim
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>

                              <div className="mt-3 space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium text-primary">
                                    {Math.min(quest.progress, quest.target)}/{quest.target}
                                  </span>
                                </div>
                                <ProgressGame
                                  value={(quest.progress / quest.target) * 100}
                                  variant={quest.progress >= quest.target ? "success" : "primary"}
                                />
                              </div>

                              <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Sparkles className="h-3 w-3 text-accent" /> +{quest.xp_reward} XP
                                </span>
                                {quest.coin_reward > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-accent" /> +{quest.coin_reward} coins
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="game-text text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  Recently Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedQuests.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No completed quests yet</p>
                ) : (
                  <div className="space-y-2">
                    {completedQuests.slice(0, 5).map((quest) => (
                      <div
                        key={quest.id}
                        className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 p-3"
                      >
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{quest.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Completed {quest.completed_at ? new Date(quest.completed_at).toLocaleString() : ""}
                          </p>
                        </div>
                        <Badge variant="success" className="text-[10px]">
                          +{quest.xp_reward} XP
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="game-text text-lg flex items-center gap-2">
                  <Flame className="h-5 w-5 text-danger" />
                  Streak Tracker
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-danger/20 to-accent/20" />
                  <Flame className="h-10 w-10 text-danger" />
                </div>
                <p className="game-text text-3xl font-bold text-foreground">{streakDays}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
                <Separator className="my-3" />
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Resets in {timeUntilReset}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="game-text text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Daily Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{today.toLocaleString("default", { month: "long" })} {today.getFullYear()}</span>
                  <span>{today.toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d} className="py-1 text-center text-[10px] font-medium text-muted-foreground">{d}</div>
                  ))}
                  {Array.from({ length: new Date(today.getFullYear(), today.getMonth(), 1).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {calendarDays.map((day) => {
                    const isToday = day === today.getDate();
                    const isPast = day < today.getDate();
                    return (
                      <div
                        key={day}
                        className={cn(
                          "flex items-center justify-center rounded-lg py-1.5 text-xs transition-all",
                          isToday
                            ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/30"
                            : isPast
                              ? "text-success/60"
                              : "text-muted-foreground"
                        )}
                      >
                        {isPast ? <CheckCircle2 className="h-3 w-3" /> : day}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="game-text text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  XP Boost
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Zap className="h-6 w-6 text-accent" />
                  <span className="game-text text-2xl font-bold text-accent">2x</span>
                </div>
                <p className="text-xs text-muted-foreground">Active for next 2 hours</p>
                <Badge variant="accent" className="mt-2">Boosted</Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
