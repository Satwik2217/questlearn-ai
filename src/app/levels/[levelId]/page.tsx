"use client";

import { useState, use, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Star,
  ChevronRight,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressGame } from "@/components/ui/progress";
import { QuestChallenge } from "@/components/game/QuestChallenge";
import { RewardAnimation } from "@/components/game/RewardAnimation";
import { toast } from "sonner";
import type { Challenge, Difficulty } from "@/types";

const mockChallenges: Challenge[] = [
  {
    id: "c1",
    level_id: "l4",
    title: "Identify the Equation",
    description: "Choose the correct linear equation from the options.",
    challenge_type: "mcq",
    question: "Which of the following is a linear equation in one variable?",
    options: [
      "2x + 3 = 7",
      "x² + 2 = 5",
      "xy + 3 = 8",
      "1/x + 2 = 4",
    ],
    correct_answer: "2x + 3 = 7",
    explanation:
      "A linear equation in one variable has the form ax + b = c, where the variable is raised to the power of 1.",
    difficulty: "easy",
    points: 50,
    time_limit: 30,
    order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "c2",
    level_id: "l4",
    title: "Solve for x",
    description: "Find the value of x in the equation.",
    challenge_type: "fill_blanks",
    question:
      "Solve: 3x + 7 = 22. What is the value of x?",
    options: null,
    correct_answer: "5",
    explanation:
      "Subtract 7 from both sides: 3x = 15. Then divide both sides by 3: x = 5.",
    difficulty: "easy",
    points: 75,
    time_limit: 60,
    order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "c3",
    level_id: "l4",
    title: "Real World Scenario",
    description: "Apply linear equations to a real-world problem.",
    challenge_type: "scenario",
    question:
      "A taxi charges a base fare of $3 plus $2 per kilometer. If your total fare is $15, how many kilometers did you travel?",
    options: ["4 km", "5 km", "6 km", "7 km"],
    correct_answer: "6 km",
    explanation:
      "The equation is 3 + 2k = 15. Subtract 3: 2k = 12. Divide by 2: k = 6 kilometers.",
    difficulty: "medium",
    points: 100,
    time_limit: 90,
    order: 3,
    created_at: new Date().toISOString(),
  },
];

export default function LevelPlayPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = params.levelId as string;

  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showReward, setShowReward] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalChallenges = mockChallenges.length;
  const progress = ((currentChallenge + (currentChallenge < totalChallenges ? 0 : 0)) / totalChallenges) * 100;

  const handleChallengeComplete = useCallback(
    (correct: boolean, points: number) => {
      if (correct) {
        setCompletedChallenges((prev) => prev + 1);
        setXpEarned((prev) => prev + points);
      }

      setTimeout(() => {
        if (currentChallenge < totalChallenges - 1) {
          setCurrentChallenge((prev) => prev + 1);
        } else {
          setLevelComplete(true);
          setShowReward(true);
          handleSaveProgress(xpEarned + points);
        }
      }, 1500);
    },
    [currentChallenge, totalChallenges, xpEarned]
  );

  const handleSaveProgress = async (totalXp: number) => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Progress saved!", {
        icon: <Save className="h-4 w-4" />,
      });
    } catch {
      toast.error("Failed to save progress");
    } finally {
      setSaving(false);
    }
  };

  if (showIntro) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto flex max-w-2xl flex-col items-center justify-center py-16"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/20 text-primary"
        >
          <BookOpen className="h-12 w-12" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="game-text text-3xl font-bold text-foreground"
        >
          Knowledge Check
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-center text-muted-foreground"
        >
          Put your skills to the test! Complete the challenges below
          to earn XP and unlock the next level.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-center gap-4"
        >
          <Badge variant="accent" className="px-3 py-1">
            {totalChallenges} Challenges
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            {mockChallenges.reduce((s, c) => s + c.points, 0)} XP Available
          </Badge>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Button
            variant="game-primary"
            size="lg"
            onClick={() => setShowIntro(false)}
            className="gap-2"
          >
            Begin Challenge
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  if (levelComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto flex max-w-2xl flex-col items-center justify-center py-16"
      >
        <RewardAnimation
          type="xp"
          value={xpEarned}
          label={`Completed ${completedChallenges}/${totalChallenges} challenges`}
          show={showReward}
          onComplete={() => setShowReward(false)}
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20 text-success">
            <Star className="h-10 w-10 fill-success" />
          </div>
          <h2 className="game-text text-2xl font-bold text-foreground">
            Level Complete!
          </h2>
          <p className="text-muted-foreground">
            You earned {xpEarned} XP with{" "}
            {Math.round((completedChallenges / totalChallenges) * 100)}%
            accuracy
          </p>

          <div className="mt-4 flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/chapters/${mockChallenges[0]?.level_id}`)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Chapter
            </Button>
            <Button
              variant="game-primary"
              onClick={() => router.push("/levels/next")}
              className="gap-2"
            >
              Next Level
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const challenge = mockChallenges[currentChallenge];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="h-8 gap-1 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-accent" />
            <span className="font-medium text-accent">+{xpEarned} XP</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {currentChallenge + 1}/{totalChallenges}
          </Badge>
        </div>
      </div>

      <div>
        <ProgressGame value={(currentChallenge / totalChallenges) * 100} variant="primary" />
      </div>

      <AnimatePresence mode="wait">
        <QuestChallenge
          key={challenge.id}
          id={challenge.id}
          title={challenge.title}
          description={challenge.description}
          challengeType={challenge.challenge_type}
          question={challenge.question}
          options={challenge.options}
          correctAnswer={challenge.correct_answer}
          explanation={challenge.explanation}
          difficulty={challenge.difficulty as Difficulty}
          points={challenge.points}
          timeLimit={challenge.time_limit}
          order={challenge.order}
          onComplete={handleChallengeComplete}
        />
      </AnimatePresence>

      {saving && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-lg">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving progress...
        </div>
      )}
    </motion.div>
  );
}
