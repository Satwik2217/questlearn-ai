"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sword,
  Trophy,
  Star,
  ScrollText,
  BookOpen,
  Gamepad2,
  Brain,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressGame } from "@/components/ui/progress";
import { LevelCard } from "@/components/game/LevelCard";
import { cn } from "@/lib/utils/cn";
import type { Difficulty, LevelType } from "@/types";

interface MockLevel {
  id: string;
  order: number;
  title: string;
  levelType: LevelType;
  difficulty: Difficulty;
  xpReward: number;
  status: "locked" | "available" | "completed";
}

const mockLevels: MockLevel[] = [
  {
    id: "l1",
    order: 1,
    title: "The Journey Begins",
    levelType: "story",
    difficulty: "beginner",
    xpReward: 100,
    status: "completed",
  },
  {
    id: "l2",
    order: 2,
    title: "Interactive Discovery",
    levelType: "interactive",
    difficulty: "easy",
    xpReward: 150,
    status: "completed",
  },
  {
    id: "l3",
    order: 3,
    title: "Practice Makes Perfect",
    levelType: "practice",
    difficulty: "easy",
    xpReward: 120,
    status: "completed",
  },
  {
    id: "l4",
    order: 4,
    title: "Knowledge Check",
    levelType: "quiz",
    difficulty: "medium",
    xpReward: 200,
    status: "available",
  },
  {
    id: "l5",
    order: 5,
    title: "Final Challenge",
    levelType: "quiz",
    difficulty: "medium",
    xpReward: 250,
    status: "locked",
  },
];

const difficultyConfig: Record<Difficulty, { label: string; variant: "success" | "accent" | "danger" | "secondary" | "default" }> = {
  beginner: { label: "Beginner", variant: "success" },
  easy: { label: "Easy", variant: "success" },
  medium: { label: "Medium", variant: "accent" },
  hard: { label: "Hard", variant: "danger" },
  expert: { label: "Expert", variant: "danger" },
};

export default function ChapterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;

  const completedLevels = mockLevels.filter((l) => l.status === "completed").length;
  const chapterProgress = Math.round((completedLevels / mockLevels.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-8"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="relative z-10 p-6 md:p-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/worlds/math")}
            className="mb-4 h-8 gap-1 text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to World
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <ScrollText className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h1 className="game-text text-2xl font-bold text-foreground md:text-3xl">
                Linear Equations
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Solve equations and understand their graphs. Master the art of
                balancing both sides of an equation.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Progress</span>
              <span className="game-text font-bold text-foreground">
                {chapterProgress}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Total XP</span>
              <span className="font-medium text-foreground">
                {mockLevels.reduce((sum, l) => sum + l.xpReward, 0)} XP
              </span>
            </div>
            <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">
              {chapterProgress >= 100 ? "Completed" : `${completedLevels}/${mockLevels.length} Levels`}
            </Badge>
          </div>

          <div className="mt-4">
            <ProgressGame value={chapterProgress} variant="primary" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="game-text text-lg font-bold text-foreground">
          Level Progression
        </h2>

        <div className="space-y-1">
          {mockLevels.map((level, index) => (
            <div key={level.id} className="relative">
              {index < mockLevels.length - 1 && (
                <div
                  className={cn(
                    "absolute left-5 top-14 h-6 w-px",
                    level.status === "completed"
                      ? "bg-gradient-to-b from-success/60 to-success/20"
                      : "bg-gradient-to-b from-border to-border/30"
                  )}
                />
              )}
              <LevelCard
                id={level.id}
                order={level.order}
                title={level.title}
                levelType={level.levelType}
                difficulty={level.difficulty}
                xpReward={level.xpReward}
                status={level.status}
              />
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative overflow-hidden rounded-xl border border-danger/30 bg-gradient-to-br from-danger/10 via-transparent to-transparent p-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger/20 text-danger">
            <Sword className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">Boss Battle</h3>
            <p className="text-sm text-muted-foreground">
              Defeat the Equation Lord to complete this chapter!
            </p>
          </div>
          <Button
            variant="game-primary"
            size="lg"
            className="shrink-0 gap-2"
            disabled={chapterProgress < 100}
            onClick={() => router.push(`/boss-battle/${chapterId}`)}
          >
            Enter Battle
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
