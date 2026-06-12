import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName, role } = await request.json();

    if (!email || !password || !displayName) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields: email, password, displayName" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data: authUser, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (signUpError) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: signUpError.message },
        { status: 400 }
      );
    }

    const userId = authUser.user.id;

    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: userId,
      display_name: displayName,
      role: role || "student",
      character_type: "knight",
      total_xp: 0,
      level: 1,
      coins: 0,
      streak_days: 0,
    });

    if (profileError) {
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json<ApiResponse>(
        { success: false, error: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { user: { id: userId, email } },
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
