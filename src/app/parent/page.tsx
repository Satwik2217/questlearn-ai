"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Clock,
  Award,
  AlertTriangle,
  Sparkles,
  Crown,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChildProgress } from "@/components/parent/ChildProgress";
import { ParentAnalytics } from "@/components/parent/ParentAnalytics";
import { toast } from "sonner";

export default function ParentDashboard() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const supabase = createClient();
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  const children = [
    {
      id: "child-1",
      name: "Arjun",
      avatar_url: null,
      level: 12,
      total_xp: 8450,
      coins: 2340,
      streak_days: 15,
      subjects: [
        { name: "Mathematics", mastery: 82, color: "#8b5cf6" },
        { name: "Science", mastery: 68, color: "#3b82f6" },
        { name: "English", mastery: 91, color: "#f59e0b" },
        { name: "History", mastery: 45, color: "#22c55e" },
      ],
      todayLessons: 3,
      todayTimeSpent: 45,
      lastActive: new Date().toISOString(),
    },
    {
      id: "child-2",
      name: "Priya",
      avatar_url: null,
      level: 8,
      total_xp: 4200,
      coins: 1580,
      streak_days: 7,
      subjects: [
        { name: "Mathematics", mastery: 58, color: "#8b5cf6" },
        { name: "Science", mastery: 72, color: "#3b82f6" },
        { name: "English", mastery: 65, color: "#f59e0b" },
        { name: "History", mastery: 80, color: "#22c55e" },
      ],
      todayLessons: 2,
      todayTimeSpent: 30,
      lastActive: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  const child = children[selectedChildIndex] || children[0];

  useEffect(() => {
    if (!loading && (!profile || (profile.role !== "parent" && profile.role !== "admin"))) {
      router.push("/");
    }
  }, [profile, loading]);

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const weeklyActivity = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 60 },
    { day: "Wed", value: 30 },
    { day: "Thu", value: 75 },
    { day: "Fri", value: 50 },
    { day: "Sat", value: 90 },
    { day: "Sun", value: 35 },
  ];

  const subjectPerformance = [
    { name: "Mathematics", score: 82, classAverage: 71, color: "#8b5cf6" },
    { name: "Science", score: 68, classAverage: 65, color: "#3b82f6" },
    { name: "English", score: 91, classAverage: 73, color: "#f59e0b" },
    { name: "History", score: 45, classAverage: 58, color: "#22c55e" },
  ];

  const accuracyTrend = [
    { day: "Mon", value: 72 },
    { day: "Tue", value: 78 },
    { day: "Wed", value: 65 },
    { day: "Thu", value: 81 },
    { day: "Fri", value: 75 },
    { day: "Sat", value: 88 },
    { day: "Sun", value: 84 },
  ];

  const timeTrend = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 60 },
    { day: "Wed", value: 30 },
    { day: "Thu", value: 75 },
    { day: "Fri", value: 50 },
    { day: "Sat", value: 90 },
    { day: "Sun", value: 35 },
  ];

  const achievements = [
    { name: "Math Whiz", icon: "🏆", description: "Score 90%+ in Math quiz" },
    { name: "7-Day Streak", icon: "🔥", description: "Log in for 7 days" },
    { name: "Quick Learner", icon: "⚡", description: "Complete 5 lessons in a day" },
  ];

  const weakAreas = ["Chemical Bonding", "Algebraic Equations", "World History"];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Parent Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your child&apos;s learning journey
            </p>
          </div>
          {children.length > 1 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              {children.map((c, i) => (
                <Button
                  key={c.id}
                  variant={i === selectedChildIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedChildIndex(i)}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ChildProgress child={child} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-2">
                  {weeklyActivity.map((day, i) => {
                    const maxVal = Math.max(...weeklyActivity.map((d) => d.value));
                    return (
                      <motion.div
                        key={day.day}
                        className="flex flex-1 flex-col items-center gap-1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <span className="text-[10px] text-muted-foreground">
                          {day.value}m
                        </span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{
                            height: `${(day.value / maxVal) * 100}px`,
                          }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                          className={cn(
                            "w-full rounded-t-md",
                            day.value >= maxVal * 0.7
                              ? "bg-primary"
                              : day.value >= maxVal * 0.4
                                ? "bg-secondary"
                                : "bg-muted"
                          )}
                          style={{ minHeight: day.value > 0 ? 4 : 0 }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {day.day.slice(0, 3)}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award className="h-4 w-4 text-accent" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((ach, i) => (
                      <motion.div
                        key={ach.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 rounded-lg bg-muted/50 p-2.5"
                      >
                        <span className="text-xl">{ach.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {ach.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ach.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-danger" />
                    Weak Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {weakAreas.map((area, i) => (
                      <motion.div
                        key={area}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-2 rounded-lg bg-danger/10 p-2.5"
                      >
                        <Target className="h-4 w-4 text-danger shrink-0" />
                        <span className="text-sm text-foreground">{area}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Subscription Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="h-6 w-6 text-accent" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Premium Family Plan
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Renews on July 15, 2026
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-xs">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <ParentAnalytics
          weeklyActivity={weeklyActivity}
          subjectPerformance={subjectPerformance}
          accuracyTrend={accuracyTrend}
          timeTrend={timeTrend}
          weakAreas={weakAreas}
        />
      </div>
    </div>
  );
}
