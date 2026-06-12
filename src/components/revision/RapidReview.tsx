"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Clock,
  Flame,
  Target,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Star,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressGame } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Challenge } from "@/types";

interface RapidReviewProps {
  questions: Challenge[];
  onComplete?: (results: RapidReviewResults) => void;
  maxMistakes?: number;
  timePerQuestion?: number;
}

interface RapidReviewResults {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  maxStreak: number;
  totalXP: number;
  weakAreas: string[];
  timeTaken: number;
}

interface ReviewQuestion extends Challenge {
  isCorrect?: boolean;
}

function generateMockFlashQuestions(): Challenge[] {
  const qs = [
    { q: "What is the chemical symbol for water?", a: "H2O", exp: "Water consists of two hydrogen atoms and one oxygen atom." },
    { q: "What is the square root of 144?", a: "12", exp: "12 × 12 = 144" },
    { q: "Who wrote 'Romeo and Juliet'?", a: "William Shakespeare", exp: "Shakespeare wrote this tragic love story around 1597." },
    { q: "What is the capital of France?", a: "Paris", exp: "Paris has been the capital of France since the 10th century." },
    { q: "What is Newton's first law of motion?", a: "Inertia", exp: "An object at rest stays at rest unless acted upon by an external force." },
    { q: "What is the powerhouse of the cell?", a: "Mitochondria", exp: "Mitochondria generate most of the cell's ATP." },
    { q: "What is 15% of 200?", a: "30", exp: "15/100 × 200 = 30" },
    { q: "Which planet is known as the Red Planet?", a: "Mars", exp: "Mars gets its red color from iron oxide on its surface." },
    { q: "What is the atomic number of Carbon?", a: "6", exp: "Carbon has 6 protons in its nucleus." },
    { q: "What is the formula for speed?", a: "Distance/Time", exp: "Speed = Distance ÷ Time" },
    { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", exp: "Da Vinci painted the Mona Lisa between 1503-1519." },
    { q: "What is the largest ocean on Earth?", a: "Pacific Ocean", exp: "The Pacific covers about 63 million square miles." },
  ];
  return qs.map((q, i) => ({
    id: `rr-${i}`,
    level_id: "rapid-review",
    title: `Quick Question ${i + 1}`,
    description: q.q,
    challenge_type: "mcq" as const,
    question: q.q,
    options: [q.a, "Option B", "Option C", "Option D"],
    correct_answer: q.a,
    explanation: q.exp,
    difficulty: "easy" as const,
    points: 10,
    time_limit: null,
    order: i + 1,
    created_at: new Date().toISOString(),
  }));
}

export function RapidReview({
  questions: externalQuestions,
  onComplete,
  maxMistakes = 3,
  timePerQuestion = 10,
}: RapidReviewProps) {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [gameOver, setGameOver] = useState(false);
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [startTime] = useState(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const qs = externalQuestions?.length
      ? externalQuestions.sort(() => Math.random() - 0.5)
      : generateMockFlashQuestions().sort(() => Math.random() - 0.5);
    setQuestions(qs.map((q) => ({ ...q, isCorrect: undefined })));
  }, [externalQuestions]);

  useEffect(() => {
    if (gameOver || showFeedback) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, gameOver, showFeedback]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (timerRef.current) clearInterval(timerRef.current);
      const current = questions[currentIndex];
      if (!current) return;

      const isCorrect = answer === current.correct_answer;
      const speedBonus = Math.max(0, timeLeft * 2);

      if (isCorrect) {
        setStreak((s) => {
          const newStreak = s + 1;
          setMaxStreak((ms) => Math.max(ms, newStreak));
          return newStreak;
        });
        setScore((s) => s + current.points + speedBonus);
        setShowFeedback("correct");
      } else {
        setStreak(0);
        setMistakes((m) => m + 1);
        setShowFeedback("incorrect");
      }

      setQuestions((prev) => {
        const updated = [...prev];
        updated[currentIndex] = { ...updated[currentIndex], isCorrect };
        return updated;
      });

      setTimeout(() => {
        setShowFeedback(null);
        if (mistakes + (isCorrect ? 0 : 1) >= maxMistakes) {
          setGameOver(true);
          return;
        }
        if (currentIndex + 1 >= questions.length) {
          setGameOver(true);
          return;
        }
        setCurrentIndex((i) => i + 1);
        setTimeLeft(timePerQuestion);
      }, 1000);
    },
    [currentIndex, questions, timeLeft, mistakes, maxMistakes, timePerQuestion]
  );

  const handleRestart = () => {
    setCurrentIndex(0);
    setStreak(0);
    setMaxStreak(0);
    setMistakes(0);
    setScore(0);
    setTimeLeft(timePerQuestion);
    setGameOver(false);
    setShowFeedback(null);
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.map((q) => ({ ...q, isCorrect: undefined })));
  };

  const weakAreas = questions
    .filter((q) => q.isCorrect === false)
    .slice(0, 3)
    .map((q) => q.question.substring(0, 40));

  const totalAnswered = questions.filter((q) => q.isCorrect !== undefined).length;
  const correctCount = questions.filter((q) => q.isCorrect === true).length;
  const progress = questions.length > 0 ? (totalAnswered / questions.length) * 100 : 0;
  const multiplier = 1 + streak * 0.1;

  if (gameOver) {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const totalXP = correctCount * 15 + maxStreak * 10;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg space-y-6"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
            <Zap className="h-10 w-10 text-accent" />
          </div>
          <h2 className="game-text text-2xl font-bold text-foreground">
            Rapid Review Complete!
          </h2>
          <p className="mt-2 text-muted-foreground">
            {mistakes >= maxMistakes ? "Too many mistakes!" : "Great session!"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Score", value: score, icon: Star },
            { label: "Correct", value: correctCount, icon: CheckCircle2 },
            { label: "Best Streak", value: maxStreak, icon: Flame },
            { label: "XP Earned", value: totalXP, icon: Zap },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <stat.icon className="mx-auto h-5 w-5 text-accent" />
              <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {weakAreas.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Areas to Improve
            </h3>
            <ul className="space-y-1">
              {weakAreas.map((area, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Target className="mt-0.5 h-3 w-3 shrink-0 text-danger" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          variant="game-primary"
          size="lg"
          className="w-full gap-2"
          onClick={handleRestart}
        >
          <RotateCcw className="h-4 w-4" />
          Play Again
        </Button>
      </motion.div>
    );
  }

  const current = questions[currentIndex];
  if (!current) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Zap className="h-3 w-3 text-accent" />
            {totalAnswered}/{questions.length}
          </Badge>
          <Badge
            variant={mistakes >= maxMistakes - 1 ? "danger" : "outline"}
            className="gap-1"
          >
            <XCircle className="h-3 w-3" />
            {mistakes}/{maxMistakes}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 text-accent"
            >
              <Flame className="h-4 w-4" />
              <span className="text-sm font-bold">{streak}x</span>
            </motion.div>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span
              className={cn(
                "font-mono",
                timeLeft <= 3 && "text-danger animate-pulse"
              )}
            >
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      <ProgressGame value={progress} variant="primary" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground">
            {current.question}
          </h3>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-2">
        {current.options?.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(option)}
            disabled={showFeedback !== null}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all",
              showFeedback === "correct" && option === current.correct_answer
                ? "border-success bg-success/10"
                : showFeedback === "incorrect" && option === current.correct_answer
                  ? "border-success bg-success/10"
                  : showFeedback === "incorrect" && option === current.options?.[0]
                    ? "border-danger bg-danger/10"
                    : "border-border bg-card hover:border-primary/50",
              showFeedback !== null && "pointer-events-none"
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm font-medium text-muted-foreground">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="text-sm text-foreground">{option}</span>
            {showFeedback === "correct" && option === current.correct_answer && (
              <CheckCircle2 className="ml-auto h-5 w-5 text-success" />
            )}
            {showFeedback === "incorrect" && option === current.correct_answer && (
              <CheckCircle2 className="ml-auto h-5 w-5 text-success" />
            )}
            {showFeedback === "incorrect" && option !== current.correct_answer && option === current.options?.[0] && (
              <XCircle className="ml-auto h-5 w-5 text-danger" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Score: {score}</span>
        <span className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-accent" />
          {multiplier.toFixed(1)}x multiplier
        </span>
      </div>
    </div>
  );
}
