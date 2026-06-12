import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ApiResponse, Profile } from "@/types";

async function getAuthUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { user: null, error: "Unauthorized" };
  }
  return { user, error: null };
}

export async function GET() {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError) {
      return NextResponse.json<ApiResponse>({ success: false, error: authError }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Profile>>({ success: true, data });
  } catch (error) {
    console.error("Profile GET error:", error);
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

    const updates = await request.json();

    const allowedFields = [
      "display_name", "avatar_url", "character_type", "age", "class", "board",
    ];

    const filtered: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filtered[key] = updates[key];
      }
    }

    if (Object.keys(filtered).length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "No valid fields provided to update" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...filtered, updated_at: new Date().toISOString() })
      .eq("user_id", user!.id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Profile>>({
      success: true,
      data,
      message: "Profile updated",
    });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
