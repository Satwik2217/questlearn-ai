import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse, Profile } from "@/types";

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { user: null, error: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    return { user: null, error: "Forbidden: Admin access required" };
  }

  return { user, error: null };
}

export async function GET(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin();
    if (authError) {
      const status = authError === "Unauthorized" ? 401 : 403;
      return NextResponse.json<ApiResponse>({ success: false, error: authError }, { status });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = (page - 1) * limit;
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const supabase = await createAdminClient();

    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (role) {
      query = query.eq("role", role);
    }

    if (search) {
      query = query.or(`display_name.ilike.%${search}%,user_id.ilike.%${search}%`);
    }

    if (status === "active") {
      query = query.gte("last_active", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    } else if (status === "inactive") {
      query = query.lt("last_active", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    }

    const { data: users, count, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        users: users || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin();
    if (authError) {
      const status = authError === "Unauthorized" ? 401 : 403;
      return NextResponse.json<ApiResponse>({ success: false, error: authError }, { status });
    }

    const { userId, role, displayName, board, class: className } = await request.json();

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required field: userId" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const updates: Record<string, unknown> = {};
    if (role !== undefined) updates.role = role;
    if (displayName !== undefined) updates.display_name = displayName;
    if (board !== undefined) updates.board = board;
    if (className !== undefined) updates.class = className;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId)
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
      message: "User updated",
    });
  } catch (error) {
    console.error("Admin users PUT error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { error: authError } = await requireAdmin();
    if (authError) {
      const status = authError === "Unauthorized" ? 401 : 403;
      return NextResponse.json<ApiResponse>({ success: false, error: authError }, { status });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required query param: userId" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    await supabase.from("user_progress").delete().eq("user_id", userId);
    await supabase.from("quests").delete().eq("user_id", userId);
    await supabase.from("user_achievements").delete().eq("user_id", userId);
    await supabase.from("inventory_items").delete().eq("user_id", userId);
    await supabase.from("classroom_students").delete().eq("student_id", userId);
    await supabase.from("notifications").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("user_id", userId);

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Admin users DELETE error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
