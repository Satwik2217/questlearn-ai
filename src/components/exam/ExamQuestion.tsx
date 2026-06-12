"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  FlagOff,
  Clock,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Challenge } from "@/types";

interface ExamQuestionProps {
  question: Challenge;
  index: number;
  total: number;
  selectedAnswer: string | null;
  selectedAnswers: string[];
  onAnswer: (answer: string) => void;
  onFlag: () => void;
  isFlagged: boolean;
  onPrevious: () => void;
  onNext: () => void;
  timeRemaining?: number;
  showTimePerQuestion?: boolean;
}

export function ExamQuestion({
  question,
  index,
  total,
  selectedAnswer,
  selectedAnswers,
  onAnswer,
  onFlag,
  isFlagged,
  onPrevious,
  onNext,
  timeRemaining,
  showTimePerQuestion,
}: ExamQuestionProps) {
  const isMultipleCorrect = question.challenge_type === "mcq" && question.correct_answer.includes(",");

  const handleOptionClick = (option: string) => {
    if (isMultipleCorrect) {
      onAnswer(option);
    } else {
      onAnswer(option);
    }
  };

  const isSelected = (option: string) => {
    if (isMultipleCorrect) {
      return selectedAnswers.includes(option);
    }
    return selectedAnswer === option;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            Question {index + 1} of {total}
          </Badge>
          {isMultipleCorrect && (
            <Badge variant="secondary">Multiple Correct</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showTimePerQuestion && timeRemaining !== undefined && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span
                className={cn(
                  "font-mono",
                  timeRemaining < 30 && "text-danger",
                  timeRemaining < 60 && "text-accent"
                )}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onFlag}
            className={cn(
              "gap-2",
              isFlagged && "text-accent border border-accent/30"
            )}
          >
            {isFlagged ? (
              <FlagOff className="h-4 w-4" />
            ) : (
              <Flag className="h-4 w-4" />
            )}
            {isFlagged ? "Flagged" : "Flag for Review"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold leading-relaxed text-foreground">
          {question.question}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {question.options?.map((option, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleOptionClick(option)}
            className={cn(
              "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200",
              isSelected(option)
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition-colors",
                isSelected(option)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              )}
            >
              {isSelected(option) ? (
                isMultipleCorrect ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <div className="h-2.5 w-2.5 rounded-full bg-current" />
                )
              ) : (
                String.fromCharCode(65 + i)
              )}
            </div>
            <span className="flex-1 text-sm text-foreground">{option}</span>
            {isMultipleCorrect && isSelected(option) && (
              <X
                className="h-4 w-4 shrink-0 text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onAnswer(option);
                }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={index === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant={index === total - 1 ? "game-primary" : "default"}
          onClick={onNext}
          className="gap-2"
        >
          {index === total - 1 ? "Finish" : "Next"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
