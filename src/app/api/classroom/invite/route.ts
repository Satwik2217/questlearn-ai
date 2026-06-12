import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ApiResponse, Classroom } from "@/types";

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

    const { inviteCode } = await request.json();

    if (!inviteCode) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required field: inviteCode" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data: classroom, error: classroomError } = await supabase
      .from("classrooms")
      .select("*")
      .eq("invite_code", inviteCode.toUpperCase())
      .maybeSingle();

    if (classroomError || !classroom) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid invite code" },
        { status: 404 }
      );
    }

    const { data: existing } = await supabase
      .from("classroom_students")
      .select("id")
      .eq("classroom_id", classroom.id)
      .eq("student_id", user!.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "You are already a member of this classroom" },
        { status: 400 }
      );
    }

    const { error: joinError } = await supabase.from("classroom_students").insert({
      classroom_id: classroom.id,
      student_id: user!.id,
    });

    if (joinError) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: joinError.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Classroom>>({
      success: true,
      data: classroom,
      message: `Joined classroom "${classroom.name}"`,
    });
  } catch (error) {
    console.error("Classroom invite error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
