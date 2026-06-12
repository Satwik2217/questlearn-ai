"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Element = "fire" | "ice" | "lightning" | "shadow" | "arcane";

interface BattleEffectsProps {
  phase: string;
  element?: Element;
  damage?: number;
  isCritical?: boolean;
  comboCount?: number;
}

const ELEMENT_COLORS: Record<Element, string> = {
  fire: "#ef4444",
  ice: "#06b6d4",
  lightning: "#eab308",
  shadow: "#a855f7",
  arcane: "#3b82f6",
};

const ELEMENT_PARTICLES: Record<Element, string[]> = {
  fire: ["🔥", "💥", "🔥", "💫"],
  ice: ["❄️", "💎", "🧊", "✨"],
  lightning: ["⚡", "💥", "⚡", "✨"],
  shadow: ["💀", "🌑", "👁️", "✨"],
  arcane: ["✨", "💫", "🔮", "⭐"],
};

function ScreenShake({ children, trigger }: { children: React.ReactNode; trigger: boolean }) {
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShaking(true);
      const timer = setTimeout(() => setShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <motion.div
      animate={
        shaking
          ? {
              x: [0, -5, 5, -3, 3, -2, 2, 0],
              y: [0, 3, -3, 2, -2, 1, -1, 0],
            }
          : {}
      }
      transition={{ duration: 0.5 }}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

function FloatingDamage({
  damage,
  element,
  isCritical,
}: {
  damage: number;
  element?: Element;
  isCritical?: boolean;
}) {
  const color = element ? ELEMENT_COLORS[element] : "#ef4444";

  return (
    <motion.div
      initial={{ y: 0, opacity: 1, scale: 0.5 }}
      animate={{ y: -120, opacity: 0, scale: isCritical ? 1.5 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <span
        className="text-5xl font-black game-text"
        style={{
          color,
          textShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
        }}
      >
        {isCritical && "CRIT! "}-{damage}
      </span>
    </motion.div>
  );
}

function ParticleBurst({ element, trigger }: { element?: Element; trigger: boolean }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const emojis = element ? ELEMENT_PARTICLES[element] : ELEMENT_PARTICLES.fire;
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 300,
      y: (Math.random() - 0.5) * 300,
      emoji: emojis[i % emojis.length],
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 1000);
    return () => clearTimeout(timer);
  }, [trigger, element]);

  return (
    <AnimatePresence>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 pointer-events-none z-40 text-2xl"
        >
          {p.emoji}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

function FlashEffect({ trigger, color }: { trigger: boolean; color: string }) {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 pointer-events-none z-30"
          style={{ backgroundColor: color }}
        />
      )}
    </AnimatePresence>
  );
}

export function BattleEffects({
  phase,
  element = "fire",
  damage,
  isCritical,
  comboCount,
}: BattleEffectsProps) {
  const [showDamage, setShowDamage] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [flashColor, setFlashColor] = useState("");

  const isPlayerAttack = phase === "player_turn";
  const isBossAttack = phase === "boss_turn";
  const isShaking = isPlayerAttack || isBossAttack;

  useEffect(() => {
    if (isPlayerAttack) {
      const color = element ? ELEMENT_COLORS[element] : "#8b5cf6";
      setFlashColor(color);
      setShowFlash(true);
      setShowDamage(true);
      setShowBurst(true);

      const timers = [
        setTimeout(() => setShowFlash(false), 300),
        setTimeout(() => setShowDamage(false), 1500),
        setTimeout(() => setShowBurst(false), 1000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [phase, element, isPlayerAttack]);

  useEffect(() => {
    if (isBossAttack) {
      setFlashColor("#ef4444");
      setShowFlash(true);

      const timer = setTimeout(() => setShowFlash(false), 300);
      return () => clearTimeout(timer);
    }
  }, [phase, isBossAttack]);

  return (
    <>
      <ScreenShake trigger={isShaking}>
        <div style={{ width: "100%", height: "100%" }}>
          <FloatingDamage damage={damage ?? 0} element={element} isCritical={isCritical} />
          <ParticleBurst element={element} trigger={showBurst} />
          <FlashEffect trigger={showFlash} color={flashColor} />

          {comboCount !== undefined && comboCount > 1 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-8 right-8 z-40"
            >
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50">
                <span className="text-sm font-bold game-text text-yellow-400">
                  {comboCount}x Combo!
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </ScreenShake>
    </>
  );
}
