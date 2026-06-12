"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertTriangle, Swords, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Boss, BossChallenge, BattleState } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import { BossBattleEngine } from "@/components/boss-battle/BossBattleEngine";

function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-500/30"
          initial={{
            x: Math.random() * 100 + "%",
            y: -10,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            opacity: [0, 0.8, 0],
            x: `calc(${Math.random() * 100}% + ${Math.sin(i) * 50}px)`,
          }}
          transition={{
            duration: 8 + Math.random() * 12,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function BossBattlePage({
  params,
}: {
  params: Promise<{ bossId: string }>;
}) {
  const { bossId } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const user = useAuthStore((s) => s.user);

  const [boss, setBoss] = useState<Boss | null>(null);
  const [challenges, setChallenges] = useState<BossChallenge[]>([]);
  const [chapterTitle, setChapterTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBossData() {
      try {
        setLoading(true);

        const bossResult = await (supabase as any)
          .from("bosses")
          .select("*")
          .eq("id", bossId)
          .single();

        if (bossResult.error || !bossResult.data) {
          setError("Boss not found");
          return;
        }

        const bossData = bossResult.data as unknown as Boss;
        setBoss(bossData);

        const chapterResult = await (supabase as any)
          .from("chapters")
          .select("title")
          .eq("id", bossData.chapter_id)
          .single();

        if (chapterResult.data) {
          setChapterTitle((chapterResult.data as unknown as { title: string }).title);
        }

        const challengeResult = await (supabase as any)
          .from("boss_challenges")
          .select("*")
          .eq("boss_id", bossId)
          .order("order", { ascending: true });

        if (challengeResult.error) {
          setError("Failed to load challenges");
          return;
        }

        if (!challengeResult.data || challengeResult.data.length === 0) {
          setError("No challenges found for this boss");
          return;
        }

        setChallenges(challengeResult.data as unknown as BossChallenge[]);
      } catch {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchBossData();
  }, [bossId, supabase]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Particles />
        <div className="flex flex-col items-center gap-4 z-10">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-lg text-muted-foreground font-orbitron game-text">
            Summoning the boss...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Particles />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6 p-8 z-10"
        >
          <div className="w-20 h-20 rounded-full bg-danger/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-danger" />
          </div>
          <h2 className="text-2xl font-bold game-text">Error</h2>
          <p className="text-muted-foreground text-center max-w-md">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg bg-card border border-border text-foreground hover:bg-muted transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!boss || challenges.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Particles />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6 p-8 z-10"
        >
          <Swords className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold game-text">Boss Not Found</h2>
          <p className="text-muted-foreground">
            This boss does not exist or has no challenges.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Return to Chapter
          </button>
        </motion.div>
      </div>
    );
  }

  const initialBattleState: BattleState = {
    bossId: boss.id,
    bossHp: boss.hp,
    bossMaxHp: boss.max_hp,
    playerHp: 100,
    playerMaxHp: 100,
    playerAttack: 10,
    playerDefense: 5,
    phase: "intro",
    currentQuestionIndex: 0,
    totalQuestions: challenges.length,
    correctAnswers: 0,
    totalDamage: 0,
    specialCharge: 0,
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-background via-[#0f0a1e] to-background overflow-hidden">
      <Particles />
      <AnimatePresence mode="wait">
        <motion.div
          key={bossId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-10 w-full h-full"
        >
          {user && (
            <BossBattleEngine
              boss={boss}
              challenges={challenges}
              chapterTitle={chapterTitle}
              initialBattleState={initialBattleState}
              userId={user.id}
              onExit={() => router.back()}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
