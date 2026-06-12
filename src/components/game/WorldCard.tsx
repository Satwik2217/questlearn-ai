"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ProgressGame } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

interface WorldCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  progress: number;
  locked?: boolean;
  completed?: boolean;
}

const worldGradients: Record<string, string> = {
  math: "from-violet-600/20 via-violet-500/10 to-transparent",
  science: "from-emerald-600/20 via-emerald-500/10 to-transparent",
  english: "from-amber-600/20 via-amber-500/10 to-transparent",
  history: "from-rose-600/20 via-rose-500/10 to-transparent",
  geography: "from-cyan-600/20 via-cyan-500/10 to-transparent",
  default: "from-primary/20 via-primary/10 to-transparent",
};

export function WorldCard({
  id,
  name,
  description,
  icon,
  color,
  progress,
  locked = false,
  completed = false,
}: WorldCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!locked) {
      router.push(`/worlds/${id}`);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden rounded-xl border p-5 text-left transition-all duration-300",
        locked
          ? "cursor-not-allowed border-border/50 opacity-50"
          : "cursor-pointer border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 group",
        completed && "border-success/50"
      )}
      whileHover={locked ? undefined : { scale: 1.02, y: -4 }}
      whileTap={locked ? undefined : { scale: 0.98 }}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-50",
          worldGradients[id] || worldGradients.default
        )}
      />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {icon}
          </div>
          {locked && (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
          {completed && (
            <CheckCircle2 className="h-5 w-5 text-success" />
          )}
        </div>

        <div>
          <h3
            className="text-lg font-bold tracking-tight"
            style={{ color }}
          >
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium" style={{ color }}>
              {progress}%
            </span>
          </div>
          <ProgressGame
            value={progress}
            variant={
              completed
                ? "success"
                : id === "math"
                  ? "primary"
                  : id === "science"
                    ? "secondary"
                    : id === "english"
                      ? "accent"
                      : id === "history"
                        ? "danger"
                        : "primary"
            }
          />
        </div>
      </div>
    </motion.button>
  );
}
