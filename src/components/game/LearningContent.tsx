"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  BookOpen,
  Lightbulb,
  Brain,
  ListChecks,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressGame } from "@/components/ui/progress";

interface ContentSection {
  id: string;
  title: string;
  type: "story" | "dialogue" | "analogy" | "memory_trick" | "concept_summary" | "interactive";
  content: string;
  choices?: { label: string; correct: boolean; feedback: string }[];
  visual?: {
    icon: React.ReactNode;
    color: string;
    label: string;
  };
}

interface LearningContentProps {
  sections: ContentSection[];
  title: string;
  subjectColor?: string;
  onComplete: () => void;
  onProgress?: (sectionIndex: number) => void;
}

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 25);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="animate-pulse text-primary">|</span>
      )}
    </span>
  );
}

function StorySection({ section }: { section: ContentSection }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm leading-relaxed text-foreground">
            <TypewriterText text={section.content} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DialogueSection({ section }: { section: ContentSection }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <MessageCircle className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="mb-1 inline-block rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {section.visual?.label || "NPC"}
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm leading-relaxed text-foreground">
              <TypewriterText text={section.content} />
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnalogySection({ section }: { section: ContentSection }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="relative overflow-hidden border-accent/30 bg-gradient-to-br from-accent/5 to-accent/[0.02]">
        <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-accent/[0.06] blur-3xl" />
        <CardContent className="relative z-10 p-5">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            <Badge variant="accent" className="text-[10px]">Visual Analogy</Badge>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{section.content}</p>
          {section.visual && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${section.visual.color}20`, color: section.visual.color }}
              >
                {section.visual.icon}
              </div>
              <span className="text-sm font-medium text-foreground">{section.visual.label}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MemoryTrickSection({ section }: { section: ContentSection }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: -10 }}
      animate={{ opacity: 1, rotateX: 0 }}
    >
      <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 to-primary/[0.02]">
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-20 w-20 rounded-full bg-primary/[0.06] blur-3xl" />
        <CardContent className="relative z-10 p-5">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <Badge className="text-[10px]">Memory Trick</Badge>
          </div>
          <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium leading-relaxed text-foreground">
              <Quote className="mr-1 inline h-4 w-4 text-primary opacity-50" />
              {section.content}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ConceptSummarySection({ section }: { section: ContentSection }) {
  const points = section.content
    .split("\n")
    .filter((p) => p.trim())
    .map((p, i) => ({ id: i, text: p.trim() }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-success" />
            <h3 className="text-sm font-bold text-foreground">Key Concepts</h3>
          </div>
          <div className="mt-3 space-y-2">
            {points.map((point, i) => (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 rounded-lg border border-border bg-card p-2.5"
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-[10px] font-bold text-success">
                  {i + 1}
                </div>
                <p className="text-sm text-muted-foreground">{point.text}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InteractiveSection({
  section,
  onComplete,
}: {
  section: ContentSection;
  onComplete: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleChoice = (index: number) => {
    setSelected(index);
    setShowFeedback(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm leading-relaxed text-foreground">{section.content}</p>
      </div>

      <div className="space-y-2">
        {section.choices?.map((choice, i) => {
          const isSelected = selected === i;
          const showCorrect = showFeedback && choice.correct;
          const showWrong = showFeedback && isSelected && !choice.correct;

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => !showFeedback && handleChoice(i)}
              disabled={showFeedback}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all duration-200",
                showCorrect
                  ? "border-success/50 bg-success/10 text-success"
                  : showWrong
                    ? "border-danger/50 bg-danger/10 text-danger"
                    : isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  showCorrect
                    ? "bg-success/20 text-success"
                    : showWrong
                      ? "bg-danger/20 text-danger"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {String.fromCharCode(65 + i)}
              </div>
              <span className="flex-1">{choice.label}</span>
              {showCorrect && <Sparkles className="h-4 w-4 shrink-0" />}
            </motion.button>
          );
        })}
      </div>

      {showFeedback && selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-lg border p-3 text-sm",
            section.choices?.[selected]?.correct
              ? "border-success/30 bg-success/5 text-success"
              : "border-danger/30 bg-danger/5 text-danger"
          )}
        >
          {section.choices?.[selected]?.feedback}
          {section.choices?.[selected]?.correct && (
            <Button
              size="sm"
              variant="game-primary"
              className="mt-2 gap-1"
              onClick={onComplete}
            >
              Continue <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export function LearningContent({
  sections,
  title,
  subjectColor = "#8b5cf6",
  onComplete,
  onProgress,
}: LearningContentProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState<Record<string, boolean>>({});

  const section = sections[currentSection];
  const isLast = currentSection === sections.length - 1;
  const progress = ((currentSection + 1) / sections.length) * 100;

  const handleContinue = useCallback(() => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
      onProgress?.(currentSection + 1);
    } else {
      onComplete();
    }
  }, [currentSection, sections.length, onProgress, onComplete]);

  const renderSection = () => {
    if (!section) return null;

    switch (section.type) {
      case "story":
        return <StorySection section={section} />;
      case "dialogue":
        return <DialogueSection section={section} />;
      case "analogy":
        return <AnalogySection section={section} />;
      case "memory_trick":
        return <MemoryTrickSection section={section} />;
      case "concept_summary":
        return <ConceptSummarySection section={section} />;
      case "interactive":
        return <InteractiveSection section={section} onComplete={handleContinue} />;
      default:
        return <StorySection section={section} />;
    }
  };

  const needsManualContinue = section?.type !== "interactive" || section?.choices?.some((c) => c.correct);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="game-text text-xl font-bold text-foreground">{title}</h2>
          <span className="text-xs text-muted-foreground">
            Section {currentSection + 1} of {sections.length}
          </span>
        </div>
        <ProgressGame value={progress} variant="primary" />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrentSection(i)}
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[10px] font-medium transition-all",
              i === currentSection
                ? "bg-primary text-primary-foreground"
                : sectionProgress[s.id]
                  ? "bg-success/20 text-success"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {i + 1}
            {sectionProgress[s.id] && <Sparkles className="h-2.5 w-2.5" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>

      {needsManualContinue && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center pt-4"
        >
          <Button
            variant="game-primary"
            size="lg"
            onClick={handleContinue}
            className="gap-2 px-8"
          >
            {isLast ? "Complete" : "Continue"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
