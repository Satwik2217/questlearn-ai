"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Flame,
  Medal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatXp, getLevelProgress } from "@/lib/utils/helpers";
import type { Profile } from "@/types";

interface LeaderboardEntry {
  rank: number;
  profile: Profile;
  achievement_count: number;
  streak_days: number;
  isCurrentUser?: boolean;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  loading?: boolean;
}

const podiumColors = [
  "from-amber-400 to-yellow-500 shadow-amber-400/30",
  "from-slate-300 to-gray-400 shadow-slate-300/30",
  "from-amber-700 to-amber-800 shadow-amber-700/30",
];

export function LeaderboardTable({
  entries,
  currentUserId,
  loading,
}: LeaderboardTableProps) {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.rank - b.rank),
    [entries]
  );

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {paginated.map((entry) => {
          const isPodium = entry.rank <= 3;
          const isCurrent = entry.profile.id === currentUserId;
          const progress = getLevelProgress(entry.profile.total_xp);

          return (
            <motion.div
              key={entry.profile.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn(
                "flex items-center gap-4 rounded-xl border p-4 transition-all duration-200",
                isCurrent
                  ? "border-primary/50 bg-primary/5 shadow-[0_0_15px_-3px] shadow-primary/20"
                  : "border-border bg-card hover:bg-muted/50"
              )}
            >
              <div className="flex w-10 shrink-0 items-center justify-center">
                {isPodium ? (
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br shadow-lg",
                      podiumColors[entry.rank - 1]
                    )}
                  >
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">
                    #{entry.rank}
                  </span>
                )}
              </div>

              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage src={entry.profile.avatar_url || undefined} />
                <AvatarFallback>
                  {entry.profile.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {entry.profile.display_name}
                  </span>
                  {isCurrent && (
                    <Badge variant="default" className="h-5 px-1.5 text-[10px]">
                      You
                    </Badge>
                  )}
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    Lv.{entry.profile.level}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <Progress value={progress * 100} className="h-1.5 flex-1 max-w-[120px]" />
                  <span className="text-xs text-muted-foreground">
                    {formatXp(entry.profile.total_xp)} XP
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Medal className="h-3.5 w-3.5" />
                  {entry.achievement_count}
                </div>
                <div className="flex items-center gap-1 text-xs text-accent">
                  <Flame className="h-3.5 w-3.5" />
                  {entry.streak_days}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
