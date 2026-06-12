"use client";

import { motion } from "framer-motion";
import {
  Lock,
  CheckCircle2,
  Sword,
  Swords,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "@/types";
import { useRouter } from "next/navigation";

const difficultyConfig: Record<Difficulty, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "bg-success/20 text-success border-success/30" },
  easy: { label: "Easy", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  medium: { label: "Medium", color: "bg-accent/20 text-accent border-accent/30" },
  hard: { label: "Hard", color: "bg-danger/20 text-danger border-danger/30" },
  expert: { label: "Expert", color: "bg-red-600/20 text-red-400 border-red-600/30" },
};

interface ChapterCardProps {
  id: string;
  order: number;
  title: string;
  difficulty: Difficulty;
  bossName: string;
  levelCount: number;
  status: "locked" | "available" | "completed";
  isLast?: boolean;
}

export function ChapterCard({
  id,
  order,
  title,
  difficulty,
  bossName,
  levelCount,
  status,
  isLast = false,
}: ChapterCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (status !== "locked") {
      router.push(`/chapters/${id}`);
    }
  };

  const diff = difficultyConfig[difficulty];

  return (
    <div className="relative flex items-center gap-4">
      <motion.button
        onClick={handleClick}
        className={cn(
          "relative flex flex-1 items-center gap-4 rounded-xl border p-4 transition-all duration-300",
          status === "locked"
            ? "cursor-not-allowed border-border/30 opacity-50"
            : "cursor-pointer border-border hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 group",
          status === "completed" && "border-success/40"
        )}
        whileHover={status === "locked" ? undefined : { x: 4, scale: 1.01 }}
        whileTap={status === "locked" ? undefined : { scale: 0.99 }}
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
            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", diff.color)}>
              {diff.label}
            </Badge>
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Sword className="h-3 w-3" />
              {bossName}
            </span>
            <span className="flex items-center gap-1">
              <Swords className="h-3 w-3" />
              {levelCount} levels
            </span>
          </div>
        </div>

        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            status === "locked" ? "text-muted-foreground" : "text-primary"
          )}
        />
      </motion.button>

      {!isLast && (
        <div className="absolute -bottom-6 left-5 h-6 w-px bg-gradient-to-b from-primary/40 to-transparent" />
      )}
    </div>
  );
}
