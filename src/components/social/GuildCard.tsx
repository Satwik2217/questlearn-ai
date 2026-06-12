"use client";

import { motion } from "framer-motion";
import { Shield, Users, Trophy, Plus, LogIn, Eye, Crown, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressGame } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface GuildCardProps {
  id: string;
  name: string;
  emblem?: string;
  memberCount: number;
  maxMembers?: number;
  level: number;
  xp: number;
  xpToNext: number;
  description: string;
  isMember?: boolean;
  isOwner?: boolean;
  onJoin?: (guildId: string) => void;
  onView?: (guildId: string) => void;
  onLeave?: (guildId: string) => void;
  index?: number;
}

export function GuildCard({
  id,
  name,
  emblem,
  memberCount,
  maxMembers = 50,
  level,
  xp,
  xpToNext,
  description,
  isMember = false,
  isOwner = false,
  onJoin,
  onView,
  onLeave,
  index = 0,
}: GuildCardProps) {
  const xpProgress = xpToNext > 0 ? Math.min(100, Math.round((xp / xpToNext) * 100)) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/[0.03] blur-3xl transition-all duration-500 group-hover:bg-primary/[0.06]" />

        <CardContent className="relative z-10 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 group-hover:from-primary/20 group-hover:to-primary/10">
              {emblem ? (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={emblem} />
                  <AvatarFallback className="bg-transparent text-lg font-bold text-primary">
                    {name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Shield className="h-7 w-7 text-primary" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-bold text-foreground">{name}</h3>
                {isOwner && (
                  <Badge variant="accent" className="h-5 gap-1 px-1.5 text-[10px]">
                    <Crown className="h-2.5 w-2.5" /> Owner
                  </Badge>
                )}
                {isMember && !isOwner && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    Member
                  </Badge>
                )}
              </div>

              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{description}</p>

              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {memberCount}/{maxMembers}
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5 text-accent" />
                  Level {level}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Guild XP</span>
                  <span className="font-medium text-foreground">{xp.toLocaleString()} / {xpToNext.toLocaleString()}</span>
                </div>
                <ProgressGame value={xpProgress} variant="primary" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {isMember ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => onView?.(id)}
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </Button>
                {!isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-danger hover:text-danger"
                    onClick={() => onLeave?.(id)}
                  >
                    Leave
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="game-primary"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => onJoin?.(id)}
              >
                <LogIn className="h-3.5 w-3.5" /> Join Guild
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function GuildCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 animate-pulse rounded-xl bg-muted" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="flex gap-4">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-2 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
