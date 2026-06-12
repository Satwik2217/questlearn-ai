"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, CheckCircle2, Play, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ConceptNode, ConceptMastery } from "@/types";

interface SkillNodeProps {
  node: ConceptNode;
  mastery?: ConceptMastery;
  isSelected: boolean;
  onClick: () => void;
}

const statusConfig = {
  locked: {
    icon: Lock,
    color: "text-muted-foreground",
    border: "border-muted-foreground/30",
    bg: "bg-muted/50",
    glow: "",
  },
  unlocked: {
    icon: Unlock,
    color: "text-secondary",
    border: "border-secondary/50",
    bg: "bg-secondary/10",
    glow: "shadow-secondary/20",
  },
  in_progress: {
    icon: Play,
    color: "text-accent",
    border: "border-accent/50",
    bg: "bg-accent/10",
    glow: "shadow-accent/30",
  },
  mastered: {
    icon: CheckCircle2,
    color: "text-success",
    border: "border-success/50",
    bg: "bg-success/10",
    glow: "shadow-success/40",
  },
};

export function SkillNode({ node, mastery, isSelected, onClick }: SkillNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const status = mastery?.status ?? "locked";
  const config = statusConfig[status];
  const Icon = config.icon;
  const masteryLevel = mastery?.mastery_level ?? 0;
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (masteryLevel / 100) * circumference;

  return (
    <motion.g
      style={{ cursor: "pointer" }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        scale: isSelected ? 1.15 : isHovered ? 1.08 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {status === "in_progress" && (
        <motion.circle
          cx={node.x_position}
          cy={node.y_position}
          r={26}
          fill="none"
          stroke="currentColor"
          className="text-accent/30"
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {status === "mastered" && (
        <motion.circle
          cx={node.x_position}
          cy={node.y_position}
          r={28}
          fill="none"
          stroke="currentColor"
          className="text-success/20"
          strokeWidth={3}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <circle
        cx={node.x_position}
        cy={node.y_position}
        r={22}
        className={cn(
          "fill-card stroke-2 transition-colors duration-300",
          config.border,
          config.bg
        )}
        style={{
          filter: isHovered
            ? `drop-shadow(0 0 8px var(--color-${status === "mastered" ? "success" : status === "in_progress" ? "accent" : status === "unlocked" ? "secondary" : "muted"}))`
            : "none",
        }}
      />

      {masteryLevel > 0 && status !== "locked" && (
        <circle
          cx={node.x_position}
          cy={node.y_position}
          r={18}
          fill="none"
          stroke="currentColor"
          className={cn("opacity-30", config.color)}
          strokeWidth={2}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      )}

      {masteryLevel > 0 && status !== "locked" && (
        <motion.circle
          cx={node.x_position}
          cy={node.y_position}
          r={18}
          fill="none"
          stroke="currentColor"
          className={cn(config.color)}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transform: "rotate(-90deg)", transformOrigin: `${node.x_position}px ${node.y_position}px` }}
        />
      )}

      <foreignObject
        x={node.x_position - 22}
        y={node.y_position - 22}
        width={44}
        height={44}
        className="pointer-events-none"
      >
        <div className="flex h-full w-full items-center justify-center">
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>
      </foreignObject>

      <foreignObject
        x={node.x_position - 60}
        y={node.y_position + 28}
        width={120}
        height={40}
        className="pointer-events-none"
      >
        <div className="flex flex-col items-center gap-0.5">
          <span
            className={cn(
              "text-center text-[10px] font-medium leading-tight",
              status === "locked" ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {node.name}
          </span>
          {masteryLevel > 0 && status !== "locked" && (
            <span className={cn("text-[9px] font-mono", config.color)}>
              {masteryLevel}%
            </span>
          )}
        </div>
      </foreignObject>

      {isHovered && (
        <motion.foreignObject
          x={node.x_position + 26}
          y={node.y_position - 30}
          width={160}
          height="auto"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none"
        >
          <div className="rounded-lg border border-border bg-card p-2 shadow-xl shadow-black/40">
            <p className="text-[10px] font-medium text-foreground">{node.name}</p>
            <p className="mt-0.5 text-[9px] text-muted-foreground line-clamp-2">
              {node.description}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[8px] text-muted-foreground">
              <Info className="h-2.5 w-2.5" />
              Status: {status.replace("_", " ")}
            </div>
          </div>
        </motion.foreignObject>
      )}
    </motion.g>
  );
}
