"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { Swords, Zap, Shield, Lightbulb } from "lucide-react";
import { ChallengeQuestion } from "./ChallengeQuestion";
import type { BossChallenge, BattleState } from "@/types";

interface AttackPanelProps {
  challenge: BossChallenge;
  questionIndex: number;
  totalQuestions: number;
  battleState: BattleState;
  onAnswer: (correct: boolean) => void;
  onSpecialAttack: () => void;
  onDefenseStance: () => void;
  onUseHint: () => void;
  hintsRemaining: number;
}

export function AttackPanel({
  challenge,
  questionIndex,
  totalQuestions,
  battleState,
  onAnswer,
  onSpecialAttack,
  onDefenseStance,
  onUseHint,
  hintsRemaining,
}: AttackPanelProps) {
  const [isDefenseActive, setIsDefenseActive] = useState(false);
  const specialReady = battleState.specialCharge >= 3;

  useEffect(() => {
    setIsDefenseActive(false);
  }, [challenge.id]);

  const handleAnswer = useCallback((correct: boolean) => {
    setIsDefenseActive(false);
    onAnswer(correct);
  }, [onAnswer]);

  const handleDefenseStance = () => {
    setIsDefenseActive(!isDefenseActive);
    onDefenseStance();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
            <Swords className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">
              Attack: {battleState.playerAttack}
            </span>
          </div>

          <button
            onClick={handleDefenseStance}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
              isDefenseActive
                ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                : "bg-card border-border text-muted-foreground hover:border-blue-500/30"
            )}
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-bold">{isDefenseActive ? "Defending" : "Defense"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {specialReady && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSpecialAttack}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 text-yellow-400 animate-pulse-glow"
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-bold game-text">SPECIAL</span>
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={onUseHint}
            disabled={hintsRemaining <= 0}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
              hintsRemaining > 0
                ? "bg-card border-border text-muted-foreground hover:border-accent/50 hover:text-accent"
                : "bg-card/50 border-border/50 text-muted-foreground/50 cursor-not-allowed"
            )}
          >
            <Lightbulb className="w-4 h-4" />
            <span className="text-xs font-bold">{hintsRemaining}</span>
          </button>
        </div>
      </div>

      <ChallengeQuestion
        challenge={challenge}
        questionIndex={questionIndex}
        totalQuestions={totalQuestions}
        battleState={battleState}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
