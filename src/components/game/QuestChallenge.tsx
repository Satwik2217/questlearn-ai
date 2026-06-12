"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, XCircle, Loader2, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { ChallengeType, Difficulty } from "@/types";
import { toast } from "sonner";

interface QuestChallengeProps {
  id: string;
  title: string;
  description: string;
  challengeType: ChallengeType;
  question: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
  points: number;
  timeLimit: number | null;
  order: number;
  onComplete: (correct: boolean, points: number) => void;
}

export function QuestChallenge({
  id,
  title,
  description,
  challengeType,
  question,
  options,
  correctAnswer,
  explanation,
  difficulty,
  points,
  timeLimit,
  order,
  onComplete,
}: QuestChallengeProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit ?? 0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!timeLimit || feedback) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLimit, feedback]);

  const handleSubmit = useCallback(() => {
    if (submitting || feedback) return;
    setSubmitting(true);

    let isCorrect = false;
    if (challengeType === "mcq") {
      isCorrect = selectedOption === correctAnswer;
    } else if (challengeType === "fill_blanks") {
      isCorrect = textInput.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    } else if (challengeType === "scenario") {
      isCorrect = selectedOption === correctAnswer;
    }

    setTimeout(() => {
      setFeedback(isCorrect ? "correct" : "incorrect");
      setSubmitting(false);
      onComplete(isCorrect, isCorrect ? points : 0);
      if (isCorrect) {
        toast.success(`+${points} points!`);
      }
    }, 800);
  }, [submitting, feedback, challengeType, selectedOption, textInput, correctAnswer, points, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Challenge {order}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {challengeType.replace("_", " ")}
          </Badge>
          <Badge variant="accent" className="text-xs">
            {points} pts
          </Badge>
        </div>
        {timeLimit && !feedback && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className={cn(timeLeft <= 5 && "text-danger")}>
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      )}

      <div className="mb-4 rounded-lg bg-muted/50 p-4">
        <p className="text-sm leading-relaxed text-foreground">{question}</p>
      </div>

      <AnimatePresence mode="wait">
        {!feedback ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {challengeType === "mcq" && options && (
              <div className="space-y-2">
                {options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedOption(option)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left text-sm transition-all duration-200",
                      selectedOption === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-card"
                    )}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}

            {challengeType === "fill_blanks" && (
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your answer..."
                className="w-full"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            )}

            {challengeType === "scenario" && options && (
              <div className="space-y-2">
                {options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedOption(option)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left text-sm transition-all duration-200",
                      selectedOption === option
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-card"
                    )}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={
                submitting ||
                (challengeType === "mcq" && !selectedOption) ||
                (challengeType === "fill_blanks" && !textInput.trim()) ||
                (challengeType === "scenario" && !selectedOption)
              }
              className="w-full"
              variant="game-primary"
              size="lg"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Submit Answer"
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg p-4",
                feedback === "correct"
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              )}
            >
              {feedback === "correct" ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <XCircle className="h-6 w-6" />
              )}
              <div>
                <p className="font-semibold">
                  {feedback === "correct" ? "Correct!" : "Not quite right"}
                </p>
                <p className="text-sm opacity-80">
                  {feedback === "correct"
                    ? `You earned +${points} points`
                    : "Keep practicing!"}
                </p>
              </div>
            </div>

            {explanation && (
              <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-3">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm text-muted-foreground">{explanation}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
