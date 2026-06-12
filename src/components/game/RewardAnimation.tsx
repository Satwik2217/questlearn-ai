"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, Trophy, ArrowUp, Coins, Award } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface RewardAnimationProps {
  type: "xp" | "level_up" | "coins" | "achievement";
  value?: number;
  label?: string;
  show: boolean;
  onComplete?: () => void;
}

function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            backgroundColor: ["#8b5cf6", "#3b82f6", "#f59e0b", "#22c55e", "#ef4444"][
              i % 5
            ],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: 0,
            scale: 0,
            y: -60 - Math.random() * 80,
            x: (Math.random() - 0.5) * 60,
          }}
          transition={{ duration: 1, delay: i * 0.08, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function Stars() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 60}%`,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0],
            rotate: [0, 180, 360],
            y: [-20, -40 - Math.random() * 30],
          }}
          transition={{ duration: 1.5, delay: i * 0.1 }}
        >
          <Star
            className="h-5 w-5 fill-accent text-accent"
            style={{
              filter: "drop-shadow(0 0 4px rgba(245, 158, 11, 0.6))",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function RewardAnimation({
  type,
  value = 0,
  label,
  show,
  onComplete,
}: RewardAnimationProps) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (show) {
      setVisible(true);

      if (type === "xp" || type === "coins") {
        const duration = 1200;
        const steps = 30;
        const increment = value / steps;
        let current = 0;
        let step = 0;

        const animate = () => {
          step++;
          current = Math.min(Math.round(increment * step), value);
          setCount(current);
          if (step < steps) {
            animRef.current = requestAnimationFrame(() =>
              setTimeout(animate, duration / steps)
            );
          } else {
            setTimeout(() => {
              setVisible(false);
              onComplete?.();
            }, 1500);
          }
        };
        animate();
      } else {
        const timer = setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 2500);
        return () => clearTimeout(timer);
      }

      return () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
      };
    } else {
      setVisible(false);
    }
  }, [show, type, value, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center shadow-2xl"
          >
            <Particles />
            <Stars />

            <div className="relative z-10">
              {type === "xp" && (
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-xp-glow">
                    <Sparkles className="h-12 w-12 text-accent" />
                  </div>
                  <motion.p
                    className="game-text text-4xl font-bold text-accent"
                    key={count}
                  >
                    +{count} XP
                  </motion.p>
                  {label && (
                    <p className="text-sm text-muted-foreground">{label}</p>
                  )}
                </div>
              )}

              {type === "level_up" && (
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Trophy className="h-16 w-16 text-accent" />
                  </motion.div>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="animate-level-up game-text text-3xl font-bold text-accent"
                  >
                    Level Up!
                  </motion.p>
                  <p className="text-lg text-foreground">
                    You reached level {value}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowUp className="h-4 w-4 text-success" />
                    New abilities unlocked
                  </div>
                </div>
              )}

              {type === "coins" && (
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Coins className="h-14 w-14 text-accent" />
                  </motion.div>
                  <motion.p className="game-text text-4xl font-bold text-accent">
                    +{count}
                  </motion.p>
                  <p className="text-sm text-muted-foreground">Coins earned</p>
                </div>
              )}

              {type === "achievement" && (
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Award className="h-16 w-16 text-accent" />
                  </motion.div>
                  <p className="game-text text-2xl font-bold text-foreground">
                    Achievement Unlocked!
                  </p>
                  {label && (
                    <p className="text-sm text-muted-foreground">{label}</p>
                  )}
                  {value > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-accent">
                        <Star className="h-4 w-4 fill-accent" />+{value} XP
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
