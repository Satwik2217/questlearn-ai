"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trophy, Shuffle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MatchItem {
  id: string;
  label: string;
  category: string;
}

interface MiniGameProps {
  items: MatchItem[];
  onComplete: (score: number, total: number) => void;
}

export function MiniGame({ items, onComplete }: MiniGameProps) {
  const [shuffledItems, setShuffledItems] = useState<MatchItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [incorrect, setIncorrect] = useState<{ item: string; category: string } | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const cats = [...new Set(items.map((i) => i.category))];
    setCategories(cats);
    setShuffledItems([...items].sort(() => Math.random() - 0.5));
  }, [items]);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished) {
      onComplete(score, items.length);
    }
  }, [finished, score, items.length, onComplete]);

  const handleItemClick = useCallback((itemId: string) => {
    if (matched[itemId] || finished) return;
    setSelectedItem(itemId);
  }, [matched, finished]);

  const handleCategoryClick = useCallback((category: string) => {
    if (!selectedItem || matched[selectedItem] || finished) return;
    setSelectedCategory(category);

    const item = items.find((i) => i.id === selectedItem);
    if (item && item.category === category) {
      setMatched((prev) => ({ ...prev, [selectedItem]: category }));
      setScore((prev) => prev + 1);
      toast.success("Correct match!");
      if (Object.keys(matched).length + 1 >= items.length) {
        setTimeout(() => setFinished(true), 500);
      }
    } else {
      setIncorrect({ item: selectedItem, category });
      setTimeout(() => setIncorrect(null), 800);
      toast.error("Try again!");
    }
    setSelectedItem(null);
    setSelectedCategory(null);
  }, [selectedItem, matched, finished, items, onComplete]);

  const handleReset = () => {
    setMatched({});
    setScore(0);
    setTimeLeft(60);
    setSelectedItem(null);
    setSelectedCategory(null);
    setIncorrect(null);
    setFinished(false);
    setShuffledItems([...items].sort(() => Math.random() - 0.5));
  };

  const allMatched = Object.keys(matched).length === items.length;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shuffle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Match It!</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4 text-accent" />
            <span>
              {score}/{items.length}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className={cn(timeLeft <= 10 && "text-danger")}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {!started && !finished && (
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-sm text-muted-foreground">
            Drag items to their matching categories
          </p>
          <Button onClick={() => setStarted(true)} variant="game-primary" size="lg">
            Start Game
          </Button>
        </div>
      )}

      {started && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Items</h4>
            <div className="space-y-2">
              <AnimatePresence>
                {shuffledItems.map((item) => (
                  <motion.button
                    key={item.id}
                    layout
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left text-sm transition-all duration-200",
                      matched[item.id]
                        ? "border-success/50 bg-success/10 text-success line-through opacity-60"
                        : selectedItem === item.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-card"
                    )}
                    whileHover={matched[item.id] ? undefined : { scale: 1.02 }}
                    whileTap={matched[item.id] ? undefined : { scale: 0.98 }}
                    disabled={!!matched[item.id] || finished}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left text-sm transition-all duration-200",
                    selectedCategory === category
                      ? "border-primary bg-primary/10 text-primary"
                      : matched &&
                        Object.values(matched).includes(category)
                        ? "border-border/30 bg-background text-muted-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-card",
                    incorrect?.category === category && "border-danger bg-danger/10"
                  )}
                  disabled={
                    finished ||
                    !selectedItem ||
                    Object.values(matched).includes(category)
                  }
                >
                  <div className="flex items-center justify-between">
                    <span>{category}</span>
                    {matched &&
                      Object.entries(matched)
                        .filter(([, cat]) => cat === category)
                        .map(([itemId]) => (
                          <span key={itemId} className="text-xs text-success">
                            <CheckCircle2 className="h-3 w-3" />
                          </span>
                        ))}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {finished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-8"
        >
          {allMatched ? (
            <CheckCircle2 className="h-12 w-12 text-success" />
          ) : (
            <XCircle className="h-12 w-12 text-danger" />
          )}
          <p className="text-lg font-semibold text-foreground">
            {allMatched ? "Perfect Match!" : "Time's Up!"}
          </p>
          <p className="text-sm text-muted-foreground">
            You matched {score} out of {items.length}
          </p>
          <Button onClick={handleReset} variant="outline">
            Play Again
          </Button>
        </motion.div>
      )}
    </div>
  );
}
