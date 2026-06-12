import { type ClassValue } from "clsx";
import { v4 as uuidv4 } from "uuid";
import { cn } from "./cn";

export { cn, uuidv4 };

export function formatXp(xp: number): string {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp.toString();
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function calculateXpForNextLevel(level: number): number {
  return Math.pow(level, 2) * 100;
}

export function calculateXpForCurrentLevel(level: number): number {
  return calculateXpForNextLevel(level - 1);
}

export function getLevelProgress(xp: number): number {
  const level = calculateLevel(xp);
  const currentLevelXp = calculateXpForCurrentLevel(level);
  const nextLevelXp = calculateXpForNextLevel(level);
  const xpIntoLevel = xp - currentLevelXp;
  return Math.min(xpIntoLevel / (nextLevelXp - currentLevelXp), 1);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : plural || `${singular}s`;
}

export function generateCode(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
