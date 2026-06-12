"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

interface HealthBarProps {
  current: number;
  maximum: number;
  label: string;
  variant: "boss" | "player";
  showShield?: boolean;
  defense?: number;
}

function DamageNumber({ value, position }: { value: number; position: "left" | "right" }) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 1, x: position === "left" ? -20 : 20 }}
      animate={{ y: -60, opacity: 0, x: position === "left" ? -40 : 40 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`absolute -top-2 ${position === "left" ? "left-0" : "right-0"} text-lg font-bold pointer-events-none z-20 ${
        value > 0 ? "text-danger drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "text-success drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
      }`}
    >
      {value > 0 ? `-${value}` : `+${Math.abs(value)}`}
    </motion.div>
  );
}

export function HealthBar({
  current,
  maximum,
  label,
  variant,
  showShield,
  defense,
}: HealthBarProps) {
  const [displayCurrent, setDisplayCurrent] = useState(current);
  const [damageNumbers, setDamageNumbers] = useState<{ id: number; value: number }[]>([]);
  const [isLow, setIsLow] = useState(false);

  const percentage = Math.max(0, (displayCurrent / maximum) * 100);
  const isBoss = variant === "boss";

  useEffect(() => {
    if (current !== displayCurrent) {
      const diff = current - displayCurrent;
      const id = Date.now();
      setDamageNumbers((prev) => [...prev, { id, value: diff }]);

      const timer = setTimeout(() => {
        setDisplayCurrent(current);
      }, 50);

      setTimeout(() => {
        setDamageNumbers((prev) => prev.filter((n) => n.id !== id));
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [current]);

  useEffect(() => {
    setIsLow(percentage < 25);
  }, [percentage]);

  const barColor = isBoss
    ? percentage < 25
      ? "bg-danger shadow-[0_0_15px_-3px] shadow-danger"
      : "bg-red-500 shadow-[0_0_15px_-3px] shadow-red-500"
    : percentage < 25
    ? "bg-danger shadow-[0_0_15px_-3px] shadow-danger"
    : "bg-success shadow-[0_0_15px_-3px] shadow-success";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold game-text ${isBoss ? "text-red-400" : "text-green-400"}`}>
            {label}
          </span>
          {showShield && defense && defense > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/30">
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] text-blue-300 font-bold">{defense}</span>
            </div>
          )}
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {displayCurrent}/{maximum}
        </span>
      </div>
      <div className="relative h-4 rounded-full bg-black/50 border border-border overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        <div
          className={`absolute inset-0 rounded-full ${isLow ? "animate-pulse-glow" : ""}`}
          style={{
            boxShadow: isLow
              ? `inset 0 0 20px ${isBoss ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.4)"}`
              : "none",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-full" />
        <AnimatePresence>
          {damageNumbers.map((n) => (
            <DamageNumber key={n.id} value={n.value} position={isBoss ? "left" : "right"} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
