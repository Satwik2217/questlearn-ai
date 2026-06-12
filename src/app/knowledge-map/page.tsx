"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  BookOpen,
  Target,
  ChevronRight,
  Sparkles,
  BarChart3,
  Swords,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KnowledgeMap } from "@/components/knowledge-map/KnowledgeMap";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ConceptNode, ConceptMastery } from "@/types";

const subjects = [
  { id: "math", label: "Mathematics", icon: Brain, color: "text-primary" },
  { id: "physics", label: "Physics", icon: BookOpen, color: "text-secondary" },
  { id: "chemistry", label: "Chemistry", icon: BarChart3, color: "text-accent" },
  { id: "biology", label: "Biology", icon: Brain, color: "text-success" },
];

const chapters = [
  { id: "ch1", label: "Chapter 1: Foundations", subjectId: "math" },
  { id: "ch2", label: "Chapter 2: Advanced Concepts", subjectId: "math" },
  { id: "ch3", label: "Chapter 3: Mechanics", subjectId: "physics" },
  { id: "ch4", label: "Chapter 4: Quantum Theory", subjectId: "physics" },
];

export default function KnowledgeMapPage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState("math");
  const [selectedChapter, setSelectedChapter] = useState("ch1");
  const [showMap, setShowMap] = useState(false);

  const handlePractice = useCallback(
    (nodeId: string) => {
      toast.success("Starting practice for concept...");
      router.push(`/levels/practice?concept=${nodeId}`);
    },
    [router]
  );

  const handleMarkReviewed = useCallback(
    (nodeId: string) => {
      toast.success("Concept marked as reviewed!");
    },
    []
  );

  const handleNodeSelect = useCallback((nodeId: string) => {
    console.log("Selected node:", nodeId);
  }, []);

  if (showMap) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="game-text text-2xl font-bold text-foreground">
              Knowledge Map
            </h1>
            <p className="text-sm text-muted-foreground">
              {subjects.find((s) => s.id === selectedSubject)?.label} &mdash;{" "}
              {chapters.find((c) => c.id === selectedChapter)?.label}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMap(false)}
            className="gap-2"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back
          </Button>
        </div>
        <div className="h-[calc(100vh-12rem)]">
          <KnowledgeMap
            nodes={[]}
            masteries={[]}
            connections={[]}
            onPractice={handlePractice}
            onMarkReviewed={handleMarkReviewed}
            onNodeSelect={handleNodeSelect}
          />
        </div>
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
            Knowledge Map
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visualize your learning journey and track concept mastery
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
              <Brain className="h-5 w-5 text-primary" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Total Concepts", value: "16", icon: Brain, color: "text-primary" },
                { label: "Mastered", value: "4", icon: Sparkles, color: "text-success" },
                { label: "In Progress", value: "3", icon: Target, color: "text-accent" },
                { label: "Overall Mastery", value: "25%", icon: BarChart3, color: "text-secondary" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-4 text-center"
                >
                  <stat.icon className={cn("mx-auto h-5 w-5", stat.color)} />
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
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
                Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {subjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 transition-all duration-200",
                      selectedSubject === sub.id
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                        : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
                    )}
                  >
                    <sub.icon className={cn("h-6 w-6", sub.color)} />
                    <span className="text-sm font-medium text-foreground">
                      {sub.label}
                    </span>
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
                <Target className="h-5 w-5 text-primary" />
                Chapter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {chapters
                  .filter((ch) => ch.subjectId === selectedSubject)
                  .map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChapter(ch.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all duration-200",
                        selectedChapter === ch.id
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                          : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
                      )}
                    >
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          {ch.label}
                        </span>
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-colors",
                          selectedChapter === ch.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
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
          onClick={() => setShowMap(true)}
          className="gap-3"
        >
          <Swords className="h-5 w-5" />
          Explore Knowledge Map
          <ChevronRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}
