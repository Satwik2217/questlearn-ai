"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Sword,
  Wand2,
  Crosshair,
  FlaskConical,
  Compass,
  Zap,
  Flame,
  Star,
  Coins,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getLevelProgress } from "@/lib/utils/helpers";
import { ProgressGame } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Profile, CharacterType } from "@/types";

const characterIcons: Record<CharacterType, React.ReactNode> = {
  knight: <Sword className="h-4 w-4" />,
  wizard: <Wand2 className="h-4 w-4" />,
  ninja: <Crosshair className="h-4 w-4" />,
  archer: <Crosshair className="h-4 w-4" />,
  scientist: <FlaskConical className="h-4 w-4" />,
  explorer: <Compass className="h-4 w-4" />,
};

const characterColors: Record<CharacterType, string> = {
  knight: "#8b5cf6",
  wizard: "#3b82f6",
  ninja: "#ef4444",
  archer: "#22c55e",
  scientist: "#f59e0b",
  explorer: "#06b6d4",
};

interface PlayerProfileProps {
  profile: Profile;
  className?: string;
}

export function PlayerProfile({ profile, className }: PlayerProfileProps) {
  const xpProgress = getLevelProgress(profile.total_xp);
  const color = characterColors[profile.character_type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
          style={{ boxShadow: `0 0 15px -3px ${color}60` }}
        >
          <Avatar className="h-12 w-12 border-2" style={{ borderColor: `${color}60` }}>
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="bg-card text-sm font-bold" style={{ color }}>
              {profile.display_name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <div
            className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-background"
            style={{ backgroundColor: color }}
          >
            {characterIcons[profile.character_type]}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-foreground">
              {profile.display_name}
            </h3>
            <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
              Lv.{profile.level}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {profile.total_xp.toLocaleString()} XP
          </p>
          <div className="mt-1.5">
            <ProgressGame value={xpProgress * 100} variant="accent" />
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1">
          <Zap className="h-3 w-3 text-accent" />
          <span className="text-[10px] font-medium text-foreground">{profile.total_xp.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1">
          <Coins className="h-3 w-3 text-accent" />
          <span className="text-[10px] font-medium text-foreground">{profile.coins}</span>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1">
          <Flame className="h-3 w-3 text-danger" />
          <span className="text-[10px] font-medium text-foreground">{profile.streak_days}d</span>
        </div>
      </div>
    </motion.div>
  );
}
