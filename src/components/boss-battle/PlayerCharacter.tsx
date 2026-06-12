"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { CharacterType } from "@/types";

interface PlayerCharacterProps {
  characterType: CharacterType;
  name: string;
  level: number;
  phase: string;
  correctAnswer?: boolean | null;
}

const CHARACTER_DATA: Record<CharacterType, { emoji: string; color: string; label: string }> = {
  knight: { emoji: "⚔️", color: "from-blue-500 to-cyan-500", label: "Knight" },
  wizard: { emoji: "🔮", color: "from-purple-500 to-pink-500", label: "Wizard" },
  ninja: { emoji: "🥷", color: "from-red-500 to-orange-500", label: "Ninja" },
  archer: { emoji: "🏹", color: "from-green-500 to-emerald-500", label: "Archer" },
  scientist: { emoji: "🧪", color: "from-yellow-500 to-amber-500", label: "Scientist" },
  explorer: { emoji: "🧭", color: "from-teal-500 to-cyan-500", label: "Explorer" },
};

export function PlayerCharacter({
  characterType,
  name,
  level,
  phase,
  correctAnswer,
}: PlayerCharacterProps) {
  const [isAttacking, setIsAttacking] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  const charData = CHARACTER_DATA[characterType] || CHARACTER_DATA.knight;

  useEffect(() => {
    if (phase === "player_turn" && correctAnswer === true) {
      setIsAttacking(true);
      const timer = setTimeout(() => setIsAttacking(false), 800);
      return () => clearTimeout(timer);
    }
  }, [phase, correctAnswer]);

  useEffect(() => {
    if (phase === "boss_turn") {
      setIsHit(true);
      const timer = setTimeout(() => setIsHit(false), 600);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "victory") {
      setIsVictory(true);
    }
  }, [phase]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <motion.div
        className="relative"
        animate={{
          x: isAttacking ? 40 : isHit ? -15 : 0,
          rotate: isHit ? [0, -10, 10, -5, 0] : 0,
          scale: isVictory ? [1, 1.15, 1] : 1,
        }}
        transition={{
          x: { duration: 0.4, ease: "easeOut" },
          rotate: { duration: 0.5 },
          scale: isVictory ? { duration: 0.6, ease: "easeOut" } : { duration: 0.3 },
        }}
      >
        <AnimatePresence>
          {isAttacking && (
            <motion.div
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 60, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute -right-8 top-1/2 -translate-y-1/2 text-3xl pointer-events-none"
            >
              💥
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={cn(
            "w-24 h-24 rounded-2xl flex items-center justify-center text-4xl border-2 relative overflow-hidden",
            isVictory && "animate-level-up"
          )}
          style={{
            borderColor: isHit ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.1)",
            background: isHit
              ? "linear-gradient(135deg, rgba(239,68,68,0.3), rgba(0,0,0,0.8))"
              : "linear-gradient(135deg, rgba(0,0,0,0.8), rgba(30,41,59,0.8))",
            boxShadow: isAttacking
              ? "0 0 30px rgba(139,92,246,0.6)"
              : isHit
              ? "0 0 30px rgba(239,68,68,0.6), inset 0 0 30px rgba(239,68,68,0.3)"
              : "0 0 15px rgba(139,92,246,0.3)",
          }}
        >
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-20",
              charData.color
            )}
          />
          <motion.span
            className="relative z-10"
            animate={
              isAttacking
                ? { scale: [1, 1.3, 1], rotate: [0, -15, 0] }
                : isVictory
                ? { rotate: [0, -10, 10, 0] }
                : { y: [0, -4, 0] }
            }
            transition={
              isAttacking
                ? { duration: 0.4 }
                : isVictory
                ? { duration: 0.6, repeat: 2 }
                : { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }
          >
            {charData.emoji}
          </motion.span>
        </div>

        {isHit && (
          <motion.div
            initial={{ opacity: 1, scale: 1.3 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-full h-full rounded-2xl bg-danger/30" />
          </motion.div>
        )}

        {isVictory && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute -top-3 -right-3 text-2xl"
          >
            👑
          </motion.div>
        )}
      </motion.div>

      <div className="mt-3 text-center">
        <p className="text-sm font-bold text-foreground">{name}</p>
        <div className="flex items-center gap-1.5 mt-1 justify-center">
          <span
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-gradient-to-r text-white",
              charData.color
            )}
          >
            {charData.label}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            Lv.{level}
          </span>
        </div>
      </div>
    </div>
  );
}
