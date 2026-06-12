import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ApiResponse, Subscription, SubscriptionTier } from "@/types";

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
      .from("subscriptions")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Subscription | null>>({
      success: true,
      data: data || null,
    });
  } catch (error) {
    console.error("Subscription GET error:", error);
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

    const { tier } = await request.json();

    const validTiers: SubscriptionTier[] = ["free", "premium", "school", "teacher"];
    if (!tier || !validTiers.includes(tier)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Invalid tier. Must be one of: ${validTiers.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user!.id)
      .maybeSingle();

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    let subscription: Subscription | undefined;

    if (existing) {
      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          tier,
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: error.message },
          { status: 500 }
        );
      }
      subscription = data;
    } else {
      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user!.id,
          tier,
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: error.message },
          { status: 500 }
        );
      }
      subscription = data;
    }

    return NextResponse.json<ApiResponse<Subscription>>(
      {
        success: true,
        data: subscription,
        message: `Subscription updated to ${tier}`,
      },
      { status: existing ? 200 : 201 }
    );
  } catch (error) {
    console.error("Subscription POST error:", error);
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

    const supabase = await createServerSupabaseClient();

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "No active subscription found" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("id", existing.id);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Subscription cancelled",
    });
  } catch (error) {
    console.error("Subscription PUT error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
