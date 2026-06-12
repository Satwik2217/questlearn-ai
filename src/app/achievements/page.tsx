"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Coins, RefreshCw, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { formatXp } from "@/lib/utils/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import type { Achievement, UserAchievement } from "@/types";

interface AchievementWithProgress extends Achievement {
  unlocked?: boolean;
  unlocked_at?: string | null;
  progress?: number;
  target?: number;
}

type FilterType = "all" | "unlocked" | "locked";

export default function AchievementsPage() {
  const supabase = createClient();
  const { user } = useAuthStore();
  const [achievements, setAchievements] = useState<AchievementWithProgress[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  const fetchAchievements = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [achRes, userAchRes] = await Promise.all([
        supabase.from("achievements").select("*"),
        supabase
          .from("user_achievements")
          .select("*")
          .eq("user_id", user.id),
      ]);

      if (achRes.error) throw achRes.error;
      if (userAchRes.error) throw userAchRes.error;

      const allAchievements = (achRes.data || []) as Achievement[];
      const userAchievements = (userAchRes.data || []) as UserAchievement[];
      const unlockedMap = new Map(
        userAchievements.map((ua) => [ua.achievement_id, ua])
      );

      const withProgress: AchievementWithProgress[] = allAchievements.map(
        (ach) => {
          const ua = unlockedMap.get(ach.id);
          const criteria = ach.criteria || {};
          return {
            ...ach,
            unlocked: !!ua,
            unlocked_at: ua?.unlocked_at || null,
            progress: (criteria.progress as number) || (ua ? 1 : 0),
            target: (criteria.target as number) || 1,
          };
        }
      );

      setAchievements(withProgress);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPct =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;
  const totalXp = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.xp_reward, 0);
  const totalCoins = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.coin_reward, 0);

  const filtered =
    filter === "all"
      ? achievements
      : filter === "unlocked"
        ? achievements.filter((a) => a.unlocked)
        : achievements.filter((a) => !a.unlocked);

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="game-text text-3xl font-bold text-foreground">
            Achievements
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your accomplishments and earn rewards
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAchievements}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total",
            value: `${unlockedCount}/${totalCount}`,
            sub: `${completionPct}% complete`,
            icon: Trophy,
          },
          {
            label: "Completion",
            value: `${completionPct}%`,
            sub: `${totalCount - unlockedCount} remaining`,
            icon: Trophy,
          },
          {
            label: "XP Earned",
            value: formatXp(totalXp),
            icon: Star,
          },
          {
            label: "Coins Earned",
            value: totalCoins.toLocaleString(),
            icon: Coins,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                {stat.sub && (
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setFilter("all")}>
              All ({achievements.length})
            </TabsTrigger>
            <TabsTrigger
              value="unlocked"
              onClick={() => setFilter("unlocked")}
            >
              Unlocked ({unlockedCount})
            </TabsTrigger>
            <TabsTrigger value="locked" onClick={() => setFilter("locked")}>
              Locked ({totalCount - unlockedCount})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={filter} className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Trophy className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {filter === "unlocked"
                  ? "No achievements unlocked yet"
                  : filter === "locked"
                    ? "No locked achievements"
                    : "No achievements found"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((ach, i) => (
                <AchievementCard
                  key={ach.id}
                  achievement={ach}
                  index={i}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
