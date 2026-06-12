"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Star,
  CheckCircle2,
  XCircle,
  BookOpen,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressGame } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { shuffleArray } from "@/lib/utils/helpers";
import type { Challenge } from "@/types";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  concept: string;
  difficulty: "easy" | "medium" | "hard";
}

interface FlashcardArenaProps {
  cards?: Flashcard[];
  onComplete?: (weakCards: string[]) => void;
}

function generateMockFlashcards(): Flashcard[] {
  const concepts = [
    { front: "What is Photosynthesis?", back: "Process by which plants convert sunlight, water, and CO₂ into glucose and oxygen", concept: "Biology", difficulty: "easy" as const },
    { front: "Define Newton's Second Law", back: "F = ma — Force equals mass times acceleration", concept: "Physics", difficulty: "medium" as const },
    { front: "What is the Pythagorean Theorem?", back: "a² + b² = c², where c is the hypotenuse of a right triangle", concept: "Math", difficulty: "easy" as const },
    { front: "What is DNA composed of?", back: "A double helix of nucleotides: Adenine, Thymine, Cytosine, Guanine", concept: "Biology", difficulty: "hard" as const },
    { front: "What is the Law of Conservation of Energy?", back: "Energy cannot be created or destroyed, only transformed", concept: "Physics", difficulty: "medium" as const },
    { front: "What is a Quadratic Equation?", back: "ax² + bx + c = 0, solved using x = [-b ± √(b²-4ac)]/2a", concept: "Math", difficulty: "hard" as const },
    { front: "Define Osmosis", back: "Movement of water molecules across a semi-permeable membrane from low to high solute concentration", concept: "Biology", difficulty: "medium" as const },
    { front: "What is the speed of light?", back: "Approximately 3 × 10⁸ m/s in a vacuum", concept: "Physics", difficulty: "easy" as const },
    { front: "What are the three states of matter?", back: "Solid, Liquid, and Gas (Plasma is the fourth state)", concept: "Chemistry", difficulty: "easy" as const },
    { front: "What is the pH of pure water?", back: "7 — neutral on the pH scale", concept: "Chemistry", difficulty: "easy" as const },
  ];
  return concepts.map((c, i) => ({
    ...c,
    id: `fc-${i}`,
  }));
}

export function FlashcardArena({ cards: externalCards, onComplete }: FlashcardArenaProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set());
  const [starRating, setStarRating] = useState<Record<string, number>>({});
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    setCards(externalCards?.length ? externalCards : generateMockFlashcards());
  }, [externalCards]);

  const current = cards[currentIndex];
  const remaining = cards.length - currentIndex - 1;
  const reviewed = knownCards.size + unknownCards.size;
  const progress = cards.length > 0 ? (reviewed / cards.length) * 100 : 0;

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleKnown = useCallback(() => {
    if (!current) return;
    setKnownCards((prev) => new Set(prev).add(current.id));
    setUnknownCards((prev) => {
      const next = new Set(prev);
      next.delete(current.id);
      return next;
    });
    advanceCard();
  }, [current]);

  const handleUnknown = useCallback(() => {
    if (!current) return;
    setUnknownCards((prev) => new Set(prev).add(current.id));
    setKnownCards((prev) => {
      const next = new Set(prev);
      next.delete(current.id);
      return next;
    });
    advanceCard();
  }, [current]);

  const advanceCard = () => {
    setIsFlipped(false);
    if (currentIndex >= cards.length - 1) {
      setSessionComplete(true);
      if (onComplete) {
        onComplete(Array.from(unknownCards));
      }
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
    setCards((prev) => shuffleArray(prev));
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
    setStarRating({});
    setSessionComplete(false);
    toast.success(isShuffled ? "Cards reordered" : "Cards shuffled!");
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
    setStarRating({});
    setSessionComplete(false);
    if (isShuffled) {
      setCards((prev) => shuffleArray(prev));
    }
  };

  const handleStar = (cardId: string, rating: number) => {
    setStarRating((prev) => ({
      ...prev,
      [cardId]: prev[cardId] === rating ? 0 : rating,
    }));
  };

  if (sessionComplete) {
    const weakCards = cards.filter((c) => unknownCards.has(c.id));
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg space-y-6"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <BookOpen className="h-10 w-10 text-success" />
          </div>
          <h2 className="game-text text-2xl font-bold text-foreground">
            Session Complete!
          </h2>
          <p className="mt-2 text-muted-foreground">
            You reviewed {reviewed} cards
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-center">
            <CheckCircle2 className="mx-auto h-6 w-6 text-success" />
            <p className="mt-1 text-2xl font-bold text-success">{knownCards.size}</p>
            <p className="text-xs text-muted-foreground">Known</p>
          </div>
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-center">
            <XCircle className="mx-auto h-6 w-6 text-danger" />
            <p className="mt-1 text-2xl font-bold text-danger">{unknownCards.size}</p>
            <p className="text-xs text-muted-foreground">Needs Review</p>
          </div>
        </div>

        {weakCards.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Weak Cards
            </h3>
            <div className="space-y-2">
              {weakCards.slice(0, 5).map((card) => (
                <div
                  key={card.id}
                  className="rounded-lg border border-border bg-muted/50 p-3"
                >
                  <p className="text-xs font-medium text-foreground">{card.front}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.concept}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="game-primary"
            className="flex-1 gap-2"
            onClick={handleRestart}
          >
            <RefreshCw className="h-4 w-4" />
            Review Again
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!current) return null;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {currentIndex + 1}/{cards.length}
          </Badge>
          <Badge variant="ghost" className="text-xs">
            {remaining} remaining
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShuffle}
            className={cn(isShuffled && "text-accent")}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ProgressGame value={progress} variant="primary" />

      <div className="perspective-1000" style={{ perspective: "1000px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIndex}-${isFlipped}`}
            initial={{ opacity: 0, rotateY: isFlipped ? -180 : 0 }}
            animate={{ opacity: 1, rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
            onClick={handleFlip}
            className="relative cursor-pointer"
          >
            <div
              className={cn(
                "min-h-[280px] rounded-xl border p-8 transition-all",
                isFlipped
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <div
                style={{ backfaceVisibility: "hidden" }}
                className={cn("flex flex-col items-center justify-center text-center")}
              >
                {!isFlipped ? (
                  <>
                    <BookOpen className="mb-4 h-8 w-8 text-primary/50" />
                    <h3 className="text-lg font-semibold text-foreground">
                      {current.front}
                    </h3>
                    <p className="mt-4 text-xs text-muted-foreground">
                      Tap to reveal answer
                    </p>
                  </>
                ) : (
                  <>
                    <Sparkles className="mb-4 h-8 w-8 text-accent" />
                    <p className="text-base leading-relaxed text-foreground">
                      {current.back}
                    </p>
                    <Badge variant="outline" className="mt-4">
                      {current.concept}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((star) => (
          <button
            key={star}
            onClick={() => handleStar(current.id, star)}
            className="transition-all"
          >
            <Star
              className={cn(
                "h-6 w-6",
                (starRating[current.id] ?? 0) >= star
                  ? "fill-accent text-accent"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUnknown}
            className="gap-2 border-danger/30 text-danger hover:bg-danger/10 hover:text-danger"
          >
            <XCircle className="h-4 w-4" />
            Unknown
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleKnown}
            className="gap-2 border-success/30 text-success hover:bg-success/10 hover:text-success"
          >
            <CheckCircle2 className="h-4 w-4" />
            Known
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleFlip}
          className="gap-2"
        >
          <RotateCw className="h-4 w-4" />
          Flip
        </Button>
      </div>
    </div>
  );
}
