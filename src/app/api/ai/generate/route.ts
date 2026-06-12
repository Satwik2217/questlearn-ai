import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/ai/generate";
import { createAdminClient } from "@/lib/supabase/server";
import type { AIGenerateRequest, AIGenerateResponse, ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: AIGenerateRequest = await request.json();

    if (!body.subject || !body.chapter || !body.board || !body.class || !body.difficulty || !body.contentType) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields: subject, chapter, board, class, difficulty, contentType" },
        { status: 400 }
      );
    }

    const validContentTypes = ["lesson", "quest", "story", "challenge", "quiz", "boss", "flashcard", "summary"];
    if (!validContentTypes.includes(body.contentType)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Invalid contentType. Must be one of: ${validContentTypes.join(", ")}` },
        { status: 400 }
      );
    }

    let result: AIGenerateResponse;
    switch (body.contentType) {
      case "lesson":
        result = await ai.generateLesson(body);
        break;
      case "quest":
        result = await ai.generateQuest(body);
        break;
      case "boss":
        result = await ai.generateBossBattle(body);
        break;
      case "challenge":
        result = await ai.generateChallenges(body);
        break;
      case "flashcard":
        result = await ai.generateFlashcards(body);
        break;
      case "summary":
        result = await ai.generateSummary(body);
        break;
      default:
        result = await ai.generateLesson(body);
    }

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error || "AI generation failed" },
        { status: 500 }
      );
    }

    // TODO: Add rate limiting (e.g., using Redis or Upstash)

    const supabase = await createAdminClient();
    const { error: saveError } = await supabase.from("ai_generations").insert({
      prompt: JSON.stringify(body),
      content: result.content,
      model: "deepseek",
      tokens_used: 0,
      type: body.contentType,
    });

    if (saveError) {
      console.error("Failed to save AI generation:", saveError);
    }

    return NextResponse.json<ApiResponse<AIGenerateResponse>>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("AI generate API error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
