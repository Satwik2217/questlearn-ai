"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  RefreshCw,
  Users,
  Globe,
  GraduationCap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LeaderboardTable } from "@/components/social/LeaderboardTable";
import type { Profile } from "@/types";

interface LeaderboardEntry {
  rank: number;
  profile: Profile;
  achievement_count: number;
  streak_days: number;
  isCurrentUser?: boolean;
}

type TabType = "global" | "friends" | "class";

export default function LeaderboardPage() {
  const supabase = createClient();
  const { user, profile } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("global");

  const fetchLeaderboard = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("total_xp", { ascending: false })
        .limit(100);

      const { data, error } = await query;

      if (error) throw error;

      const profiles = (data || []) as Profile[];

      const entriesWithRank: LeaderboardEntry[] = profiles.map((p, i) => ({
        rank: i + 1,
        profile: p,
        achievement_count: 0,
        streak_days: p.streak_days || 0,
        isCurrentUser: p.id === profile?.id,
      }));

      setEntries(entriesWithRank);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }, [user, profile?.id, supabase]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const currentUserEntry = entries.find((e) => e.isCurrentUser);
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const podiumIcons = [
    <Crown key="crown" className="h-5 w-5 text-amber-400" />,
    <Medal key="medal" className="h-5 w-5 text-slate-300" />,
    <Medal key="medal3" className="h-5 w-5 text-amber-700" />,
  ];

  const podiumStyles = [
    "border-amber-400/50 bg-gradient-to-b from-amber-400/10 to-transparent shadow-[0_0_20px_-5px] shadow-amber-400/30",
    "border-slate-300/50 bg-gradient-to-b from-slate-300/10 to-transparent shadow-[0_0_20px_-5px] shadow-slate-300/20",
    "border-amber-700/50 bg-gradient-to-b from-amber-700/10 to-transparent shadow-[0_0_20px_-5px] shadow-amber-700/20",
  ];

  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="game-text text-3xl font-bold text-foreground">
            Leaderboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Top players ranked by experience points
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLeaderboard}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <Tabs
        defaultValue="global"
        onValueChange={(v) => setActiveTab(v as TabType)}
      >
        <TabsList>
          <TabsTrigger value="global" className="gap-2">
            <Globe className="h-4 w-4" />
            Global
          </TabsTrigger>
          <TabsTrigger value="friends" className="gap-2">
            <Users className="h-4 w-4" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="class" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Class
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-6">
          {top3.length === 3 && (
            <div className="grid grid-cols-3 gap-4">
              {top3.map((entry, i) => (
                <motion.div
                  key={entry.profile.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className={cn(
                    "flex flex-col items-center rounded-2xl border-2 p-6 text-center transition-all hover:scale-[1.02]",
                    podiumStyles[i]
                  )}
                >
                  <div className="mb-2">{podiumIcons[i]}</div>
                  <Avatar className="mb-3 h-16 w-16 border-2 border-border">
                    <AvatarImage
                      src={entry.profile.avatar_url || undefined}
                    />
                    <AvatarFallback className="text-lg">
                      {entry.profile.display_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-bold text-foreground">
                    {entry.profile.display_name}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    Lv.{entry.profile.level}
                  </Badge>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {entry.profile.total_xp.toLocaleString()} XP
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.streak_days} day streak
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          <LeaderboardTable
            entries={activeTab === "global" ? entries : entries}
            currentUserId={profile?.id}
            loading={loading}
          />

          {currentUserEntry && currentUserEntry.rank > 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Your Rank
              </p>
              <p className="game-text text-2xl font-bold text-primary">
                #{currentUserEntry.rank}
              </p>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
