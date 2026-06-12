"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calculator,
  FlaskConical,
  BookOpen,
  Landmark,
  Globe,
  Sword,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressGame } from "@/components/ui/progress";
import { ChapterCard } from "@/components/game/ChapterCard";
import { cn } from "@/lib/utils/cn";
import type { Chapter, Difficulty } from "@/types";

const worldConfig: Record<
  string,
  {
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    gradient: string;
  }
> = {
  math: {
    name: "Math World",
    description: "Master numbers, algebra, geometry and more in the realm of mathematics.",
    icon: <Calculator className="h-8 w-8" />,
    color: "#8b5cf6",
    gradient: "from-violet-900/40 via-violet-800/20 to-transparent",
  },
  science: {
    name: "Science World",
    description: "Explore physics, chemistry, biology and the wonders of science.",
    icon: <FlaskConical className="h-8 w-8" />,
    color: "#22c55e",
    gradient: "from-emerald-900/40 via-emerald-800/20 to-transparent",
  },
  english: {
    name: "English Kingdom",
    description: "Unlock the power of language, literature and creative writing.",
    icon: <BookOpen className="h-8 w-8" />,
    color: "#f59e0b",
    gradient: "from-amber-900/40 via-amber-800/20 to-transparent",
  },
  history: {
    name: "History Empire",
    description: "Travel through time and discover the events that shaped our world.",
    icon: <Landmark className="h-8 w-8" />,
    color: "#ef4444",
    gradient: "from-rose-900/40 via-rose-800/20 to-transparent",
  },
  geography: {
    name: "Geography Realm",
    description: "Navigate continents, cultures, and the physical world.",
    icon: <Globe className="h-8 w-8" />,
    color: "#3b82f6",
    gradient: "from-cyan-900/40 via-cyan-800/20 to-transparent",
  },
};

const mockChapters: (Chapter & { status: "locked" | "available" | "completed" })[] = [
  {
    id: "ch1",
    subject_id: "math",
    title: "Number Foundations",
    description: "Build a strong foundation in numbers and operations.",
    order: 1,
    difficulty: "beginner",
    boss_name: "Count Zero",
    boss_description: "Master of basic arithmetic",
    boss_image_url: null,
    total_levels: 5,
    xp_reward: 500,
    created_at: new Date().toISOString(),
    status: "completed",
  },
  {
    id: "ch2",
    subject_id: "math",
    title: "Algebraic Expressions",
    description: "Learn to work with variables and expressions.",
    order: 2,
    difficulty: "easy",
    boss_name: "The Variable",
    boss_description: "Shapeshifter of unknowns",
    boss_image_url: null,
    total_levels: 5,
    xp_reward: 750,
    created_at: new Date().toISOString(),
    status: "completed",
  },
  {
    id: "ch3",
    subject_id: "math",
    title: "Linear Equations",
    description: "Solve equations and understand their graphs.",
    order: 3,
    difficulty: "medium",
    boss_name: "Equation Lord",
    boss_description: "Keeper of balanced scales",
    boss_image_url: null,
    total_levels: 4,
    xp_reward: 1000,
    created_at: new Date().toISOString(),
    status: "available",
  },
  {
    id: "ch4",
    subject_id: "math",
    title: "Geometry Fundamentals",
    description: "Explore shapes, angles, and spatial reasoning.",
    order: 4,
    difficulty: "medium",
    boss_name: "Angle Tyrant",
    boss_description: "Ruler of polygons",
    boss_image_url: null,
    total_levels: 5,
    xp_reward: 1200,
    created_at: new Date().toISOString(),
    status: "locked",
  },
  {
    id: "ch5",
    subject_id: "math",
    title: "Statistics & Probability",
    description: "Master data analysis and probability concepts.",
    order: 5,
    difficulty: "hard",
    boss_name: "Probability Demon",
    boss_description: "Master of chance and chaos",
    boss_image_url: null,
    total_levels: 4,
    xp_reward: 1500,
    created_at: new Date().toISOString(),
    status: "locked",
  },
];

export default function WorldDetailPage() {
  const params = useParams();
  const router = useRouter();
  const worldId = params.worldId as string;

  const config = worldConfig[worldId] || worldConfig.math;
  const chapters = mockChapters.filter((ch) => ch.subject_id === worldId);
  const completedChapters = chapters.filter((ch) => ch.status === "completed").length;
  const overallProgress = Math.round((completedChapters / chapters.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-8"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
            config.gradient
          )}
        />
        <div className="relative z-10 p-6 md:p-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="mb-4 h-8 gap-1 text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${config.color}20`, color: config.color }}
            >
              {config.icon}
            </div>
            <div className="flex-1">
              <h1
                className="game-text text-2xl font-bold md:text-3xl"
                style={{ color: config.color }}
              >
                {config.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {config.description}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="game-text font-bold text-foreground">
                {overallProgress}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sword className="h-4 w-4 text-danger" />
              <span className="text-muted-foreground">Chapters</span>
              <span className="font-medium text-foreground">
                {completedChapters}/{chapters.length}
              </span>
            </div>
            <Badge
              variant="outline"
              className="border-success/30 bg-success/10 text-success"
            >
              {overallProgress >= 100 ? "Completed" : "In Progress"}
            </Badge>
          </div>

          <div className="mt-4">
            <ProgressGame
              value={overallProgress}
              variant={overallProgress >= 100 ? "success" : "primary"}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="game-text text-lg font-bold text-foreground">
          Chapter Progression
        </h2>

        <div className="space-y-6">
          {chapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              id={chapter.id}
              order={chapter.order}
              title={chapter.title}
              difficulty={chapter.difficulty as Difficulty}
              bossName={chapter.boss_name}
              levelCount={chapter.total_levels}
              status={chapter.status}
              isLast={index === chapters.length - 1}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
