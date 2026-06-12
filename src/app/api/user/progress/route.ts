import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types";

async function getAuthUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { user: null, error: "Unauthorized" };
  }
  return { user, error: null };
}

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError) {
      return NextResponse.json<ApiResponse>({ success: false, error: authError }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const levelId = searchParams.get("levelId");

    if (!levelId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required query param: levelId" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user!.id)
      .eq("level_id", levelId)
      .maybeSingle();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data });
  } catch (error) {
    console.error("Progress GET error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError) {
      return NextResponse.json<ApiResponse>({ success: false, error: authError }, { status: 401 });
    }

    const { levelId, score, accuracy, timeSpent } = await request.json();

    if (!levelId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required field: levelId" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data: existing } = await supabase
      .from("user_progress")
      .select("id, attempts")
      .eq("user_id", user!.id)
      .eq("level_id", levelId)
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await supabase
        .from("user_progress")
        .update({
          score,
          accuracy,
          time_spent: timeSpent,
          attempts: existing.attempts + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: updateError.message },
          { status: 500 }
        );
      }
    } else {
      const { error: insertError } = await supabase
        .from("user_progress")
        .insert({
          user_id: user!.id,
          level_id: levelId,
          score,
          accuracy,
          time_spent: timeSpent,
          attempts: 1,
          completed: false,
        });

      if (insertError) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Progress saved" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Progress POST error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError) {
      return NextResponse.json<ApiResponse>({ success: false, error: authError }, { status: 401 });
    }

    const { levelId, score, accuracy, timeSpent, xpEarned, coinsEarned } = await request.json();

    if (!levelId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required field: levelId" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data: existing } = await supabase
      .from("user_progress")
      .select("id")
      .eq("user_id", user!.id)
      .eq("level_id", levelId)
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await supabase
        .from("user_progress")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          score,
          accuracy,
          time_spent: timeSpent,
          xp_earned: xpEarned,
          coins_earned: coinsEarned,
          attempts: supabase.rpc("increment", { x: 1 }),
        })
        .eq("id", existing.id);

      if (updateError) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: updateError.message },
          { status: 500 }
        );
      }
    } else {
      const { error: insertError } = await supabase
        .from("user_progress")
        .insert({
          user_id: user!.id,
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

      if (insertError) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: insertError.message },
          { status: 500 }
        );
      }
    }

    if (xpEarned) {
      await supabase.rpc("add_xp", { user_id: user!.id, amount: xpEarned });
    }

    if (coinsEarned) {
      await supabase.rpc("add_coins", { user_id: user!.id, amount: coinsEarned });
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Level completed successfully" }
    );
  } catch (error) {
    console.error("Progress PUT error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
