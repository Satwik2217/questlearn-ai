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

interface CharacterOption {
  type: CharacterType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const characters: CharacterOption[] = [
  {
    type: "knight",
    name: "Knight",
    description: "Brave and strong, excels in combat challenges",
    icon: <Swords className="size-8" />,
    color: "from-blue-500 to-cyan-400",
  },
  {
    type: "wizard",
    name: "Wizard",
    description: "Master of spells and knowledge seeker",
    icon: <Wand2 className="size-8" />,
    color: "from-purple-500 to-pink-400",
  },
  {
    type: "ninja",
    name: "Ninja",
    description: "Swift and stealthy, quick problem solver",
    icon: <Ghost className="size-8" />,
    color: "from-slate-600 to-slate-400",
  },
  {
    type: "archer",
    name: "Archer",
    description: "Precise and focused, sharp-minded strategist",
    icon: <Crosshair className="size-8" />,
    color: "from-green-500 to-emerald-400",
  },
  {
    type: "scientist",
    name: "Scientist",
    description: "Inventive and analytical, loves experiments",
    icon: <FlaskConical className="size-8" />,
    color: "from-amber-500 to-orange-400",
  },
  {
    type: "explorer",
    name: "Explorer",
    description: "Curious adventurer, discovers hidden knowledge",
    icon: <Compass className="size-8" />,
    color: "from-rose-500 to-red-400",
  },
];

interface CharacterSelectProps {
  value: CharacterType;
  onChange: (type: CharacterType) => void;
}

export function CharacterSelect({ value, onChange }: CharacterSelectProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {characters.map((character, index) => {
          const isSelected = value === character.type;
          return (
            <motion.button
              key={character.type}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(character.type)}
              className={cn(
                "relative group flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-300",
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-slate-700/50 bg-slate-800/40 hover:border-slate-500/50 hover:bg-slate-800/60"
              )}
            >
              <div
                className={cn(
                  "size-16 rounded-full flex items-center justify-center bg-gradient-to-br transition-transform duration-300",
                  character.color,
                  isSelected && "scale-110 shadow-lg shadow-white/10"
                )}
              >
                <div className="text-white">{character.icon}</div>
              </div>
              <div className="text-center">
                <h3
                  className={cn(
                    "font-bold text-sm",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {character.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-tight">
                  {character.description}
                </p>
              </div>
              {isSelected && (
                <motion.div
                  layoutId="character-select-indicator"
                  className="absolute -top-2 -right-2 size-6 bg-primary rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <svg
                    className="size-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
