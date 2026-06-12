"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sword, Zap, SkipForward, Play, Sparkles, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StoryScene {
  id: string;
  background: string;
  characterName?: string;
  characterDialogue?: string;
  narration?: string;
  atmosphere?: string;
}

interface StoryIntroProps {
  scenes: StoryScene[];
  title: string;
  chapterName?: string;
  onBegin: () => void;
  onSkip?: () => void;
}

function TypewriterCharacter({ text, onComplete }: { text: string; onComplete?: () => void }) {
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
    }, 30);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block h-4 w-0.5 animate-pulse bg-primary" />
      )}
    </span>
  );
}

const sceneGradients: Record<string, string> = {
  dawn: "from-amber-900/40 via-slate-900 to-slate-950",
  forest: "from-emerald-900/30 via-slate-900 to-slate-950",
  dungeon: "from-red-900/30 via-slate-900 to-slate-950",
  castle: "from-violet-900/30 via-slate-900 to-slate-950",
  cave: "from-blue-900/30 via-slate-900 to-slate-950",
  desert: "from-amber-800/30 via-slate-900 to-slate-950",
  ocean: "from-cyan-900/30 via-slate-900 to-slate-950",
  default: "from-primary/20 via-slate-900 to-slate-950",
};

function getSceneGradient(atmosphere?: string): string {
  if (!atmosphere) return sceneGradients.default;
  return sceneGradients[atmosphere.toLowerCase()] || sceneGradients.default;
}

function SceneDisplay({ scene, isActive }: { scene: StoryScene; isActive: boolean }) {
  const gradient = getSceneGradient(scene.atmosphere);
  const [narrationDone, setNarrationDone] = useState(false);
  const [dialogueDone, setDialogueDone] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/50 to-background" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6">
        {scene.narration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <p className="text-lg font-light leading-relaxed text-foreground/80 italic">
              <TypewriterCharacter
                text={scene.narration}
                onComplete={() => setNarrationDone(true)}
              />
            </p>
          </motion.div>
        )}

        {scene.characterName && scene.characterDialogue && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: narrationDone || !scene.narration ? 0 : 0.5 }}
            className="w-full max-w-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/20 text-primary shadow-lg shadow-primary/20">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                    {scene.characterName}
                  </Badge>
                  <Sparkles className="h-3 w-3 text-accent" />
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-border/60 bg-card/80 p-5 backdrop-blur-sm">
                  <p className="text-base leading-relaxed text-foreground">
                    <TypewriterCharacter
                      text={scene.characterDialogue}
                      onComplete={() => setDialogueDone(true)}
                    />
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      )}
    </motion.div>
  );
}

export function StoryIntro({
  scenes,
  title,
  chapterName,
  onBegin,
  onSkip,
}: StoryIntroProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);

  const currentSceneData = scenes[currentScene];

  const advanceScene = useCallback(() => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene((prev) => prev + 1);
      setSceneReady(false);
      setTimeout(() => setSceneReady(true), 500);
    }
  }, [currentScene, scenes.length]);

  useEffect(() => {
    setSceneReady(true);
  }, []);

  return (
    <div className="relative flex min-h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border shadow-2xl">
      <AnimatePresence mode="wait">
        {scenes.map(
          (scene, i) =>
            i === currentScene && (
              <SceneDisplay key={scene.id} scene={scene} isActive={sceneReady} />
            )
        )}
      </AnimatePresence>

      <div className="relative z-20 mb-8 mt-auto flex flex-col items-center gap-4 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="game-text text-3xl font-bold text-foreground drop-shadow-lg">
            {title}
          </p>
          {chapterName && (
            <p className="mt-1 text-sm text-muted-foreground">{chapterName}</p>
          )}
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="game-primary"
              size="xl"
              onClick={onBegin}
              className="gap-3 px-10 text-lg shadow-2xl shadow-primary/30"
            >
              <Play className="h-5 w-5 fill-current" />
              Begin Adventure
            </Button>
          </motion.div>

          {onSkip && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="gap-2 text-muted-foreground"
              >
                <SkipForward className="h-4 w-4" /> Skip
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {scenes.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          {scenes.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentScene(i);
                setSceneReady(true);
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === currentScene
                  ? "w-8 bg-primary shadow-lg shadow-primary/30"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
