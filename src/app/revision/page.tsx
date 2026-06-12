"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Zap,
  Swords,
  Infinity,
  History,
  BarChart3,
  Clock,
  Target,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FlashcardArena } from "@/components/revision/FlashcardArena";
import { RapidReview } from "@/components/revision/RapidReview";

type RevisionMode = "rapid_review" | "flashcard" | "boss_rush" | "concept_marathon" | null;

interface RevisionConfig {
  mode: RevisionMode;
  subjectId: string;
  chapterId: string;
}

const revisionModes: {
  id: Exclude<RevisionMode, null>;
  label: string;
  icon: typeof BookOpen;
  desc: string;
  color: string;
  gradient: string;
}[] = [
  {
    id: "rapid_review",
    label: "Rapid Review",
    icon: Zap,
    desc: "Quick-fire questions with time pressure and streak multipliers",
    color: "text-accent border-accent/20 bg-accent/5",
    gradient: "from-accent/20 to-transparent",
  },
  {
    id: "flashcard",
    label: "Flashcard Arena",
    icon: BookOpen,
    desc: "Flip through cards, mark known/unknown, and track weak areas",
    color: "text-secondary border-secondary/20 bg-secondary/5",
    gradient: "from-secondary/20 to-transparent",
  },
  {
    id: "boss_rush",
    label: "Boss Rush",
    icon: Swords,
    desc: "Defeat bosses by answering questions correctly in sequence",
    color: "text-danger border-danger/20 bg-danger/5",
    gradient: "from-danger/20 to-transparent",
  },
  {
    id: "concept_marathon",
    label: "Concept Marathon",
    icon: Infinity,
    desc: "Endless mode — keep answering until you make a mistake",
    color: "text-success border-success/20 bg-success/5",
    gradient: "from-success/20 to-transparent",
  },
];

const subjects = [
  { id: "math", label: "Mathematics" },
  { id: "physics", label: "Physics" },
  { id: "chemistry", label: "Chemistry" },
  { id: "biology", label: "Biology" },
];

const chapters = [
  { id: "ch1", label: "Chapter 1: Basics", subjectId: "math" },
  { id: "ch2", label: "Chapter 2: Advanced", subjectId: "math" },
  { id: "ch3", label: "Chapter 3: Mechanics", subjectId: "physics" },
  { id: "ch4", label: "Chapter 4: Thermodynamics", subjectId: "physics" },
];

const revisionHistory = [
  { id: "h1", mode: "Rapid Review", cards: 15, accuracy: 80, time: "5 min", date: "Today" },
  { id: "h2", mode: "Flashcard Arena", cards: 20, accuracy: 75, time: "12 min", date: "Yesterday" },
  { id: "h3", mode: "Concept Marathon", cards: 30, accuracy: 83, time: "15 min", date: "3 days ago" },
];

export default function RevisionPage() {
  const [selectedMode, setSelectedMode] = useState<RevisionMode>(null);
  const [selectedSubject, setSelectedSubject] = useState("math");
  const [selectedChapter, setSelectedChapter] = useState("ch1");
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    if (!selectedMode) return;
    setStarted(true);
  };

  const handleBack = () => {
    setStarted(false);
    setSelectedMode(null);
  };

  if (started) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-6 gap-2"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Back to Modes
        </Button>

        <AnimatePresence mode="wait">
          {selectedMode === "flashcard" && (
            <motion.div key="flashcard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <FlashcardArena />
            </motion.div>
          )}
          {selectedMode === "rapid_review" && (
            <motion.div key="rapid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <RapidReview questions={[]} />
            </motion.div>
          )}
          {selectedMode === "boss_rush" && (
            <motion.div
              key="boss"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-6 py-24"
            >
              <Swords className="h-16 w-16 text-danger/50" />
              <div className="text-center">
                <h2 className="game-text text-2xl font-bold text-foreground">
                  Boss Rush
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Coming soon! Battle through boss encounters with your knowledge.
                </p>
              </div>
            </motion.div>
          )}
          {selectedMode === "concept_marathon" && (
            <motion.div
              key="marathon"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-6 py-24"
            >
              <Infinity className="h-16 w-16 text-success/50" />
              <div className="text-center">
                <h2 className="game-text text-2xl font-bold text-foreground">
                  Concept Marathon
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Coming soon! Endless questions to test your endurance.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
            Revision
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reinforce your learning with powerful revision tools
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
              <Target className="h-5 w-5 text-primary" />
              Select Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {revisionModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={cn(
                    "relative overflow-hidden rounded-xl border p-5 text-left transition-all duration-200",
                    selectedMode === mode.id
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                      : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br opacity-30" />
                  <div
                    className={cn(
                      "mb-3 inline-flex rounded-lg p-2.5",
                      mode.color
                    )}
                  >
                    <mode.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {mode.label}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {mode.desc}
                  </p>
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
                <BookOpen className="h-5 w-5 text-primary" />
                Subject & Chapter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-xs text-muted-foreground">Subject</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub.id)}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                        selectedSubject === sub.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-muted-foreground">Chapter</p>
                <div className="flex flex-wrap gap-2">
                  {chapters
                    .filter((ch) => ch.subjectId === selectedSubject)
                    .map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => setSelectedChapter(ch.id)}
                        className={cn(
                          "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                          selectedChapter === ch.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        )}
                      >
                        {ch.label}
                      </button>
                    ))}
                </div>
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
                <BarChart3 className="h-5 w-5 text-primary" />
                Stats Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Cards Reviewed", value: "65", icon: BookOpen, color: "text-secondary" },
                  { label: "Avg Accuracy", value: "79%", icon: Target, color: "text-success" },
                  { label: "Total Time", value: "32m", icon: Clock, color: "text-accent" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border bg-muted/50 p-3 text-center">
                    <stat.icon className={cn("mx-auto h-4 w-4", stat.color)} />
                    <p className="mt-1 text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
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
          disabled={!selectedMode}
          className="gap-3"
        >
          <Sparkles className="h-5 w-5" />
          Start Revision
          <ChevronRight className="h-5 w-5" />
        </Button>
      </motion.div>

      {revisionHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="game-text flex items-center gap-2 text-base">
                <History className="h-5 w-5 text-primary" />
                Revision History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {revisionHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-card/80"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          entry.mode === "Rapid Review"
                            ? "bg-accent/10 text-accent"
                            : entry.mode === "Flashcard Arena"
                              ? "bg-secondary/10 text-secondary"
                              : "bg-success/10 text-success"
                        )}
                      >
                        {entry.mode === "Rapid Review" ? (
                          <Zap className="h-4 w-4" />
                        ) : entry.mode === "Flashcard Arena" ? (
                          <BookOpen className="h-4 w-4" />
                        ) : (
                          <Infinity className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {entry.mode}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{entry.cards} cards</span>
                          <span>{entry.accuracy}%</span>
                          <span>{entry.time}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{entry.date}</span>
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
