"use client";

import { motion } from "framer-motion";
import { Skull, RotateCcw, BookOpen, ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DefeatScreenProps {
  bossName: string;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  onRetry: () => void;
  onReview: () => void;
  onReturn: () => void;
}

export function DefeatScreen({
  bossName,
  correctAnswers,
  totalQuestions,
  xpEarned,
  onRetry,
  onReview,
  onReturn,
}: DefeatScreenProps) {
  const progress = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-background via-[#1a0a0a] to-background z-50 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 80 }}
        className="relative z-10 w-full max-w-lg mx-auto p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-danger/20 border-2 border-danger/50 mb-6"
          >
            <Skull className="w-12 h-12 text-danger" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-black game-text text-danger mb-2"
          >
            DEFEATED...
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground"
          >
            {bossName} was too strong this time.
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 mb-8"
        >
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-card/50 border border-border">
              <span className="text-2xl font-bold game-text text-foreground">
                {correctAnswers}/{totalQuestions}
              </span>
              <span className="text-xs text-muted-foreground">Correct</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-card/50 border border-border">
              <span className="text-2xl font-bold game-text text-foreground">{progress}%</span>
              <span className="text-xs text-muted-foreground">Accuracy</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-card/50 border border-border">
              <span className="text-2xl font-bold game-text text-accent flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {xpEarned}
              </span>
              <span className="text-xs text-muted-foreground">XP Earned</span>
            </div>
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="h-2 rounded-full bg-muted overflow-hidden"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                progress >= 50
                  ? "bg-primary shadow-[0_0_10px_-2px] shadow-primary/60"
                  : "bg-danger shadow-[0_0_10px_-2px] shadow-danger/60"
              )}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-8"
        >
          <p className="text-sm text-muted-foreground italic">
            "Every defeat is a lesson. Review your concepts and come back stronger!"
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={onRetry}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retry Battle</span>
          </button>
          <button
            onClick={onReview}
            className="w-full h-12 rounded-xl bg-card border border-border text-foreground font-bold hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Concepts</span>
          </button>
          <button
            onClick={onReturn}
            className="w-full h-12 rounded-xl bg-transparent border border-border/50 text-muted-foreground font-bold hover:text-foreground hover:border-border transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Chapter</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
