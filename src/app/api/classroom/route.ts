import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createAdminClient } from "@/lib/supabase/server";
import { generateCode } from "@/lib/utils/helpers";
import type { ApiResponse, Classroom } from "@/types";

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
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (!profile || profile.role !== "teacher") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Only teachers can manage classrooms" },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("classrooms")
      .select("*")
      .eq("teacher_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Classroom[]>>({ success: true, data });
  } catch (error) {
    console.error("Classroom GET error:", error);
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

    const supabase = await createServerSupabaseClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (!profile || profile.role !== "teacher") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Only teachers can create classrooms" },
        { status: 403 }
      );
    }

    const { name, description, subjectId, board, class: className } = await request.json();

    if (!name) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required field: name" },
        { status: 400 }
      );
    }

    const inviteCode = generateCode(8);
    let isUnique = false;
    while (!isUnique) {
      const { data: existing } = await supabase
        .from("classrooms")
        .select("id")
        .eq("invite_code", inviteCode)
        .maybeSingle();
      if (!existing) {
        isUnique = true;
      }
    }

    const { data, error } = await supabase
      .from("classrooms")
      .insert({
        teacher_id: user!.id,
        name,
        description: description || null,
        subject_id: subjectId || null,
        board: board || null,
        class: className || null,
        invite_code: inviteCode,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Classroom>>(
      { success: true, data, message: "Classroom created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Classroom POST error:", error);
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

    const { id, name, description, subjectId, board, class: className } = await request.json();

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data: classroom } = await supabase
      .from("classrooms")
      .select("teacher_id")
      .eq("id", id)
      .maybeSingle();

    if (!classroom) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Classroom not found" },
        { status: 404 }
      );
    }

    if (classroom.teacher_id !== user!.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "You can only update your own classrooms" },
        { status: 403 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (subjectId !== undefined) updates.subject_id = subjectId;
    if (board !== undefined) updates.board = board;
    if (className !== undefined) updates.class = className;

    const { data, error } = await supabase
      .from("classrooms")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Classroom>>({
      success: true,
      data,
      message: "Classroom updated",
    });
  } catch (error) {
    console.error("Classroom PUT error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError) {
      return NextResponse.json<ApiResponse>({ success: false, error: authError }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required query param: id" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data: classroom } = await supabase
      .from("classrooms")
      .select("teacher_id")
      .eq("id", id)
      .maybeSingle();

    if (!classroom) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Classroom not found" },
        { status: 404 }
      );
    }

    if (classroom.teacher_id !== user!.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "You can only delete your own classrooms" },
        { status: 403 }
      );
    }

    await supabase.from("classroom_students").delete().eq("classroom_id", id);

    const { error } = await supabase.from("classrooms").delete().eq("id", id);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Classroom deleted",
    });
  } catch (error) {
    console.error("Classroom DELETE error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
