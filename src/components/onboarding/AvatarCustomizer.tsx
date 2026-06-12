"use client";

import { motion } from "framer-motion";
import type { CharacterType } from "@/types";
import { cn } from "@/lib/utils/cn";
import {
  Swords,
  Wand2,
  Ghost,
  Crosshair,
  FlaskConical,
  Compass,
} from "lucide-react";

const colorPalette = [
  { name: "Royal Purple", primary: "#8b5cf6", secondary: "#6d28d9" },
  { name: "Ocean Blue", primary: "#3b82f6", secondary: "#1d4ed8" },
  { name: "Emerald Green", primary: "#22c55e", secondary: "#15803d" },
  { name: "Crimson Red", primary: "#ef4444", secondary: "#b91c1c" },
  { name: "Amber Gold", primary: "#f59e0b", secondary: "#b45309" },
  { name: "Cyan Teal", primary: "#06b6d4", secondary: "#0e7490" },
  { name: "Pink Rose", primary: "#f43f5e", secondary: "#be123c" },
  { name: "Slate Gray", primary: "#64748b", secondary: "#334155" },
  { name: "Orange Coral", primary: "#f97316", secondary: "#c2410c" },
  { name: "Lime Green", primary: "#84cc16", secondary: "#4d7c0f" },
  { name: "Violet Indigo", primary: "#a855f7", secondary: "#7c3aed" },
  { name: "Sky Blue", primary: "#38bdf8", secondary: "#0369a1" },
];

const characterIconMap: Record<CharacterType, React.ReactNode> = {
  knight: <Swords className="size-10" />,
  wizard: <Wand2 className="size-10" />,
  ninja: <Ghost className="size-10" />,
  archer: <Crosshair className="size-10" />,
  scientist: <FlaskConical className="size-10" />,
  explorer: <Compass className="size-10" />,
};

interface AvatarCustomizerProps {
  characterType: CharacterType;
  primaryColor: string;
  secondaryColor: string;
  onPrimaryChange: (color: string) => void;
  onSecondaryChange: (color: string) => void;
}

export function AvatarCustomizer({
  characterType,
  primaryColor,
  secondaryColor,
  onPrimaryChange,
  onSecondaryChange,
}: AvatarCustomizerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative"
        >
          <div
            className="size-36 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            <div className="text-white">{characterIconMap[characterType]}</div>
          </div>
          <motion.div
            animate={{
              boxShadow: [
                `0 0 20px ${primaryColor}40`,
                `0 0 40px ${primaryColor}60`,
                `0 0 20px ${primaryColor}40`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 size-36 rounded-full"
          />
        </motion.div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <div
              className="size-4 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
            Primary Color
          </h3>
          <div className="grid grid-cols-6 gap-2">
            {colorPalette.map((color) => (
              <motion.button
                key={color.primary}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onPrimaryChange(color.primary)}
                className={cn(
                  "size-10 rounded-full border-2 transition-all duration-200",
                  primaryColor === color.primary
                    ? "border-foreground scale-110 shadow-lg"
                    : "border-transparent hover:border-slate-500/50"
                )}
                style={{ backgroundColor: color.primary }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <div
              className="size-4 rounded-full"
              style={{ backgroundColor: secondaryColor }}
            />
            Secondary Color
          </h3>
          <div className="grid grid-cols-6 gap-2">
            {colorPalette.map((color) => (
              <motion.button
                key={color.secondary}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSecondaryChange(color.secondary)}
                className={cn(
                  "size-10 rounded-full border-2 transition-all duration-200",
                  secondaryColor === color.secondary
                    ? "border-foreground scale-110 shadow-lg"
                    : "border-transparent hover:border-slate-500/50"
                )}
                style={{ backgroundColor: color.secondary }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
