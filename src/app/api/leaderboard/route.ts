import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse, Profile } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "global";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    const validTypes = ["global", "friends", "class"];
    if (!validTypes.includes(type)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from("profiles")
      .select("id, display_name, avatar_url, character_type, total_xp, level, streak_days, class, board")
      .order("total_xp", { ascending: false });

    if (type === "class" && user) {
      const { data: classrooms } = await supabase
        .from("classroom_students")
        .select("classroom_id")
        .eq("student_id", user.id);

      if (classrooms && classrooms.length > 0) {
        const classroomIds = classrooms.map((c: { classroom_id: string }) => c.classroom_id);
        const { data: classmates } = await supabase
          .from("classroom_students")
          .select("student_id")
          .in("classroom_id", classroomIds);

        if (classmates && classmates.length > 0) {
          const userIds = [...new Set(classmates.map((c: { student_id: string }) => c.student_id))];
          query = query.in("id", userIds);
        }
      }
    } else if (type === "friends" && user) {
      const { data: friendships } = await supabase
        .from("friends")
        .select("friend_id")
        .eq("user_id", user.id)
        .eq("status", "accepted");

      if (friendships && friendships.length > 0) {
        const friendIds = friendships.map((f: { friend_id: string }) => f.friend_id);
        friendIds.push(user.id);
        query = query.in("id", friendIds);
      } else {
        query = query.eq("id", user.id);
      }
    }

    const { data: profiles, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const ranked = (profiles || []).map((p: Partial<Profile>, i: number) => ({
      rank: offset + i + 1,
      ...p,
    }));

    // TODO: Add caching (e.g., using Redis with 60s TTL)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { players: ranked, total: ranked.length },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
