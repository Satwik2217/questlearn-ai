"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Swords,
  BookOpen,
  Beaker,
  Target,
  History,
  Clock,
  Sparkles,
  ChevronRight,
  Timer,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ExamEngine } from "@/components/exam/ExamEngine";
import type { Difficulty } from "@/types";

type ExamType = "chapter_test" | "subject_test" | "mock_exam" | "board_pattern";

interface ExamConfig {
  subjectId: string;
  chapterId: string;
  examType: ExamType;
  difficulty: Difficulty;
  duration: number;
  questionCount: number;
}

const examTypes: { id: ExamType; label: string; icon: typeof Swords; desc: string; color: string }[] = [
  {
    id: "chapter_test",
    label: "Chapter Test",
    icon: BookOpen,
    desc: "Test your knowledge of a specific chapter",
    color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  },
  {
    id: "subject_test",
    label: "Subject Test",
    icon: Beaker,
    desc: "Comprehensive test on an entire subject",
    color: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  },
  {
    id: "mock_exam",
    label: "Mock Exam",
    icon: Swords,
    desc: "Full-length mock examination",
    color: "text-red-400 border-red-500/20 bg-red-500/5",
  },
  {
    id: "board_pattern",
    label: "Board Pattern",
    icon: Target,
    desc: "Board exam pattern with marking scheme",
    color: "text-green-400 border-green-500/20 bg-green-500/5",
  },
];

const difficulties: { id: Difficulty; label: string; color: string }[] = [
  { id: "beginner", label: "Beginner", color: "text-success" },
  { id: "easy", label: "Easy", color: "text-secondary" },
  { id: "medium", label: "Medium", color: "text-accent" },
  { id: "hard", label: "Hard", color: "text-danger" },
  { id: "expert", label: "Expert", color: "text-danger" },
];

const durationOptions = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" },
];

const questionCountOptions = [5, 10, 15, 20, 25, 30, 40, 50];

const previousResults = [
  {
    id: "r1",
    subject: "Mathematics",
    type: "Chapter Test",
    score: "8/10",
    accuracy: 80,
    date: "2 days ago",
    grade: "B",
  },
  {
    id: "r2",
    subject: "Physics",
    type: "Subject Test",
    score: "15/20",
    accuracy: 75,
    date: "1 week ago",
    grade: "C",
  },
  {
    id: "r3",
    subject: "Chemistry",
    type: "Mock Exam",
    score: "42/50",
    accuracy: 84,
    date: "2 weeks ago",
    grade: "B",
  },
];

export default function ExamPage() {
  const [selectedType, setSelectedType] = useState<ExamType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(10);
  const [showEngine, setShowEngine] = useState(false);

  const handleStart = () => {
    if (!selectedType) return;
    setShowEngine(true);
  };

  if (showEngine && selectedType) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <ExamEngine
          config={{
            subjectId: "math",
            chapterId: "ch1",
            examType: selectedType,
            difficulty: selectedDifficulty,
            duration: selectedDuration,
            questionCount: selectedQuestionCount,
          }}
          onExit={() => setShowEngine(false)}
          onSaveResults={(results) => {
            console.log("Results saved:", results);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="game-text text-3xl font-bold text-foreground">
            Exam Mode
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Test your knowledge with timed examinations
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="game-text flex items-center gap-2 text-base">
              <Swords className="h-5 w-5 text-primary" />
              Exam Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {examTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-200",
                    selectedType === type.id
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                      : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
                  )}
                >
                  <div className={cn("mb-3 inline-flex rounded-lg p-2", type.color)}>
                    <type.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {type.label}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{type.desc}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="game-text flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-primary" />
                Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                      selectedDifficulty === diff.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="game-text flex items-center gap-2 text-base">
                <Timer className="h-5 w-5 text-primary" />
                Timer Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Duration</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {durationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedDuration(opt.value)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                        selectedDuration === opt.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Questions</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {questionCountOptions.map((count) => (
                    <button
                      key={count}
                      onClick={() => setSelectedQuestionCount(count)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                        selectedQuestionCount === count
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <Button
          variant="game-primary"
          size="xl"
          onClick={handleStart}
          disabled={!selectedType}
          className="gap-3"
        >
          <Swords className="h-5 w-5" />
          Start Exam
          <ChevronRight className="h-5 w-5" />
        </Button>
      </motion.div>

      {previousResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="game-text flex items-center gap-2 text-base">
                <History className="h-5 w-5 text-primary" />
                Previous Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previousResults.map((result, i) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-card/80"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                          result.grade === "A"
                            ? "bg-success/10 text-success"
                            : result.grade === "B"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-accent/10 text-accent"
                        )}
                      >
                        {result.grade}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {result.subject} &mdash; {result.type}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{result.score}</span>
                          <span>{result.accuracy}%</span>
                          <span>{result.date}</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        result.accuracy >= 80
                          ? "success"
                          : result.accuracy >= 60
                            ? "accent"
                            : "danger"
                      }
                    >
                      {result.accuracy}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
