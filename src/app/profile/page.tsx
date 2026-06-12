"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Sword,
  Wand2,
  Crosshair,
  FlaskConical,
  Compass,
  Swords,
  BookOpen,
  Trophy,
  Flame,
  Star,
  Coins,
  Zap,
  Target,
  Crown,
  Calendar,
  Settings,
  BadgeCheck,
  Users,
  Edit3,
  Sparkles,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import {
  calculateLevel,
  calculateXpForNextLevel,
  calculateXpForCurrentLevel,
  getLevelProgress,
} from "@/lib/utils/helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressGame } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { Profile, UserAchievement, CharacterType } from "@/types";

const characterConfig: Record<CharacterType, { label: string; icon: React.ReactNode; color: string; gradient: string }> = {
  knight: { label: "Knight", icon: <Sword className="h-6 w-6" />, color: "#8b5cf6", gradient: "from-violet-500/20 via-violet-500/5 to-transparent" },
  wizard: { label: "Wizard", icon: <Wand2 className="h-6 w-6" />, color: "#3b82f6", gradient: "from-blue-500/20 via-blue-500/5 to-transparent" },
  ninja: { label: "Ninja", icon: <Crosshair className="h-6 w-6" />, color: "#ef4444", gradient: "from-red-500/20 via-red-500/5 to-transparent" },
  archer: { label: "Archer", icon: <Crosshair className="h-6 w-6" />, color: "#22c55e", gradient: "from-green-500/20 via-green-500/5 to-transparent" },
  scientist: { label: "Scientist", icon: <FlaskConical className="h-6 w-6" />, color: "#f59e0b", gradient: "from-amber-500/20 via-amber-500/5 to-transparent" },
  explorer: { label: "Explorer", icon: <Compass className="h-6 w-6" />, color: "#06b6d4", gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent" },
};

const levelTitles = [
  { min: 1, title: "Novice Learner" },
  { min: 5, title: "Curious Scholar" },
  { min: 10, title: "Apprentice Thinker" },
  { min: 15, title: "Dedicated Student" },
  { min: 20, title: "Knowledge Seeker" },
  { min: 25, title: "Master Explorer" },
  { min: 30, title: "Brilliant Mind" },
  { min: 40, title: "Legendary Sage" },
  { min: 50, title: "Grandmaster" },
];

function getTitle(level: number): string {
  let title = levelTitles[0].title;
  for (const t of levelTitles) {
    if (level >= t.min) title = t.title;
  }
  return title;
}

export default function ProfilePage() {
  const supabase = createClient();
  const { user, profile, refreshProfile } = useAuthStore();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_xp: 0,
    coins: 0,
    streak_days: 0,
    subjects_mastered: 0,
    bosses_defeated: 0,
    quests_completed: 0,
  });

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  async function fetchData() {
    try {
      const [achRes, statsRes] = await Promise.all([
        supabase
          .from("user_achievements")
          .select("*, achievement:achievements(*)")
          .eq("user_id", user!.id),
        supabase
          .from("analytics")
          .select("*")
          .eq("user_id", user!.id)
          .order("date", { ascending: false })
          .limit(1)
          .single(),
      ]);

      if (achRes.data) {
        setAchievements(achRes.data as unknown as UserAchievement[]);
      }

      if (statsRes.data) {
        const a = statsRes.data;
        setStats({
          total_xp: a.total_xp || profile?.total_xp || 0,
          coins: profile?.coins || 0,
          streak_days: a.streak_day || profile?.streak_days || 0,
          subjects_mastered: a.topics_studied?.length || 0,
          bosses_defeated: 0,
          quests_completed: a.lessons_completed || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Please sign in to view your profile</p>
      </div>
    );
  }

  const charInfo = characterConfig[profile.character_type];
  const level = profile.level || calculateLevel(profile.total_xp);
  const xpForCurrent = calculateXpForCurrentLevel(level);
  const xpForNext = calculateXpForNextLevel(level);
  const xpProgress = getLevelProgress(profile.total_xp);
  const title = getTitle(level);
  const topAchievements = achievements.slice(0, 6);

  const statCards = [
    { label: "Total XP", value: stats.total_xp.toLocaleString(), icon: <Zap className="h-5 w-5" />, color: "#f59e0b" },
    { label: "Coins", value: stats.coins.toLocaleString(), icon: <Coins className="h-5 w-5" />, color: "#22c55e" },
    { label: "Streak Days", value: stats.streak_days, suffix: "days", icon: <Flame className="h-5 w-5" />, color: "#ef4444" },
    { label: "Subjects Mastered", value: stats.subjects_mastered, icon: <BookOpen className="h-5 w-5" />, color: "#3b82f6" },
    { label: "Bosses Defeated", value: stats.bosses_defeated, icon: <Swords className="h-5 w-5" />, color: "#8b5cf6" },
    { label: "Quests Completed", value: stats.quests_completed, icon: <Trophy className="h-5 w-5" />, color: "#ec4899" },
  ];

  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="game-text text-3xl font-bold text-foreground">Player Profile</h1>
          <p className="text-sm text-muted-foreground">Your journey, stats, and achievements</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Edit Profile
        </Button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-b ${charInfo.gradient}`} />
            <CardContent className="relative z-10 flex flex-col items-center pt-8">
              <div className="relative mb-4">
                <div
                  className="absolute -inset-3 rounded-full opacity-30 blur-xl"
                  style={{ backgroundColor: charInfo.color }}
                />
                <div
                  className="relative flex h-28 w-28 items-center justify-center rounded-full border-4"
                  style={{ borderColor: `${charInfo.color}60` }}
                >
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="bg-card text-2xl font-bold" style={{ color: charInfo.color }}>
                      {profile.display_name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background"
                  style={{ backgroundColor: charInfo.color }}
                >
                  {charInfo.icon}
                </div>
              </div>

              <h2 className="game-text text-xl font-bold text-foreground">{profile.display_name}</h2>
              <Badge variant="outline" className="mt-1 gap-1" style={{ borderColor: `${charInfo.color}40`, color: charInfo.color }}>
                <Crown className="h-3 w-3" />
                {title}
              </Badge>

              <div className="mt-4 w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Level {level}</span>
                  <span className="text-xs text-muted-foreground">
                    {profile.total_xp - xpForCurrent} / {xpForNext - xpForCurrent} XP
                  </span>
                </div>
                <ProgressGame value={xpProgress * 100} variant="accent" />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {charInfo.label}
                </Badge>
                {profile.board && (
                  <Badge variant="outline" className="gap-1">
                    <BookOpen className="h-3 w-3" />
                    {profile.board}
                  </Badge>
                )}
                {profile.class && (
                  <Badge variant="ghost" className="gap-1">
                    <Users className="h-3 w-3" />
                    Class {profile.class}
                  </Badge>
                )}
              </div>

              <Separator className="my-4" />

              <Button variant="outline" size="sm" className="w-full gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="game-text text-lg">Stats Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {statCards.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:shadow-lg"
                  >
                    <div
                      className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-[0.06] blur-2xl transition-all duration-500 group-hover:opacity-[0.12]"
                      style={{ backgroundColor: stat.color }}
                    />
                    <div className="relative z-10">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="game-text text-xl font-bold transition-colors" style={{ color: stat.color }}>
                          {stat.value}
                        </span>
                        {stat.suffix && <span className="text-xs text-muted-foreground">{stat.suffix}</span>}
                      </div>
                    </div>
                    <div
                      className="mt-2 flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                    >
                      {stat.icon}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="game-text text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Achievement Showcase
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topAchievements.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <Trophy className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No achievements unlocked yet. Keep learning!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {topAchievements.map((ua, i) => {
                    const ach = ua.achievement;
                    if (!ach) return null;
                    return (
                      <motion.div
                        key={ua.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="group rounded-xl border border-border bg-card p-3 transition-all duration-300 hover:border-accent/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/20">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-foreground">{ach.name}</p>
                            <p className="text-[10px] text-muted-foreground">{new Date(ua.unlocked_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-2 text-[10px] text-muted-foreground">{ach.description}</p>
                        <div className="mt-1.5 flex gap-2 text-[10px]">
                          {ach.xp_reward > 0 && (
                            <span className="flex items-center gap-0.5 text-accent">
                              <Sparkles className="h-2.5 w-2.5" />+{ach.xp_reward}
                            </span>
                          )}
                          {ach.coin_reward > 0 && (
                            <span className="flex items-center gap-0.5 text-accent">
                              <Star className="h-2.5 w-2.5" />+{ach.coin_reward}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="game-text text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              Progress Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Current Level</p>
                <p className="game-text text-2xl font-bold text-foreground">{level}</p>
                <p className="text-xs text-muted-foreground">Next level at {xpForNext.toLocaleString()} XP</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="game-text text-sm font-bold text-foreground">
                  {new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Character</p>
                <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <BadgeCheck className="h-4 w-4" style={{ color: charInfo.color }} />
                  {charInfo.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile.board || "No board"} {profile.class ? `| Class ${profile.class}` : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
