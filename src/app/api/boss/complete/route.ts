import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ApiResponse, BossStatus } from "@/types";

async function getAuthUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { user: null, error: "Unauthorized" };
  }
  return { user, error: null };
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError) {
      return NextResponse.json<ApiResponse>({ success: false, error: authError }, { status: 401 });
    }

    const { bossId, correctAnswers, totalQuestions, damageDealt, timeSpent } = await request.json();

    if (!bossId || correctAnswers === undefined || !totalQuestions) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields: bossId, correctAnswers, totalQuestions" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data: boss, error: bossError } = await supabase
      .from("bosses")
      .select("*")
      .eq("id", bossId)
      .maybeSingle();

    if (bossError || !boss) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Boss not found" },
        { status: 404 }
      );
    }

    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    const xpReward = boss.xp_reward || Math.round(boss.max_hp * 10 * (accuracy / 100));
    const coinReward = Math.round(xpReward * 0.5);
    const defeated = correctAnswers >= Math.ceil(totalQuestions * 0.5);

    if (defeated) {
      await supabase
        .from("user_bosses")
        .upsert({
          user_id: user!.id,
          boss_id: bossId,
          status: "defeated" as BossStatus,
          completed_at: new Date().toISOString(),
          attempts: 1,
        });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .update({
        total_xp: supabase.rpc("increment", { x: xpReward }),
        coins: supabase.rpc("increment", { x: coinReward }),
      })
      .eq("user_id", user!.id)
      .select()
      .single();

    await supabase.from("boss_battles").insert({
      user_id: user!.id,
      boss_id: bossId,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      damage_dealt: damageDealt || 0,
      accuracy,
      time_spent: timeSpent || 0,
      defeated,
      xp_earned: xpReward,
      coins_earned: coinReward,
    });

    const achievements: string[] = [];
    if (accuracy === 100 && totalQuestions >= 5) {
      const { data: perfect } = await supabase
        .from("user_achievements")
        .select("id")
        .eq("user_id", user!.id)
        .eq("achievement_id", "perfect_boss")
        .maybeSingle();

      if (!perfect) {
        await supabase.from("user_achievements").insert({
          user_id: user!.id,
          achievement_id: "perfect_boss",
        });
        achievements.push("perfect_boss");
      }
    }

    if (defeated) {
      const { data: bossDefeated } = await supabase
        .from("user_achievements")
        .select("id")
        .eq("user_id", user!.id)
        .eq("achievement_id", "first_boss_defeated")
        .maybeSingle();

      if (!bossDefeated) {
        await supabase.from("user_achievements").insert({
          user_id: user!.id,
          achievement_id: "first_boss_defeated",
        });
        achievements.push("first_boss_defeated");
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        defeated,
        xpAwarded: xpReward,
        coinsAwarded: coinReward,
        accuracy,
        achievements,
        profile,
      },
      message: defeated ? "Boss defeated!" : "Boss not defeated. Try again!",
    });
  } catch (error) {
    console.error("Boss complete error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
