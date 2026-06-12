import { getAIClient, getModel } from "./client";
import {
  buildSystemPrompt,
  buildLessonPrompt,
  buildQuestPrompt,
  buildBossBattlePrompt,
  buildChallengePrompt,
  buildFlashcardPrompt,
  buildSummaryPrompt,
} from "./prompts";
import type {
  AIGenerateRequest,
  AIGenerateResponse,
} from "@/types";

async function generateContent(
  request: AIGenerateRequest
): Promise<AIGenerateResponse> {
  try {
    const client = getAIClient();
    const model = getModel();

    let userPrompt: string;
    switch (request.contentType) {
      case "lesson":
        userPrompt = buildLessonPrompt(request);
        break;
      case "quest":
        userPrompt = buildQuestPrompt(request);
        break;
      case "boss":
        userPrompt = buildBossBattlePrompt(request);
        break;
      case "challenge":
        userPrompt = buildChallengePrompt(request);
        break;
      case "flashcard":
        userPrompt = buildFlashcardPrompt(request);
        break;
      case "summary":
        userPrompt = buildSummaryPrompt(request);
        break;
      default:
        userPrompt = buildLessonPrompt(request);
    }

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const content = JSON.parse(
      completion.choices[0]?.message?.content || "{}"
    );

    return {
      success: true,
      content,
    };
  } catch (error) {
    console.error("AI generation error:", error);
    return {
      success: false,
      content: {},
      error: error instanceof Error ? error.message : "Failed to generate content",
    };
  }
}

export const ai = {
  generateLesson: (params: AIGenerateRequest) =>
    generateContent({ ...params, contentType: "lesson" }),
  generateQuest: (params: AIGenerateRequest) =>
    generateContent({ ...params, contentType: "quest" }),
  generateBossBattle: (params: AIGenerateRequest) =>
    generateContent({ ...params, contentType: "boss" }),
  generateChallenges: (params: AIGenerateRequest) =>
    generateContent({ ...params, contentType: "challenge" }),
  generateFlashcards: (params: AIGenerateRequest) =>
    generateContent({ ...params, contentType: "flashcard" }),
  generateSummary: (params: AIGenerateRequest) =>
    generateContent({ ...params, contentType: "summary" }),
};
