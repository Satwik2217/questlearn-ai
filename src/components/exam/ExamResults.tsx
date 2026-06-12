"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Coins,
  Share2,
  RotateCcw,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressGame } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { Challenge } from "@/types";

interface QuestionResult {
  question: Challenge;
  selectedAnswer: string | null;
  selectedAnswers: string[];
  isCorrect: boolean;
}

interface ExamResultsProps {
  results: QuestionResult[];
  timeTaken: number;
  xpEarned: number;
  coinsEarned: number;
  onRetake: () => void;
  onShare?: () => void;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

function getGrade(percentage: number): { grade: string; color: string; label: string } {
  if (percentage >= 90) return { grade: "A", color: "text-success", label: "Excellent!" };
  if (percentage >= 75) return { grade: "B", color: "text-secondary", label: "Great Job!" };
  if (percentage >= 60) return { grade: "C", color: "text-accent", label: "Good Effort!" };
  if (percentage >= 40) return { grade: "D", color: "text-accent", label: "Keep Trying!" };
  return { grade: "F", color: "text-danger", label: "Needs Practice" };
}

export function ExamResults({
  results,
  timeTaken,
  xpEarned,
  coinsEarned,
  onRetake,
  onShare,
}: ExamResultsProps) {
  const totalQuestions = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const incorrectCount = results.filter(
    (r) => !r.isCorrect && r.selectedAnswer !== null
  ).length;
  const unansweredCount = results.filter(
    (r) => r.selectedAnswer === null && r.selectedAnswers.length === 0
  ).length;
  const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
  const { grade, color, label } = getGrade(accuracy);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      navigator.clipboard.writeText(
        `I scored ${correctCount}/${totalQuestions} (${Math.round(accuracy)}%) on QuestLearn AI! Grade: ${grade}`
      );
      toast.success("Results copied to clipboard!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl space-y-8"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-4"
        >
          <div
            className={cn(
              "mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 text-4xl font-bold",
              grade === "A" || grade === "B"
                ? "border-success bg-success/10"
                : grade === "C" || grade === "D"
                  ? "border-accent bg-accent/10"
                  : "border-danger bg-danger/10",
              color
            )}
          >
            {grade}
          </div>
        </motion.div>
        <h1 className="game-text text-3xl font-bold text-foreground">{label}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          You scored <span className="font-bold text-foreground">{Math.round(accuracy)}%</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Score",
            value: `${correctCount}/${totalQuestions}`,
            icon: Trophy,
            color: "text-success",
          },
          {
            label: "Accuracy",
            value: `${Math.round(accuracy)}%`,
            icon: Target,
            color: "text-secondary",
          },
          {
            label: "Time",
            value: formatTime(timeTaken),
            icon: Clock,
            color: "text-accent",
          },
          {
            label: "Grade",
            value: grade,
            icon: Star,
            color,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="rounded-xl border border-border bg-card p-4 text-center"
          >
            <stat.icon className={cn("mx-auto h-5 w-5", stat.color)} />
            <p className="mt-2 text-2xl font-bold text-foreground">
              <AnimatedCounter value={typeof stat.value === "string" ? parseInt(stat.value) || 0 : stat.value} />
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Breakdown</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2 rounded-lg bg-success/5 p-4">
            <CheckCircle2 className="h-6 w-6 text-success" />
            <span className="text-2xl font-bold text-success">
              <AnimatedCounter value={correctCount} />
            </span>
            <span className="text-xs text-muted-foreground">Correct</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg bg-danger/5 p-4">
            <XCircle className="h-6 w-6 text-danger" />
            <span className="text-2xl font-bold text-danger">
              <AnimatedCounter value={incorrectCount} />
            </span>
            <span className="text-xs text-muted-foreground">Incorrect</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg bg-muted p-4">
            <HelpCircle className="h-6 w-6 text-muted-foreground" />
            <span className="text-2xl font-bold text-muted-foreground">
              <AnimatedCounter value={unansweredCount} />
            </span>
            <span className="text-xs text-muted-foreground">Unanswered</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Rewards</h3>
        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <span className="text-xl font-bold text-accent">
              +<AnimatedCounter value={xpEarned} /> XP
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Coins className="h-6 w-6 text-accent" />
            </div>
            <span className="text-xl font-bold text-accent">
              +<AnimatedCounter value={coinsEarned} />
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Question Review
        </h3>
        <div className="space-y-3">
          {results.map((result, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border">
              <button
                onClick={() =>
                  setExpandedIndex(expandedIndex === i ? null : i)
                }
                className="flex w-full items-center justify-between bg-card p-4 text-left hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {result.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : result.selectedAnswer || result.selectedAnswers.length > 0 ? (
                    <XCircle className="h-5 w-5 text-danger" />
                  ) : (
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    Question {i + 1}
                  </span>
                  <Badge
                    variant={
                      result.isCorrect
                        ? "success"
                        : result.selectedAnswer || result.selectedAnswers.length > 0
                          ? "danger"
                          : "ghost"
                    }
                    className="text-xs"
                  >
                    {result.isCorrect
                      ? "Correct"
                      : result.selectedAnswer || result.selectedAnswers.length > 0
                        ? "Incorrect"
                        : "Unanswered"}
                  </Badge>
                </div>
                {expandedIndex === i ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {expandedIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-t border-border p-4"
                >
                  <p className="mb-3 text-sm leading-relaxed text-foreground">
                    {result.question.question}
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Your answer:{" "}
                      <span
                        className={cn(
                          "font-medium",
                          result.isCorrect ? "text-success" : "text-danger"
                        )}
                      >
                        {result.selectedAnswer || "Not answered"}
                      </span>
                    </p>
                    {!result.isCorrect && (
                      <p className="text-xs text-muted-foreground">
                        Correct answer:{" "}
                        <span className="font-medium text-success">
                          {result.question.correct_answer}
                        </span>
                      </p>
                    )}
                    {result.question.explanation && (
                      <div className="mt-3 rounded-lg bg-muted/50 p-3">
                        <p className="text-xs font-medium text-foreground">
                          Explanation
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {result.question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          variant="game-primary"
          size="lg"
          onClick={onRetake}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Retake Exam
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>
      </div>
    </motion.div>
  );
}
