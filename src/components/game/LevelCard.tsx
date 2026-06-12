"use client";

import { motion } from "framer-motion";
import {
  Lock,
  CheckCircle2,
  BookOpen,
  Gamepad2,
  Brain,
  ScrollText,
  Sword,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import type { Difficulty, LevelType } from "@/types";
import { useRouter } from "next/navigation";

const difficultyConfig: Record<Difficulty, { label: string; variant: "success" | "accent" | "danger" | "secondary" | "default" }> = {
  beginner: { label: "Beginner", variant: "success" },
  easy: { label: "Easy", variant: "success" },
  medium: { label: "Medium", variant: "accent" },
  hard: { label: "Hard", variant: "danger" },
  expert: { label: "Expert", variant: "danger" },
};

const typeIcons: Record<LevelType, { icon: React.ReactNode; label: string }> = {
  story: { icon: <BookOpen className="h-4 w-4" />, label: "Story" },
  interactive: { icon: <Gamepad2 className="h-4 w-4" />, label: "Interactive" },
  practice: { icon: <Brain className="h-4 w-4" />, label: "Practice" },
  quiz: { icon: <ScrollText className="h-4 w-4" />, label: "Quiz" },
  boss: { icon: <Sword className="h-4 w-4" />, label: "Boss" },
};

interface LevelCardProps {
  id: string;
  order: number;
  title: string;
  levelType: LevelType;
  difficulty: Difficulty;
  xpReward: number;
  status: "locked" | "available" | "completed";
}

export function LevelCard({
  id,
  order,
  title,
  levelType,
  difficulty,
  xpReward,
  status,
}: LevelCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (status !== "locked") {
      router.push(`/levels/${id}`);
    }
  };

  const diff = difficultyConfig[difficulty];
  const typeInfo = typeIcons[levelType];

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        "relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-300",
        status === "locked"
          ? "cursor-not-allowed border-border/30 opacity-50"
          : "cursor-pointer border-border hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 group",
        status === "completed" && "border-success/40"
      )}
      whileHover={
        status === "locked"
          ? undefined
          : { x: 4, scale: 1.02 }
      }
      whileTap={status === "locked" ? undefined : { scale: 0.98 }}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          status === "completed"
            ? "bg-success/20 text-success"
            : status === "available"
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground"
        )}
      >
        {status === "locked" ? (
          <Lock className="h-4 w-4" />
        ) : status === "completed" ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          order
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-sm font-semibold text-foreground">
            {title}
          </h4>
        </div>

        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            {typeInfo.icon}
            {typeInfo.label}
          </span>
          <Badge variant={diff.variant} className="text-[10px] px-1.5 py-0">
            {diff.label}
          </Badge>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-accent">
        <Star className="h-3 w-3 fill-accent" />
        {xpReward} XP
      </div>
    </motion.button>
  );
}
