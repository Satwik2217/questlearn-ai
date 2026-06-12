import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ApiResponse, Quest } from "@/types";

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

    const { questId } = await request.json();

    if (!questId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required field: questId" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data: quest, error: questError } = await supabase
      .from("quests")
      .select("*")
      .eq("id", questId)
      .eq("user_id", user!.id)
      .maybeSingle();

    if (questError || !quest) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: quest ? questError?.message || "Quest not found" : "Quest not found" },
        { status: 404 }
      );
    }

    if (quest.status === "completed") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Quest already completed" },
        { status: 400 }
      );
    }

    if (quest.status !== "in_progress") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Quest is not in progress" },
        { status: 400 }
      );
    }

    if (quest.progress < quest.target) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Quest not completed. Progress: ${quest.progress}/${quest.target}` },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .update({
        total_xp: supabase.rpc("increment", { x: quest.xp_reward }),
        coins: supabase.rpc("increment", { x: quest.coin_reward }),
      })
      .eq("user_id", user!.id)
      .select()
      .single();

    const { error: updateError } = await supabase
      .from("quests")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", questId);

    if (updateError) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    let awardedItem = null;
    if (quest.item_reward) {
      const { data: invItem, error: invError } = await supabase
        .from("inventory_items")
        .insert({
          user_id: user!.id,
          item_id: quest.item_reward,
          quantity: 1,
        })
        .select("*, item:items(*)")
        .maybeSingle();

      if (invError) {
        console.error("Failed to award item:", invError);
      } else {
        awardedItem = invItem;
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        xpAwarded: quest.xp_reward,
        coinsAwarded: quest.coin_reward,
        item: awardedItem,
        profile,
      },
      message: "Quest rewards claimed",
    });
  } catch (error) {
    console.error("Quest claim error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
