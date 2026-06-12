"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Swords, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { useGameStore } from "@/store/useGameStore";
import { BossCharacter } from "./BossCharacter";
import { PlayerCharacter } from "./PlayerCharacter";
import { HealthBar } from "./HealthBar";
import { AttackPanel } from "./AttackPanel";
import { BattleEffects } from "./BattleEffects";
import { VictoryScreen } from "./VictoryScreen";
import { DefeatScreen } from "./DefeatScreen";
import type { Boss, BossChallenge, BattleState } from "@/types";

interface BossBattleEngineProps {
  boss: Boss;
  challenges: BossChallenge[];
  chapterTitle: string;
  initialBattleState: BattleState;
  userId: string;
  onExit: () => void;
}

const BASE_PLAYER_HP = 100;
const BASE_PLAYER_ATTACK = 10;
const SPECIAL_DAMAGE_MULTIPLIER = 3;
const HINTS_PER_BATTLE = 3;
const ADAPTIVE_THRESHOLD = 0.6;

function getElementFromName(name: string): "fire" | "ice" | "lightning" | "shadow" | "arcane" {
  const lower = name.toLowerCase();
  if (lower.includes("fire") || lower.includes("dragon") || lower.includes("phoenix")) return "fire";
  if (lower.includes("ice") || lower.includes("frost") || lower.includes("snow")) return "ice";
  if (lower.includes("thunder") || lower.includes("storm") || lower.includes("lightning")) return "lightning";
  if (lower.includes("shadow") || lower.includes("dark") || lower.includes("lich")) return "shadow";
  if (lower.includes("arcane") || lower.includes("magic") || lower.includes("wizard")) return "arcane";
  return "shadow";
}

export function BossBattleEngine({
  boss,
  challenges,
  chapterTitle,
  initialBattleState,
  userId,
  onExit,
}: BossBattleEngineProps) {
  const supabase = createClient();
  const gameProfile = useGameStore((s) => s.profile);
  const setBattleState = useGameStore((s) => s.setBattleState);
  const updateBattleState = useGameStore((s) => s.updateBattleState);
  const addCoins = useGameStore((s) => s.addCoins);

  const [battle, setBattle] = useState<BattleState>(initialBattleState);
  const [shuffledChallenges, setShuffledChallenges] = useState<BossChallenge[]>([]);
  const [damageValue, setDamageValue] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [isCritical, setIsCritical] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(HINTS_PER_BATTLE);
  const [difficultyMultiplier, setDifficultyMultiplier] = useState(1);
  const [startTime] = useState(Date.now());
  const [isProcessing, setIsProcessing] = useState(false);
  const [battleKey, setBattleKey] = useState(0);

  const phaseTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    phaseTimers.current.forEach(clearTimeout);
    phaseTimers.current = [];
  }, []);

  useEffect(() => {
    const shuffled = [...challenges].sort(() => Math.random() - 0.5);
    setShuffledChallenges(shuffled);
  }, [challenges]);

  useEffect(() => {
    setBattleState(battle);
  }, [battle, setBattleState]);

  useEffect(() => {
    return () => {
      clearTimers();
      setBattleState(null);
    };
  }, [clearTimers, setBattleState]);

  const resetBattle = useCallback(() => {
    clearTimers();
    const shuffled = [...challenges].sort(() => Math.random() - 0.5);
    setShuffledChallenges(shuffled);
    setBattle({
      ...initialBattleState,
      phase: "intro",
    });
    setComboCount(0);
    setHintsRemaining(HINTS_PER_BATTLE);
    setDifficultyMultiplier(1);
    setBattleKey((k) => k + 1);
  }, [challenges, initialBattleState, clearTimers]);

  const adaptiveDifficulty = useCallback((correctCount: number, totalCount: number) => {
    const accuracy = totalCount > 0 ? correctCount / totalCount : 0;
    if (accuracy > ADAPTIVE_THRESHOLD + 0.2) {
      setDifficultyMultiplier(1.3);
    } else if (accuracy > ADAPTIVE_THRESHOLD) {
      setDifficultyMultiplier(1.15);
    } else if (accuracy < ADAPTIVE_THRESHOLD - 0.2) {
      setDifficultyMultiplier(0.85);
    } else {
      setDifficultyMultiplier(1);
    }
  }, []);

  const saveBattleResult = useCallback(async (defeated: boolean) => {
    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const xpEarned = defeated
        ? battle.correctAnswers * 25 + battle.totalDamage * 2 + 50
        : battle.correctAnswers * 15 + battle.totalDamage * 1;

      const coinsEarned = defeated
        ? battle.correctAnswers * 10 + 50
        : battle.correctAnswers * 5 + 10;

      await (supabase.from("battle_results") as any).insert({
        user_id: userId,
        boss_id: boss.id,
        defeated,
        correct_answers: battle.correctAnswers,
        total_questions: battle.totalQuestions,
        total_damage: battle.totalDamage,
        time_taken: timeTaken,
        xp_earned: xpEarned,
        coins_earned: coinsEarned,
        accuracy: battle.totalQuestions > 0
          ? Math.round((battle.correctAnswers / battle.totalQuestions) * 100)
          : 0,
      });

      if (defeated) {
        await (supabase.from("user_progress") as any).upsert({
          user_id: userId,
          level_id: `boss_${boss.id}`,
          completed: true,
          score: Math.round((battle.correctAnswers / battle.totalQuestions) * 100),
          xp_earned: xpEarned,
          coins_earned: coinsEarned,
          accuracy: battle.totalQuestions > 0
            ? Math.round((battle.correctAnswers / battle.totalQuestions) * 100)
            : 0,
          time_spent: timeTaken,
          completed_at: new Date().toISOString(),
        });
      }

      if (gameProfile) {
        await (supabase.from("profiles") as any)
          .update({
            total_xp: (gameProfile.total_xp ?? 0) + xpEarned,
            coins: (gameProfile.coins ?? 0) + coinsEarned,
          })
          .eq("id", gameProfile.id);
      }

      addCoins(coinsEarned);
    } catch (error) {
      console.error("Failed to save battle result:", error);
    }
  }, [battle, boss.id, userId, startTime, supabase, gameProfile, addCoins]);

  const handlePhaseTransition = useCallback((nextPhase: BattleState["phase"], delay: number) => {
    setIsProcessing(true);
    const timer = setTimeout(() => {
      updateBattleState({ phase: nextPhase });
      setIsProcessing(false);
    }, delay);
    phaseTimers.current.push(timer);
  }, [updateBattleState]);

  const handlePlayerAttack = useCallback((damage: number, critical: boolean) => {
    setDamageValue(damage);
    setIsCritical(critical);

    const newBossHp = Math.max(0, battle.bossHp - damage);
    const newDamage = battle.totalDamage + damage;
    const newCombo = critical ? comboCount + 1 : comboCount + 1;

    setBattle((prev) => ({
      ...prev,
      bossHp: newBossHp,
      totalDamage: newDamage,
      phase: "player_turn",
    }));
    setComboCount(newCombo);

    if (newBossHp <= 0) {
      handlePhaseTransition("victory", 1500);
    } else {
      handlePhaseTransition("question", 1500);
    }
  }, [battle.bossHp, battle.totalDamage, comboCount, handlePhaseTransition]);

  const handleBossAttack = useCallback(() => {
    const bossDamage = Math.max(1, boss.attack_power - battle.playerDefense);
    const newPlayerHp = Math.max(0, battle.playerHp - bossDamage * difficultyMultiplier);

    setBattle((prev) => ({
      ...prev,
      playerHp: newPlayerHp,
      phase: "boss_turn",
    }));
    setDamageValue(Math.round(bossDamage * difficultyMultiplier));

    if (newPlayerHp <= 0) {
      handlePhaseTransition("defeat", 1000);
    } else {
      handlePhaseTransition("question", 1000);
    }
  }, [boss.attack_power, battle.playerDefense, battle.playerHp, difficultyMultiplier, handlePhaseTransition]);

  const handleAnswer = useCallback((correct: boolean) => {
    if (isProcessing) return;

    const newCorrect = correct ? battle.correctAnswers + 1 : battle.correctAnswers;
    const newIndex = battle.currentQuestionIndex + 1;

    setBattle((prev) => ({
      ...prev,
      correctAnswers: newCorrect,
      currentQuestionIndex: newIndex,
    }));

    adaptiveDifficulty(newCorrect, newIndex);

    if (correct) {
      const baseDamage = battle.playerAttack + Math.floor(Math.random() * 5);
      const critChance = battle.specialCharge >= 2 ? 0.3 : 0.1;
      const isCrit = Math.random() < critChance;
      const totalDamage = isCrit ? Math.round(baseDamage * 1.5) : baseDamage;

      const newCharge = Math.min(3, battle.specialCharge + 1);
      setBattle((prev) => ({ ...prev, specialCharge: newCharge }));

      handlePlayerAttack(totalDamage, isCrit);
    } else {
      handleBossAttack();
    }
  }, [battle, isProcessing, adaptiveDifficulty, handlePlayerAttack, handleBossAttack]);

  const handleSpecialAttack = useCallback(() => {
    if (battle.specialCharge < 3 || isProcessing) return;

    const specialDamage = battle.playerAttack * SPECIAL_DAMAGE_MULTIPLIER;
    setBattle((prev) => ({
      ...prev,
      specialCharge: 0,
    }));

    setComboCount((c) => c + 1);
    handlePlayerAttack(specialDamage, true);
    toast.success("Special Attack unleashed!", {
      description: `${specialDamage} damage dealt!`,
      duration: 2000,
    });
  }, [battle.specialCharge, battle.playerAttack, isProcessing, handlePlayerAttack]);

  const handleDefenseStance = useCallback(() => {
    const defBoost = Math.min(10, battle.playerDefense + 3);
    setBattle((prev) => ({
      ...prev,
      playerDefense: defBoost,
    }));
    toast.info("Defense stance activated!", {
      description: `Defense increased to ${defBoost}`,
      duration: 1500,
    });
  }, [battle.playerDefense]);

  const handleUseHint = useCallback(() => {
    if (hintsRemaining <= 0) return;
    setHintsRemaining((h) => h - 1);
    toast.success("Hint used!", {
      description: `${hintsRemaining - 1} hints remaining`,
      duration: 1500,
    });
  }, [hintsRemaining]);

  const handleSkipIntro = useCallback(() => {
    clearTimers();
    updateBattleState({ phase: "question" });
  }, [clearTimers, updateBattleState]);

  const currentChallenge = shuffledChallenges[battle.currentQuestionIndex];
  const element = getElementFromName(boss.name);
  const isDefeated = battle.phase === "victory";
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);

  return (
    <div className="w-full h-full flex flex-col" key={battleKey}>
      <AnimatePresence mode="wait">
        {battle.phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-40 bg-gradient-to-b from-background via-[#0f0a1e] to-background"
          >
            <motion.div
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-8"
              >
                <div
                  className="w-48 h-48 rounded-3xl mx-auto flex items-center justify-center text-8xl border-2 relative overflow-hidden"
                  style={{
                    borderColor: "#a855f7",
                    background: `linear-gradient(135deg, rgba(0,0,0,0.9), rgba(168,85,247,0.2))`,
                    boxShadow: "0 0 60px rgba(168,85,247,0.3), 0 0 120px rgba(168,85,247,0.1)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                  <span className="relative z-10">👾</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-sm text-primary font-bold game-text tracking-widest uppercase"
                >
                  {chapterTitle} · Final Challenge
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="text-5xl font-black game-text"
                  style={{
                    color: "#a855f7",
                    textShadow: "0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(168,85,247,0.3)",
                  }}
                >
                  {boss.name}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed"
                >
                  {boss.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="flex items-center justify-center gap-4 mt-6"
                >
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Swords className="w-3.5 h-3.5" />
                    <span>HP: {boss.hp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Zap className="w-3.5 h-3.5" />
                    <span>ATK: {boss.attack_power}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="text-xs font-medium badge px-2 py-0.5 rounded-full bg-card border border-border">
                      {boss.difficulty}
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="flex items-center justify-center gap-4 mt-8"
                >
                  <button
                    onClick={() => updateBattleState({ phase: "question" })}
                    className="px-10 h-14 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all hover:shadow-[0_0_30px_-5px] hover:shadow-primary/50 flex items-center gap-3"
                  >
                    <Swords className="w-6 h-6" />
                    <span>FIGHT!</span>
                  </button>
                  <button
                    onClick={onExit}
                    className="px-6 h-14 rounded-xl bg-card border border-border text-muted-foreground font-bold hover:text-foreground transition-colors"
                  >
                    Retreat
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {battle.phase !== "intro" && battle.phase !== "victory" && battle.phase !== "defeat" && (
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-4">
          <div className="flex items-center justify-between">
            <HealthBar
              current={battle.bossHp}
              maximum={battle.bossMaxHp}
              label={boss.name}
              variant="boss"
            />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all",
                      i <= battle.specialCharge
                        ? "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.6)]"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <Zap className={cn("w-3.5 h-3.5", battle.specialCharge >= 3 ? "text-yellow-500" : "text-muted-foreground")} />
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
            <div className="flex-1 flex flex-col items-center">
              <PlayerCharacter
                characterType={gameProfile?.character_type ?? "knight"}
                name={gameProfile?.display_name ?? "Player"}
                level={gameProfile?.level ?? 1}
                phase={battle.phase}
                correctAnswer={null}
              />
              <div className="w-48 mt-4">
                <HealthBar
                  current={battle.playerHp}
                  maximum={battle.playerMaxHp}
                  label="Player"
                  variant="player"
                  showShield
                  defense={battle.playerDefense}
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <BattleEffects
                phase={battle.phase}
                element={element}
                damage={damageValue}
                isCritical={isCritical}
                comboCount={comboCount}
              />
              <BossCharacter
                name={boss.name}
                hp={battle.bossHp}
                maxHp={battle.bossMaxHp}
                phase={battle.phase}
                imageUrl={boss.image_url}
                element={element}
              />
            </div>
          </div>

          <div className="w-full max-w-3xl mx-auto">
            {currentChallenge && (
              <AttackPanel
                key={`${battleKey}-${battle.currentQuestionIndex}`}
                challenge={currentChallenge}
                questionIndex={battle.currentQuestionIndex}
                totalQuestions={battle.totalQuestions}
                battleState={battle}
                onAnswer={handleAnswer}
                onSpecialAttack={handleSpecialAttack}
                onDefenseStance={handleDefenseStance}
                onUseHint={handleUseHint}
                hintsRemaining={hintsRemaining}
              />
            )}
          </div>
        </div>
      )}

      {battle.phase === "victory" && (
        <VictoryScreen
          bossName={boss.name}
          xpEarned={battle.correctAnswers * 25 + battle.totalDamage * 2 + 50}
          coinsEarned={battle.correctAnswers * 10 + 50}
          correctAnswers={battle.correctAnswers}
          totalQuestions={battle.totalQuestions}
          timeTaken={timeTaken}
          onContinue={onExit}
          onReplay={resetBattle}
        />
      )}

      {battle.phase === "defeat" && (
        <DefeatScreen
          bossName={boss.name}
          correctAnswers={battle.correctAnswers}
          totalQuestions={battle.totalQuestions}
          xpEarned={battle.correctAnswers * 15 + battle.totalDamage * 1}
          onRetry={resetBattle}
          onReview={onExit}
          onReturn={onExit}
        />
      )}
    </div>
  );
}
