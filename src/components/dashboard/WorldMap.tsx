"use client";

import { motion } from "framer-motion";
import {
  Calculator,
  FlaskConical,
  BookOpen,
  Landmark,
  Globe,
} from "lucide-react";
import { WorldCard } from "@/components/game/WorldCard";

const worlds = [
  {
    id: "math",
    name: "Math World",
    description: "Master numbers, algebra, geometry and more in the realm of mathematics.",
    icon: <Calculator className="h-6 w-6" />,
    color: "#8b5cf6",
    progress: 65,
    locked: false,
    completed: false,
  },
  {
    id: "science",
    name: "Science World",
    description: "Explore physics, chemistry, biology and the wonders of science.",
    icon: <FlaskConical className="h-6 w-6" />,
    color: "#22c55e",
    progress: 40,
    locked: false,
    completed: false,
  },
  {
    id: "english",
    name: "English Kingdom",
    description: "Unlock the power of language, literature and creative writing.",
    icon: <BookOpen className="h-6 w-6" />,
    color: "#f59e0b",
    progress: 20,
    locked: false,
    completed: false,
  },
  {
    id: "history",
    name: "History Empire",
    description: "Travel through time and discover the events that shaped our world.",
    icon: <Landmark className="h-6 w-6" />,
    color: "#ef4444",
    progress: 0,
    locked: true,
    completed: false,
  },
  {
    id: "geography",
    name: "Geography Realm",
    description: "Navigate continents, cultures, and the physical world.",
    icon: <Globe className="h-6 w-6" />,
    color: "#3b82f6",
    progress: 0,
    locked: true,
    completed: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function WorldMap() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="game-text text-lg font-bold text-foreground">
          World Map
        </h2>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground"
        >
          {worlds.filter((w) => !w.locked).length} / {worlds.length} unlocked
        </motion.span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {worlds.map((world) => (
          <motion.div key={world.id} variants={itemVariants}>
            <WorldCard {...world} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
