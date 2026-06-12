"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface BossCharacterProps {
  name: string;
  hp: number;
  maxHp: number;
  phase: string;
  imageUrl?: string | null;
  element?: "fire" | "ice" | "lightning" | "shadow" | "arcane";
}

const BOSS_EMOJIS: Record<string, string> = {
  dragon: "🐉",
  demon: "👹",
  phoenix: "🐦‍🔥",
  kraken: "🐙",
  titan: "🗿",
  lich: "💀",
  chimera: "🦁",
  hydra: "🐍",
  golem: "🪨",
  warlock: "🧙",
  default: "👾",
};

const ELEMENT_COLORS: Record<string, { primary: string; glow: string; aura: string }> = {
  fire: { primary: "#ef4444", glow: "rgba(239,68,68,0.4)", aura: "rgba(239,68,68,0.15)" },
  ice: { primary: "#06b6d4", glow: "rgba(6,182,212,0.4)", aura: "rgba(6,182,212,0.15)" },
  lightning: { primary: "#eab308", glow: "rgba(234,179,8,0.4)", aura: "rgba(234,179,8,0.15)" },
  shadow: { primary: "#a855f7", glow: "rgba(168,85,247,0.4)", aura: "rgba(168,85,247,0.15)" },
  arcane: { primary: "#3b82f6", glow: "rgba(59,130,246,0.4)", aura: "rgba(59,130,246,0.15)" },
};

function getBossEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(BOSS_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return BOSS_EMOJIS.default;
}

export function BossCharacter({
  name,
  hp,
  maxHp,
  phase,
  imageUrl,
  element = "shadow",
}: BossCharacterProps) {
  const [isHit, setIsHit] = useState(false);
  const [isDefeated, setIsDefeated] = useState(false);
  const [isUsingSpecial, setIsUsingSpecial] = useState(false);

  const hpPercent = hp / maxHp;
  const scale = 0.6 + hpPercent * 0.4;
  const colors = ELEMENT_COLORS[element] || ELEMENT_COLORS.shadow;

  useEffect(() => {
    if (phase === "boss_turn") {
      setIsUsingSpecial(true);
      const timer = setTimeout(() => setIsUsingSpecial(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (hp <= 0) {
      setIsDefeated(true);
    }
  }, [hp]);

  const handleHit = () => {
    setIsHit(true);
    setTimeout(() => setIsHit(false), 500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <AnimatePresence>
        {isUsingSpecial && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: [0, 0.6, 0] }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)` }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="relative"
        animate={{
          scale: isDefeated ? 0 : scale,
          opacity: isDefeated ? 0 : 1,
          rotate: isHit ? [0, -5, 5, -3, 3, 0] : 0,
        }}
        transition={{
          scale: { duration: 0.3 },
          rotate: isHit ? { duration: 0.5 } : { duration: 0.3 },
        }}
      >
        <div
          className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
          style={{ background: colors.aura }}
        />

        <motion.div
          animate={
            isDefeated
              ? { opacity: 0, scale: 0, rotate: 180 }
              : { y: [0, -8, 0] }
          }
          transition={
            isDefeated
              ? { duration: 1, ease: "easeIn" }
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
          className="relative"
        >
          <div
            className={cn(
              "w-36 h-36 rounded-2xl flex items-center justify-center text-6xl border-2 relative overflow-hidden",
              isDefeated && "animate-boss-roar"
            )}
            style={{
              borderColor: colors.primary,
              background: `linear-gradient(135deg, rgba(0,0,0,0.8), ${colors.aura})`,
              boxShadow: isHit
                ? `0 0 40px ${colors.glow}, inset 0 0 40px ${colors.glow}`
                : `0 0 20px ${colors.glow}`,
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${colors.primary} 0%, transparent 70%)`,
              }}
            />
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-24 h-24 object-contain relative z-10"
              />
            ) : (
              <span className="relative z-10">{getBossEmoji(name)}</span>
            )}
          </div>
        </motion.div>

        {isHit && (
          <motion.div
            initial={{ opacity: 1, scale: 1.5 }}
            animate={{ opacity: 0, scale: 2.5 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className="w-full h-full rounded-2xl"
              style={{
                background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
              }}
            />
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="mt-4 text-center"
        animate={{ opacity: isDefeated ? 0 : 1 }}
      >
        <motion.h3
          className="text-xl font-bold game-text tracking-wider"
          style={{ color: colors.primary, textShadow: `0 0 10px ${colors.glow}` }}
          animate={isHit ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {name}
        </motion.h3>

        {isDefeated && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="mt-2 px-4 py-1 rounded-full bg-danger/20 border border-danger/50"
          >
            <span className="text-sm font-bold text-danger game-text">DEFEATED!</span>
          </motion.div>
        )}
      </motion.div>

      {isDefeated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 pointer-events-none"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: colors.primary,
                boxShadow: `0 0 6px ${colors.primary}`,
                top: "50%",
                left: "50%",
              }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 1.5, delay: Math.random() * 0.5 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
