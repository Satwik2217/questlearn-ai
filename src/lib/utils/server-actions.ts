"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { calculateLevel } from "@/lib/utils/helpers";
import type { Profile } from "@/types";

export async function awardXp(userId: string, amount: number, reason: string) {
  const supabase = await createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("total_xp, level")
    .eq("user_id", userId)
    .maybeSingle();

  if (!profile) {
    throw new Error("Profile not found");
  }

  const newTotal = (profile.total_xp || 0) + amount;
  const newLevel = calculateLevel(newTotal);

  const { error } = await supabase
    .from("profiles")
    .update({
      total_xp: newTotal,
      level: newLevel,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to award XP: ${error.message}`);

  return { totalXp: newTotal, level: newLevel, xpAwarded: amount, reason };
}

export async function completeLevel(
  userId: string,
  levelId: string,
  score: number,
  accuracy: number,
  timeSpent: number
) {
  const supabase = await createAdminClient();

  const { data: level } = await supabase
    .from("levels")
    .select("xp_reward, coins_reward")
    .eq("id", levelId)
    .maybeSingle();

  if (!level) throw new Error("Level not found");

  const xpEarned = Math.round(level.xp_reward * (accuracy / 100));
  const coinsEarned = level.coins_reward || Math.round(xpEarned * 0.5);

  const { data: existing } = await supabase
    .from("user_progress")
    .select("id, attempts, completed")
    .eq("user_id", userId)
    .eq("level_id", levelId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("user_progress")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        score,
        accuracy,
        time_spent: timeSpent,
        xp_earned: xpEarned,
        coins_earned: coinsEarned,
        attempts: existing.attempts + 1,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("user_progress").insert({
      user_id: userId,
      level_id: levelId,
      completed: true,
      completed_at: new Date().toISOString(),
      score,
      accuracy,
      time_spent: timeSpent,
      xp_earned: xpEarned,
      coins_earned: coinsEarned,
      attempts: 1,
    });
  }

  const xpResult = await awardXp(userId, xpEarned, `Completed level ${levelId}`);
  const achievements = await checkAchievements(userId);

  return {
    xpEarned,
    coinsEarned,
    totalXp: xpResult.totalXp,
    level: xpResult.level,
    achievements,
  };
}

export async function claimQuestReward(userId: string, questId: string) {
  const supabase = await createAdminClient();

  const { data: quest } = await supabase
    .from("quests")
    .select("*")
    .eq("id", questId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!quest) throw new Error("Quest not found");
  if (quest.status === "completed") throw new Error("Quest already completed");
  if (quest.progress < quest.target) throw new Error("Quest not yet completed");

  await supabase
    .from("quests")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", questId);

  await awardXp(userId, quest.xp_reward, `Quest reward: ${quest.title}`);

  await supabase
    .from("profiles")
    .update({ coins: supabase.rpc("increment", { x: quest.coin_reward }) })
    .eq("user_id", userId);

  let awardedItem = null;
  if (quest.item_reward) {
    const { data: item } = await supabase
      .from("inventory_items")
      .insert({
        user_id: userId,
        item_id: quest.item_reward,
        quantity: 1,
      })
      .select("*, item:items(*)")
      .maybeSingle();
    awardedItem = item;
  }

  return {
    xpAwarded: quest.xp_reward,
    coinsAwarded: quest.coin_reward,
    item: awardedItem,
  };
}

export async function completeBossBattle(
  userId: string,
  bossId: string,
  correctAnswers: number,
  totalQuestions: number
) {
  const supabase = await createAdminClient();

  const { data: boss } = await supabase
    .from("bosses")
    .select("*")
    .eq("id", bossId)
    .maybeSingle();

  if (!boss) throw new Error("Boss not found");

  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const xpReward = boss.xp_reward || Math.round(boss.max_hp * 10 * (accuracy / 100));
  const coinReward = Math.round(xpReward * 0.5);
  const defeated = correctAnswers >= Math.ceil(totalQuestions * 0.5);

  await supabase.from("boss_battles").insert({
    user_id: userId,
    boss_id: bossId,
    correct_answers: correctAnswers,
    total_questions: totalQuestions,
    accuracy,
    defeated,
    xp_earned: xpReward,
    coins_earned: coinReward,
  });

  if (defeated) {
    await supabase
      .from("user_bosses")
      .upsert({
        user_id: userId,
        boss_id: bossId,
        status: "defeated",
        completed_at: new Date().toISOString(),
        attempts: 1,
      });
  }

  await awardXp(userId, xpReward, `Boss battle: ${boss.name}`);
  await supabase
    .from("profiles")
    .update({ coins: supabase.rpc("increment", { x: coinReward }) })
    .eq("user_id", userId);

  const achievements = await checkAchievements(userId);

  return {
    defeated,
    xpAwarded: xpReward,
    coinsAwarded: coinReward,
    accuracy,
    achievements,
  };
}

export async function createClassroom(
  teacherId: string,
  name: string,
  description?: string,
  subjectId?: string,
  board?: string,
  className?: string
) {
  const supabase = await createAdminClient();

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let inviteCode = "";
  for (let i = 0; i < 8; i++) {
    inviteCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const { data, error } = await supabase
    .from("classrooms")
    .insert({
      teacher_id: teacherId,
      name,
      description: description || null,
      subject_id: subjectId || null,
      board: board || null,
      class: className || null,
      invite_code: inviteCode,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create classroom: ${error.message}`);
  return data;
}

export async function joinClassroom(userId: string, inviteCode: string) {
  const supabase = await createAdminClient();

  const { data: classroom } = await supabase
    .from("classrooms")
    .select("*")
    .eq("invite_code", inviteCode.toUpperCase())
    .maybeSingle();

  if (!classroom) throw new Error("Invalid invite code");

  const { data: existing } = await supabase
    .from("classroom_students")
    .select("id")
    .eq("classroom_id", classroom.id)
    .eq("student_id", userId)
    .maybeSingle();

  if (existing) throw new Error("Already a member of this classroom");

  const { error } = await supabase.from("classroom_students").insert({
    classroom_id: classroom.id,
    student_id: userId,
  });

  if (error) throw new Error(`Failed to join classroom: ${error.message}`);
  return classroom;
}

export async function updateProfile(userId: string, data: Partial<Profile>) {
  const supabase = await createAdminClient();

  const allowedFields = [
    "display_name", "avatar_url", "character_type", "age", "class", "board",
  ];

  const filtered: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (data[key as keyof typeof data] !== undefined) {
      filtered[key] = data[key as keyof typeof data];
    }
  }

  if (Object.keys(filtered).length === 0) {
    throw new Error("No valid fields provided");
  }

  filtered.updated_at = new Date().toISOString();

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(filtered)
    .eq("user_id", userId)
    .select()
    .maybeSingle();

  if (error) throw new Error(`Failed to update profile: ${error.message}`);
  return profile;
}

export async function checkAchievements(userId: string) {
  const supabase = await createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("total_xp, level, streak_days")
    .eq("user_id", userId)
    .maybeSingle();

  if (!profile) throw new Error("Profile not found");

  const { data: existingAchievements } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);

  const existingIds = new Set(
    (existingAchievements || []).map((a: { achievement_id: string }) => a.achievement_id)
  );

  const { data: allAchievements } = await supabase.from("achievements").select("*");

  const newAchievements: string[] = [];

  for (const achievement of allAchievements || []) {
    if (existingIds.has(achievement.id)) continue;

    const criteria = achievement.criteria as Record<string, unknown>;
    let unlocked = false;

    if (criteria.type === "xp" && profile.total_xp >= (criteria.value as number)) {
      unlocked = true;
    } else if (criteria.type === "level" && profile.level >= (criteria.value as number)) {
      unlocked = true;
    } else if (criteria.type === "streak" && profile.streak_days >= (criteria.value as number)) {
      unlocked = true;
    }

    if (unlocked) {
      await supabase.from("user_achievements").insert({
        user_id: userId,
        achievement_id: achievement.id,
      });

      if (achievement.xp_reward) {
        await awardXp(userId, achievement.xp_reward, `Achievement: ${achievement.name}`);
      }

      newAchievements.push(achievement.id);
    }
  }

  return newAchievements;
}

export async function addDailyAnalytics(userId: string) {
  const supabase = await createAdminClient();

  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("analytics")
    .select("id")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  if (existing) return;

  const { data: progress } = await supabase
    .from("user_progress")
    .select("accuracy, xp_earned, time_spent")
    .eq("user_id", userId)
    .gte("started_at", today);

  const completedCount = progress?.length || 0;
  const totalAccuracy = (progress as Array<Record<string, unknown>>)?.reduce((sum: number, p) => sum + ((p.accuracy as number) || 0), 0) || 0;
  const totalTime = (progress as Array<Record<string, unknown>>)?.reduce((sum: number, p) => sum + ((p.time_spent as number) || 0), 0) || 0;
  const totalXp = (progress as Array<Record<string, unknown>>)?.reduce((sum: number, p) => sum + ((p.xp_earned as number) || 0), 0) || 0;
  const avgAccuracy = completedCount > 0 ? Math.round(totalAccuracy / completedCount) : 0;

  const { data: profile } = await supabase
    .from("profiles")
    .select("streak_days")
    .eq("user_id", userId)
    .maybeSingle();

  const profileData = profile as { streak_days?: number } | null;

  const { error } = await supabase.from("analytics").insert({
    user_id: userId,
    date: today,
    total_xp: totalXp,
    lessons_completed: completedCount,
    challenges_solved: completedCount,
    accuracy: avgAccuracy,
    time_spent_minutes: Math.round(totalTime / 60),
    streak_day: profileData?.streak_days || 0,
    topics_studied: [],
    weak_areas: [],
    strong_areas: [],
  });

  if (error) throw new Error(`Failed to add analytics: ${error.message}`);
}
