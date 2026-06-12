"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  RotateCcw,
  Calendar,
  Infinity,
  Zap,
  Swords,
  RefreshCw,
  Star,
  Coins,
  Gift,
  History,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QuestCard } from "@/components/quests/QuestCard";
import type { Quest, QuestStatus } from "@/types";

interface QuestWithMeta extends Quest {
  typeLabel?: string;
}

export default function QuestsPage() {
  const supabase = createClient();
  const { user, profile } = useAuthStore();
  const [quests, setQuests] = useState<QuestWithMeta[]>([]);
  const [history, setHistory] = useState<QuestWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuests = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("quests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const allQuests = (data || []) as QuestWithMeta[];

      setQuests(
        allQuests.filter(
          (q) => q.status !== "completed"
        )
      );
      setHistory(
        allQuests.filter((q) => q.status === "completed")
      );
    } catch (error) {
      console.error("Failed to fetch quests:", error);
      toast.error("Failed to load quests");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const handleClaim = async (questId: string) => {
    try {
      const quest = quests.find((q) => q.id === questId);
      if (!quest) return;

      const { error } = await supabase
        .from("quests")
        .update({
          status: "completed" as QuestStatus,
          completed_at: new Date().toISOString(),
        })
        .eq("id", questId);

      if (error) throw error;

      toast.success(
        `Reward claimed! +${quest.xp_reward} XP, +${quest.coin_reward} coins`
      );
      fetchQuests();
    } catch (error) {
      console.error("Failed to claim reward:", error);
      toast.error("Failed to claim reward");
    }
  };

  const dailyQuests = quests.filter((q) => q.type === "daily");
  const weeklyQuests = quests.filter((q) => q.type === "weekly");
  const monthlyQuests = quests.filter((q) => q.type === "monthly");
  const bonusQuests = quests.filter((q) => q.type === "bonus");

  const sectionConfig = [
    {
      id: "daily",
      label: "Daily Quests",
      icon: RotateCcw,
      color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
      quests: dailyQuests,
      empty: "No daily quests available. Check back tomorrow!",
    },
    {
      id: "weekly",
      label: "Weekly Quests",
      icon: Calendar,
      color: "text-purple-400 border-purple-500/20 bg-purple-500/5",
      quests: weeklyQuests,
      empty: "No weekly quests available",
    },
    {
      id: "monthly",
      label: "Monthly Challenge",
      icon: Infinity,
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
      quests: monthlyQuests,
      empty: "No monthly challenges available",
    },
    {
      id: "bonus",
      label: "Bonus Missions",
      icon: Zap,
      color: "text-green-400 border-green-500/20 bg-green-500/5",
      quests: bonusQuests,
      empty: "No bonus missions available",
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="game-text text-3xl font-bold text-foreground">
            Quests
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete quests to earn XP, coins, and items
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchQuests}
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
            label: "Active",
            value: quests.length,
            icon: Swords,
          },
          {
            label: "Completed",
            value: history.length,
            icon: History,
          },
          {
            label: "Total XP",
            value: quests
              .reduce((s, q) => s + q.xp_reward, 0)
              .toLocaleString(),
            icon: Star,
          },
          {
            label: "Total Coins",
            value: quests
              .reduce((s, q) => s + q.coin_reward, 0)
              .toLocaleString(),
            icon: Coins,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            {sectionConfig.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="gap-2"
              >
                <section.icon className="h-4 w-4" />
                {section.label}
                <Badge variant="outline" className="ml-1 text-[10px]">
                  {section.quests.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {sectionConfig.map((section) => (
            <TabsContent key={section.id} value={section.id} className="mt-6">
              {section.quests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <section.icon className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {section.empty}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {section.quests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onClaim={handleClaim}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-bold text-foreground">
              Completed History
            </h2>
            <Badge variant="outline">{history.length}</Badge>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {history.slice(0, 6).map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClaim={handleClaim}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
