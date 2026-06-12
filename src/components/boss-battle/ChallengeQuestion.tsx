"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { BossChallenge, BattleState } from "@/types";

interface ChallengeQuestionProps {
  challenge: BossChallenge;
  questionIndex: number;
  totalQuestions: number;
  battleState: BattleState;
  onAnswer: (correct: boolean) => void;
}

export function ChallengeQuestion({
  challenge,
  questionIndex,
  totalQuestions,
  battleState,
  onAnswer,
}: ChallengeQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMCQ = challenge.options && challenge.options.length > 0;

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setIsCorrect(false);
    setInputValue("");
  }, [challenge.id]);

  const handleAnswer = useCallback((answer: string) => {
    if (isSubmitting || showResult) return;
    setIsSubmitting(true);

    const correct = answer.trim().toLowerCase() === challenge.correct_answer.trim().toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    setSelectedAnswer(answer);

    setTimeout(() => {
      onAnswer(correct);
      setIsSubmitting(false);
    }, 1500);
  }, [challenge.correct_answer, isSubmitting, showResult, onAnswer]);

  const handleMCQClick = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
    handleAnswer(option);
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim() || showResult) return;
    handleAnswer(inputValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-muted-foreground">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                i < questionIndex
                  ? "bg-success"
                  : i === questionIndex
                  ? "bg-primary animate-pulse"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={cn(
              "rounded-xl border p-6 mb-6 transition-all duration-300",
              showResult
                ? isCorrect
                  ? "border-success/50 bg-success/5 shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]"
                  : "border-danger/50 bg-danger/5 shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]"
                : "border-border bg-card shadow-lg shadow-black/20"
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">
                {showResult ? (isCorrect ? "🎯" : "💔") : "⚔️"}
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground game-text mb-2">
                  {challenge.question}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Concept: {challenge.concept} · Difficulty: {challenge.difficulty}
                </p>
              </div>
            </div>
          </div>

          {isMCQ ? (
            <div className="grid grid-cols-1 gap-3">
              {challenge.options!.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === challenge.correct_answer;
                let optionStyle = "border-border bg-card hover:border-primary/50 hover:bg-primary/5";

                if (showResult) {
                  if (isCorrectOption) {
                    optionStyle = "border-success bg-success/10 shadow-[0_0_15px_-5px_rgba(34,197,94,0.4)]";
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = "border-danger bg-danger/10 shadow-[0_0_15px_-5px_rgba(239,68,68,0.4)]";
                  } else {
                    optionStyle = "border-border bg-card/50 opacity-50";
                  }
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                    onClick={() => handleMCQClick(option)}
                    disabled={showResult}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer",
                      optionStyle
                    )}
                  >
                    <span
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                        showResult && isCorrectOption
                          ? "bg-success/20 text-success"
                          : showResult && isSelected && !isCorrectOption
                          ? "bg-danger/20 text-danger"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {showResult
                        ? isCorrectOption
                          ? "✓"
                          : isSelected
                          ? "✗"
                          : String.fromCharCode(65 + idx)
                        : String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm text-foreground">{option}</span>
                    {showResult && isCorrectOption && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-success text-xl"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer..."
                disabled={showResult}
                className="flex-1 h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none disabled:opacity-50"
              />
              <button
                onClick={handleInputSubmit}
                disabled={!inputValue.trim() || showResult}
                className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>Submit</span>
                <span className="text-xs opacity-70">↵</span>
              </button>
            </div>
          )}

          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div
                className={cn(
                  "rounded-xl p-4 border",
                  isCorrect
                    ? "border-success/30 bg-success/5"
                    : "border-danger/30 bg-danger/5"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-lg font-bold game-text", isCorrect ? "text-success" : "text-danger")}>
                    {isCorrect ? "HIT! +5 Damage" : "MISS! Boss counter-attacks!"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{challenge.explanation}</p>
                {!isCorrect && (
                  <p className="text-xs text-success">
                    Correct answer: <span className="font-bold">{challenge.correct_answer}</span>
                  </p>
                )}
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  {showExplanation ? "Hide" : "Show"} detailed explanation
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
