"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Flame,
  Coins,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SubjectMastery {
  name: string;
  mastery: number;
  color: string;
}

interface ChildProgressProps {
  child: {
    id: string;
    name: string;
    avatar_url: string | null;
    level: number;
    total_xp: number;
    coins: number;
    streak_days: number;
    subjects: SubjectMastery[];
    todayLessons: number;
    todayTimeSpent: number;
    lastActive: string;
  };
}

export function ChildProgress({ child }: ChildProgressProps) {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/30">
            <AvatarFallback className="bg-primary/20 text-lg font-bold text-primary">
              {child.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{child.name}</CardTitle>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-xs">
                Level {child.level}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {timeAgo(child.lastActive)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
            <Zap className="mb-1 h-5 w-5 text-accent" />
            <span className="text-sm font-bold text-foreground">
              {child.total_xp.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">XP</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
            <Coins className="mb-1 h-5 w-5 text-yellow-400" />
            <span className="text-sm font-bold text-foreground">
              {child.coins}
            </span>
            <span className="text-xs text-muted-foreground">Coins</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
            <Flame className="mb-1 h-5 w-5 text-orange-400" />
            <span className="text-sm font-bold text-foreground">
              {child.streak_days}
            </span>
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">
            Subject Mastery
          </h4>
          <div className="space-y-3">
            {child.subjects.map((subject, i) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <span className="text-foreground">{subject.name}</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {subject.mastery}%
                  </span>
                </div>
                <Progress
                  value={subject.mastery}
                  className={cn(
                    "h-1.5",
                    subject.mastery >= 80
                      ? "[&>div]:bg-success"
                      : subject.mastery >= 50
                        ? "[&>div]:bg-accent"
                        : "[&>div]:bg-danger"
                  )}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {child.todayLessons}
              </p>
              <p className="text-xs text-muted-foreground">Lessons today</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <Clock className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {child.todayTimeSpent}m
              </p>
              <p className="text-xs text-muted-foreground">Time today</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
