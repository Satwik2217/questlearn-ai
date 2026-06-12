import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types";

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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const supabase = await createAdminClient();

    let profileQuery = supabase.from("profiles").select("*", { count: "exact", head: true });
    let activeQuery = supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("last_active", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (startDate) {
      profileQuery = profileQuery.gte("created_at", startDate);
    }
    if (endDate) {
      profileQuery = profileQuery.lte("created_at", endDate);
    }

    const { count: totalUsers } = await profileQuery;
    const { count: activeUsers } = await activeQuery;

    const { count: totalClassrooms } = await supabase
      .from("classrooms")
      .select("*", { count: "exact", head: true });

    let generationQuery = supabase
      .from("ai_generations")
      .select("*", { count: "exact", head: true });

    if (startDate) generationQuery = generationQuery.gte("created_at", startDate);
    if (endDate) generationQuery = generationQuery.lte("created_at", endDate);

    const { count: totalGenerations } = await generationQuery;

    const { data: roleCounts } = await supabase
      .from("profiles")
      .select("role");

    const roleBreakdown: Record<string, number> = {};
    for (const p of roleCounts || []) {
      roleBreakdown[p.role] = (roleBreakdown[p.role] || 0) + 1;
    }

    const { data: subscriptionData } = await supabase
      .from("subscriptions")
      .select("tier, status");

    const subscriptionStats = {
      total: subscriptionData?.length || 0,
      active: subscriptionData?.filter((s: { status: string }) => s.status === "active").length || 0,
      byTier: {} as Record<string, number>,
    };

    for (const sub of subscriptionData || []) {
      if (sub.status === "active") {
        subscriptionStats.byTier[sub.tier] = (subscriptionStats.byTier[sub.tier] || 0) + 1;
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalClassrooms: totalClassrooms || 0,
        totalGenerations: totalGenerations || 0,
        roleBreakdown,
        subscriptionStats,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
