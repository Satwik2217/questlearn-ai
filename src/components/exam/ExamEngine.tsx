"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Timer,
  ChevronLeft,
  ChevronRight,
  Send,
  Circle,
  CheckCircle2,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressGame } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ExamQuestion } from "./ExamQuestion";
import { ExamResults } from "./ExamResults";
import type { Challenge, Difficulty } from "@/types";

type ExamPhase = "intro" | "questions" | "results";

interface QuestionState {
  question: Challenge;
  selectedAnswer: string | null;
  selectedAnswers: string[];
  isFlagged: boolean;
  isCorrect: boolean;
  timeSpent: number;
}

interface ExamConfig {
  subjectId: string;
  chapterId?: string;
  examType: "chapter_test" | "subject_test" | "mock_exam" | "board_pattern";
  difficulty: Difficulty;
  duration: number;
  questionCount: number;
}

interface ExamEngineProps {
  config: ExamConfig;
  onExit: () => void;
  onSaveResults?: (results: {
    score: number;
    accuracy: number;
    timeTaken: number;
    xpEarned: number;
    coinsEarned: number;
  }) => void;
}

function generateMockQuestions(config: ExamConfig): Challenge[] {
  const topics = [
    "Algebraic Expressions",
    "Quadratic Equations",
    "Trigonometry",
    "Calculus Basics",
    "Geometry Theorems",
    "Statistics",
    "Probability",
    "Number Systems",
  ];

  return Array.from({ length: config.questionCount }, (_, i) => ({
    id: `q-${i + 1}`,
    level_id: config.chapterId || config.subjectId,
    title: `Question ${i + 1}`,
    description: `Test your knowledge of ${topics[i % topics.length]}`,
    challenge_type: "mcq" as const,
    question: `What is the value of ${["2x + 3 = 7", "sin²θ + cos²θ", "∫x²dx", "P(A∪B)"][i % 4]}?`,
    options: [
      `Option A for Q${i + 1}`,
      `Option B for Q${i + 1}`,
      `Option C for Q${i + 1}`,
      `Option D for Q${i + 1}`,
    ],
    correct_answer: `Option A for Q${i + 1}`,
    explanation: `This is the explanation for question ${i + 1}. The correct answer is Option A because it follows the fundamental principle of ${topics[i % topics.length]}.`,
    difficulty: config.difficulty,
    points: 10,
    time_limit: null,
    order: i + 1,
    created_at: new Date().toISOString(),
  }));
}

export function ExamEngine({ config, onExit, onSaveResults }: ExamEngineProps) {
  const [phase, setPhase] = useState<ExamPhase>("intro");
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(config.duration * 60);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalDuration = config.duration * 60;

  useEffect(() => {
    if (phase === "questions") {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
        setTotalTimeSpent((prev) => prev + 1);
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase]);

  const startExam = useCallback(() => {
    const mockQuestions = generateMockQuestions(config);
    setQuestions(
      mockQuestions.map((q) => ({
        question: q,
        selectedAnswer: null,
        selectedAnswers: [],
        isFlagged: false,
        isCorrect: false,
        timeSpent: 0,
      }))
    );
    setCurrentIndex(0);
    setTimeRemaining(totalDuration);
    setTotalTimeSpent(0);
    setPhase("questions");
  }, [config, totalDuration]);

  const handleAnswer = (answer: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const current = { ...updated[currentIndex] };
      const isMultipleCorrect =
        current.question.challenge_type === "mcq" &&
        current.question.correct_answer.includes(",");

      if (isMultipleCorrect) {
        const answers = current.selectedAnswers.includes(answer)
          ? current.selectedAnswers.filter((a) => a !== answer)
          : [...current.selectedAnswers, answer];
        current.selectedAnswers = answers;
      } else {
        current.selectedAnswer = current.selectedAnswer === answer ? null : answer;
      }
      updated[currentIndex] = current;
      return updated;
    });
  };

  const handleFlag = () => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        isFlagged: !updated[currentIndex].isFlagged,
      };
      return updated;
    });
  };

  const handleSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitting(true);

    const results = questions.map((q) => {
      const isMultipleCorrect =
        q.question.challenge_type === "mcq" &&
        q.question.correct_answer.includes(",");
      let isCorrect: boolean;

      if (isMultipleCorrect) {
        const correctAnswers = q.question.correct_answer.split(",").map((a) => a.trim());
        isCorrect =
          correctAnswers.length === q.selectedAnswers.length &&
          correctAnswers.every((a) => q.selectedAnswers.includes(a));
      } else {
        isCorrect = q.selectedAnswer === q.question.correct_answer;
      }

      return {
        ...q,
        isCorrect,
      };
    });

    setQuestions(results);

    const correctCount = results.filter((r) => r.isCorrect).length;
    const accuracy = results.length > 0 ? (correctCount / results.length) * 100 : 0;
    const xpEarned = Math.round(correctCount * 15 + accuracy * 2);
    const coinsEarned = Math.round(correctCount * 5);

    setTimeout(() => {
      setPhase("results");
      setIsSubmitting(false);

      if (onSaveResults) {
        onSaveResults({
          score: correctCount,
          accuracy,
          timeTaken: totalTimeSpent,
          xpEarned,
          coinsEarned,
        });
      }
    }, 500);
  }, [questions, totalTimeSpent, onSaveResults]);

  const handleAutoSubmit = useCallback(() => {
    toast("Time's up! Submitting your exam...", {
      icon: <Timer className="h-4 w-4" />,
    });
    handleSubmit();
  }, [handleSubmit]);

  useEffect(() => {
    if (timeRemaining === 0 && phase === "questions") {
      handleAutoSubmit();
    }
  }, [timeRemaining, phase, handleAutoSubmit]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const answeredCount = questions.filter(
    (q) => q.selectedAnswer !== null || q.selectedAnswers.length > 0
  ).length;
  const flaggedCount = questions.filter((q) => q.isFlagged).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const timerPercentage = (timeRemaining / totalDuration) * 100;
  const isLowTime = timeRemaining < 120;
  const isCriticalTime = timeRemaining < 60;

  if (phase === "results") {
    const results = questions.map((q) => ({
      question: q.question,
      selectedAnswer: q.selectedAnswer,
      selectedAnswers: q.selectedAnswers,
      isCorrect: q.isCorrect,
    }));

    const correctCount = results.filter((r) => r.isCorrect).length;
    const xpEarned = Math.round(correctCount * 15 + (correctCount / results.length) * 200);
    const coinsEarned = Math.round(correctCount * 5);

    return (
      <ExamResults
        results={results}
        timeTaken={totalTimeSpent}
        xpEarned={xpEarned}
        coinsEarned={coinsEarned}
        onRetake={startExam}
      />
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        {phase === "intro" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-1 flex-col items-center justify-center gap-8"
          >
            <div className="text-center">
              <h2 className="game-text text-2xl font-bold text-foreground">
                {config.examType === "chapter_test" && "Chapter Test"}
                {config.examType === "subject_test" && "Subject Test"}
                {config.examType === "mock_exam" && "Mock Exam"}
                {config.examType === "board_pattern" && "Board Pattern"}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {config.questionCount} questions &bull; {config.duration} minutes
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Read each question carefully
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  You can flag questions for review
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Exam auto-submits when time runs out
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  No negative marking
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={onExit}>
                Cancel
              </Button>
              <Button variant="game-primary" size="lg" onClick={startExam}>
                Start Exam
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <Timer
                  className={cn(
                    "h-5 w-5",
                    isCriticalTime
                      ? "text-danger animate-pulse"
                      : isLowTime
                        ? "text-accent"
                        : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "font-mono text-lg font-bold",
                    isCriticalTime
                      ? "text-danger"
                      : isLowTime
                        ? "text-accent"
                        : "text-foreground"
                  )}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="hidden flex-1 px-4 sm:block">
                <ProgressGame
                  value={timerPercentage}
                  variant={isCriticalTime ? "danger" : isLowTime ? "accent" : "primary"}
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                  {answeredCount}/{questions.length} answered
                </span>
                {flaggedCount > 0 && (
                  <Badge variant="accent" className="gap-1">
                    <Flag className="h-3 w-3" />
                    {flaggedCount}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1">
                  <ProgressGame value={progress} variant="primary" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>

              <AnimatePresence mode="wait">
                <ExamQuestion
                  key={currentIndex}
                  question={questions[currentIndex]?.question}
                  index={currentIndex}
                  total={questions.length}
                  selectedAnswer={questions[currentIndex]?.selectedAnswer ?? null}
                  selectedAnswers={questions[currentIndex]?.selectedAnswers ?? []}
                  onAnswer={handleAnswer}
                  onFlag={handleFlag}
                  isFlagged={questions[currentIndex]?.isFlagged ?? false}
                  onPrevious={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                  onNext={() => {
                    if (currentIndex === questions.length - 1) {
                      handleSubmit();
                    } else {
                      setCurrentIndex((p) => Math.min(questions.length - 1, p + 1));
                    }
                  }}
                />
              </AnimatePresence>
            </div>

            {isSubmitting && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                  <p className="text-lg font-semibold text-foreground">
                    Calculating your score...
                  </p>
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>

      {phase === "questions" && (
        <div className="w-full shrink-0 lg:w-64">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Question Palette
              </h3>
              <Badge variant="outline" className="text-xs">
                {questions.length}
              </Badge>
            </div>
            <ScrollArea className="h-[300px] lg:h-[500px]">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-medium transition-all",
                      i === currentIndex
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                        : "",
                      q.isFlagged
                        ? "border border-accent bg-accent/10 text-accent"
                        : q.selectedAnswer !== null || q.selectedAnswers.length > 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 space-y-2 border-t border-border pt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-3 w-3 rounded bg-primary" />
                Answered
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-3 w-3 rounded bg-muted" />
                Unanswered
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-3 w-3 rounded border border-accent bg-accent/10" />
                Flagged
              </div>
            </div>

            <Button
              variant="game-primary"
              className="mt-4 w-full gap-2"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Send className="h-4 w-4" />
              Submit Exam
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
