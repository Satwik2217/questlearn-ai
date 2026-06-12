import type { AIGenerateRequest } from "@/types";

export function buildSystemPrompt(): string {
  return `You are QuestLearn AI, an expert educational content creator and game designer.
Your mission is to transform academic content into engaging RPG-style learning adventures.
Create immersive, story-driven educational experiences that feel like playing a video game.
Use age-appropriate language and make learning fun and memorable.
Always embed educational concepts naturally within stories and gameplay.`;
}

export function buildLessonPrompt(params: AIGenerateRequest): string {
  return `Create an interactive RPG-style lesson for:
- Subject: ${params.subject}
- Chapter: ${params.chapter}
- Board: ${params.board}
- Class: ${params.class}
- Difficulty: ${params.difficulty}
- Student Level: ${params.studentLevel || 1}

Structure the lesson as:
1. A compelling story introduction that sets up the learning adventure
2. Key concepts broken down into digestible parts with epic analogies
3. Interactive elements where the student makes choices that affect the story
4. Memory tricks and visual analogies for each concept
5. A summary that connects the story events to the learned concepts

Format as JSON with fields: storyIntro, concepts (array of {name, explanation, analogy, memoryTrick}), interactiveElements (array of {type, prompt, choices}), summary`;
}

export function buildQuestPrompt(params: AIGenerateRequest): string {
  return `Create a learning quest for:
- Subject: ${params.subject}
- Chapter: ${params.chapter}
- Board: ${params.board}
- Class: ${params.class}
- Difficulty: ${params.difficulty}

The quest should be structured like an RPG side quest with:
1. Quest title and description framed as a story
2. NPC dialogue that introduces the quest
3. 3-5 challenges that test understanding of chapter concepts
4. Each challenge should feel like a game mechanic (puzzle, riddle, battle, exploration)
5. Reward description (XP, coins, items)
6. Quest completion dialogue

Format as JSON with fields: title, description, npcDialogue, objectives (array), challenges (array of {title, type, question, answer, explanation}), rewards, completionDialogue`;
}

export function buildBossBattlePrompt(params: AIGenerateRequest): string {
  return `Create an epic boss battle for:
- Subject: ${params.subject}
- Chapter: ${params.chapter}
- Board: ${params.board}
- Class: ${params.class}
- Difficulty: ${params.difficulty}

The boss should represent the chapter's main challenge. Generate:
1. Boss name and backstory (e.g., "Fractions Dragon", "Grammar Sorcerer")
2. Boss appearance description for visual representation
3. Boss HP, attack power, special abilities based on difficulty
4. 10 educational challenges that cover all important concepts from the chapter
5. Each challenge: question, options (for MCQ), correct answer, explanation, concept tested, damage value
6. Special "final blow" question that is the hardest
7. Victory description and rewards

Format as JSON with fields: bossName, backstory, appearance, stats {hp, attack, defense, specialAbilities}, challenges (array of {question, options, correctAnswer, explanation, concept, damage, isFinalBlow}), victoryDescription, rewards`;
}

export function buildChallengePrompt(params: AIGenerateRequest): string {
  return `Generate ${params.difficulty === "hard" || params.difficulty === "expert" ? 10 : 5} educational challenges for:
- Subject: ${params.subject}
- Chapter: ${params.chapter}
- Board: ${params.board}
- Class: ${params.class}
- Difficulty: ${params.difficulty}

Mix of challenge types: MCQ, fill-in-blanks, scenario questions, and mini-puzzles.
Each challenge should:
- Test understanding of the concept
- Include a real-world or story-based context
- Have clear correct answers
- Include explanations for why the answer is correct
- Be age-appropriate

Format as JSON array of {type, question, options (if mcq), correctAnswer, explanation, concept, difficulty, points}.`;
}

export function buildFlashcardPrompt(params: AIGenerateRequest): string {
  return `Create flashcards for revision of:
- Subject: ${params.subject}
- Chapter: ${params.chapter}
- Board: ${params.board}
- Class: ${params.class}
- Difficulty: ${params.difficulty}

Generate 15-20 flashcards covering the most important concepts, definitions, formulas, and key facts.
Each flashcard should have a clear question on one side and concise answer on the other.
Include memory aids or mnemonics where helpful.

Format as JSON array of {front, back, concept, mnemonic (optional)}.`;
}

export function buildSummaryPrompt(params: AIGenerateRequest): string {
  return `Create a comprehensive revision summary for:
- Subject: ${params.subject}
- Chapter: ${params.chapter}
- Board: ${params.board}
- Class: ${params.class}
- Difficulty: ${params.difficulty}

Structure the summary as:
1. Chapter overview (2-3 sentences)
2. Key concepts with brief explanations
3. Important formulas/definitions highlighted
4. Common mistakes to avoid
5. Quick revision tips
6. Practice questions (5 questions with answers)

Format as JSON with fields: overview, concepts (array of {name, explanation, importance}), formulas (array of {name, formula, explanation}), commonMistakes (array), tips (array), practiceQuestions (array of {question, answer, explanation}).`;
}
