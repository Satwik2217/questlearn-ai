"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Zap,
  Coins,
  Flame,
  BookOpen,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  color: string;
  delay?: number;
}

function StatCard({ icon, label, value, suffix = "", color, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:shadow-lg"
      style={{
        boxShadow: `0 0 20px -10px ${color}40`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-[0.08] blur-2xl transition-all duration-500 group-hover:opacity-[0.15]"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span
              className="game-text text-2xl font-bold transition-colors"
              style={{ color }}
            >
              {displayValue}
            </span>
            {suffix && (
              <span className="text-sm text-muted-foreground">{suffix}</span>
            )}
          </div>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
      </div>

      <div
        className="mt-3 h-px w-0 transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(90deg, ${color}80, transparent)`,
        }}
      />
    </motion.div>
  );
}

interface StatsOverviewProps {
  level: number;
  totalXp: number;
  xpToNextLevel: number;
  coins: number;
  streakDays: number;
  subjectsMastered: number;
}

export function StatsOverview({
  level,
  totalXp,
  xpToNextLevel,
  coins,
  streakDays,
  subjectsMastered,
}: StatsOverviewProps) {
  const xpProgress = xpToNextLevel > 0
    ? Math.min(100, Math.round((totalXp / xpToNextLevel) * 100))
    : 0;

  const circularProgress = Math.min(100, (level % 10) * 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="game-text text-lg font-bold text-foreground">
          Player Stats
        </h2>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
          className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1"
        >
          <Zap className="h-4 w-4 text-accent" />
          <span className="game-text text-xs font-bold text-accent">
            Level {level}
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          icon={<Trophy className="h-5 w-5" />}
          label="Level Progress"
          value={circularProgress}
          suffix="%"
          color="#8b5cf6"
          delay={0.05}
        />
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          label="Total XP"
          value={totalXp}
          suffix={`/${xpToNextLevel}`}
          color="#f59e0b"
          delay={0.1}
        />
        <StatCard
          icon={<Coins className="h-5 w-5" />}
          label="Coins"
          value={coins}
          color="#22c55e"
          delay={0.15}
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Streak Days"
          value={streakDays}
          suffix="days"
          color="#ef4444"
          delay={0.2}
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Subjects"
          value={subjectsMastered}
          suffix="mastered"
          color="#3b82f6"
          delay={0.25}
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="XP Progress"
          value={xpProgress}
          suffix="%"
          color="#8b5cf6"
          delay={0.3}
        />
      </div>
    </div>
  );
}
