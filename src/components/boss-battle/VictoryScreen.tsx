"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Clock, Target, ArrowRight, RotateCcw, Sparkles, Gem, Scroll } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface VictoryScreenProps {
  bossName: string;
  xpEarned: number;
  coinsEarned: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  onContinue: () => void;
  onReplay: () => void;
  loot?: { name: string; rarity: string; emoji: string }[];
  achievements?: { name: string; description: string }[];
}

function ConfettiParticle({ delay }: { delay: number }) {
  const colors = ["#8b5cf6", "#3b82f6", "#f59e0b", "#22c55e", "#ef4444", "#ec4899"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      initial={{
        x: Math.random() * window.innerWidth,
        y: -20,
        opacity: 1,
        scale: Math.random() * 0.8 + 0.4,
      }}
      animate={{
        y: window.innerHeight + 20,
        rotate: Math.random() * 720,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute w-2 h-3 rounded-sm pointer-events-none"
      style={{ backgroundColor: color }}
    />
  );
}

function CounterAnimation({ value, label, icon: Icon }: { value: number; label: string; icon: React.ElementType }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayed(value);
        clearInterval(timer);
      } else {
        setDisplayed(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-card/50 border border-border">
      <Icon className="w-5 h-5 text-primary" />
      <motion.span
        key={displayed}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-2xl font-bold game-text text-foreground"
      >
        {displayed}
        {label === "XP" && " XP"}
      </motion.span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function VictoryScreen({
  bossName,
  xpEarned,
  coinsEarned,
  correctAnswers,
  totalQuestions,
  timeTaken,
  onContinue,
  onReplay,
  loot = [],
  achievements = [],
}: VictoryScreenProps) {
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const [showLoot, setShowLoot] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLoot(true), 1500);
    const t2 = setTimeout(() => setShowAchievements(true), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-background via-[#0a0a1a] to-background z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <ConfettiParticle key={i} delay={i * 0.1} />
      ))}

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        className="relative z-10 w-full max-w-lg mx-auto p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 mb-6"
          >
            <Trophy className="w-12 h-12 text-yellow-500" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-black game-text bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent mb-2"
          >
            VICTORY!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-muted-foreground"
          >
            {bossName} has been defeated!
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          <CounterAnimation value={xpEarned} label="XP Earned" icon={Sparkles} />
          <CounterAnimation value={coinsEarned} label="Coins" icon={Gem} />
          <CounterAnimation value={correctAnswers} label="Correct" icon={Target} />
          <CounterAnimation value={accuracy} label="Accuracy %" icon={Medal} />
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2 mb-8 p-3 rounded-xl bg-card/50 border border-border"
        >
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Time: {formatTime(timeTaken)}</span>
        </motion.div>

        <AnimatePresence>
          {showLoot && loot.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-sm font-bold game-text text-accent mb-3 flex items-center gap-2">
                <Scroll className="w-4 h-4" />
                Loot Collected
              </h3>
              <div className="flex gap-2">
                {loot.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.2, type: "spring" }}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl border",
                      item.rarity === "legendary"
                        ? "border-yellow-500/50 bg-yellow-500/10"
                        : item.rarity === "epic"
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-blue-500/50 bg-blue-500/10"
                    )}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-[10px] font-bold text-foreground">{item.name}</span>
                    <span
                      className={cn(
                        "text-[8px] font-bold uppercase tracking-wider",
                        item.rarity === "legendary"
                          ? "text-yellow-500"
                          : item.rarity === "epic"
                          ? "text-purple-500"
                          : "text-blue-500"
                      )}
                    >
                      {item.rarity}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAchievements && achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              {achievements.map((ach, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/30 mb-2 animate-achievement-popup"
                >
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{ach.name}</p>
                    <p className="text-xs text-muted-foreground">{ach.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={onContinue}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onReplay}
            className="w-full h-12 rounded-xl bg-card border border-border text-foreground font-bold hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Battle</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
