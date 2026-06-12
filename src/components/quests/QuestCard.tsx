"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Star,
  Coins,
  Gift,
  CheckCircle2,
  RotateCcw,
  Zap,
  Swords,
  Calendar,
  Infinity,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressGame } from "@/components/ui/progress";
import { formatXp } from "@/lib/utils/helpers";
import type { QuestStatus } from "@/types";

interface QuestDisplay {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly" | "bonus" | "story";
  status: QuestStatus;
  xp_reward: number;
  coin_reward: number;
  item_reward: string | null;
  progress: number;
  target: number;
  expires_at: string | null;
  completed_at: string | null;
}

const typeConfig: Record<
  string,
  { icon: React.ReactNode; label: string; color: string; bg: string }
> = {
  daily: {
    icon: <RotateCcw className="h-3.5 w-3.5" />,
    label: "Daily",
    color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    bg: "bg-blue-500/5",
  },
  weekly: {
    icon: <Calendar className="h-3.5 w-3.5" />,
    label: "Weekly",
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    bg: "bg-purple-500/5",
  },
  monthly: {
    icon: <Infinity className="h-3.5 w-3.5" />,
    label: "Monthly",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    bg: "bg-amber-500/5",
  },
  bonus: {
    icon: <Zap className="h-3.5 w-3.5" />,
    label: "Bonus",
    color: "text-green-400 border-green-500/30 bg-green-500/10",
    bg: "bg-green-500/5",
  },
  story: {
    icon: <Swords className="h-3.5 w-3.5" />,
    label: "Story",
    color: "text-primary border-primary/30 bg-primary/10",
    bg: "bg-primary/5",
  },
};

interface QuestCardProps {
  quest: QuestDisplay;
  onClaim: (questId: string) => Promise<void>;
  onAbandon?: (questId: string) => Promise<void>;
}

function Timer({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    function update() {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Expired");
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setRemaining(`${days}d ${hours % 24}h`);
      } else {
        setRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (remaining === "Expired") {
    return (
      <span className="flex items-center gap-1 text-xs text-danger">
        <Clock className="h-3 w-3" />
        Expired
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Clock className="h-3 w-3 text-accent" />
      {remaining}
    </span>
  );
}

export function QuestCard({ quest, onClaim, onAbandon }: QuestCardProps) {
  const [claiming, setClaiming] = useState(false);
  const config = typeConfig[quest.type] || typeConfig.story;
  const isCompleted = quest.status === "completed";
  const isLocked = quest.status === "locked";
  const progress = quest.target > 0 ? (quest.progress / quest.target) * 100 : 0;

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await onClaim(quest.id);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isLocked ? { y: -2 } : undefined}
      className={cn(
        "relative overflow-hidden rounded-xl border p-5 transition-all duration-200",
        isCompleted
          ? "border-success/30 bg-success/5"
          : isLocked
            ? "border-border/30 bg-muted/20 opacity-60"
            : "border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("gap-1 text-xs", config.color)}>
              {config.icon}
              {config.label}
            </Badge>
            {isCompleted && (
              <Badge variant="success" className="gap-1 text-xs">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </Badge>
            )}
            {quest.expires_at && !isCompleted && (
              <Timer expiresAt={quest.expires_at} />
            )}
          </div>

          <h3
            className={cn(
              "text-base font-bold",
              isCompleted ? "text-success" : "text-foreground"
            )}
          >
            {quest.title}
          </h3>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {quest.description}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {isCompleted ? "Completed" : "Progress"}
          </span>
          <span className="font-medium text-foreground">
            {quest.progress}/{quest.target}
          </span>
        </div>
        <ProgressGame
          value={isCompleted ? 100 : progress}
          variant={isCompleted ? "success" : "primary"}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1 text-xs">
            <Star className="h-3 w-3 text-accent" />
            {formatXp(quest.xp_reward)} XP
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs">
            <Coins className="h-3 w-3 text-accent" />
            {quest.coin_reward}
          </Badge>
          {quest.item_reward && (
            <Badge variant="ghost" className="gap-1 text-xs">
              <Gift className="h-3 w-3" />
              Item
            </Badge>
          )}
        </div>

        {isCompleted ? (
          <Button
            variant="game-primary"
            size="sm"
            onClick={handleClaim}
            disabled={claiming}
            className="gap-1.5"
          >
            <Gift className="h-4 w-4" />
            {claiming ? "Claiming..." : "Claim Reward"}
          </Button>
        ) : (
          !isLocked &&
          onAbandon && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAbandon(quest.id)}
              className="text-muted-foreground"
            >
              Abandon
            </Button>
          )
        )}
      </div>
    </motion.div>
  );
}
