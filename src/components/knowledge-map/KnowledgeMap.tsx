"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn,
  ZoomOut,
  Move,
  RotateCcw,
  Lock,
  Unlock,
  Play,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillNode } from "./SkillNode";
import { ConceptDetails } from "./ConceptDetails";
import type { ConceptNode, ConceptMastery } from "@/types";

interface KnowledgeMapProps {
  nodes: ConceptNode[];
  masteries: ConceptMastery[];
  connections: { from: string; to: string }[];
  onPractice: (nodeId: string) => void;
  onMarkReviewed: (nodeId: string) => void;
  onNodeSelect?: (nodeId: string) => void;
}

function generateMockNodes(): ConceptNode[] {
  const names = [
    "Algebra Basics", "Linear Equations", "Quadratic Eqs", "Polynomials",
    "Trigonometry", "Calculus Intro", "Differentiation", "Integration",
    "Geometry", "Statistics", "Probability", "Number Theory",
    "Matrices", "Vectors", "Complex Numbers", "Sets & Relations",
  ];
  return names.map((name, i) => ({
    id: `concept-${i + 1}`,
    chapter_id: "ch-math",
    name,
    description: `Comprehensive understanding of ${name.toLowerCase()} and its applications in advanced mathematics.`,
    order: i + 1,
    parent_id: i > 0 ? `concept-${i}` : null,
    x_position: 100 + (i % 4) * 200,
    y_position: 80 + Math.floor(i / 4) * 200,
    created_at: new Date().toISOString(),
  }));
}

function generateMockMasteries(nodes: ConceptNode[]): ConceptMastery[] {
  return nodes.map((node, i) => ({
    id: `mastery-${i + 1}`,
    user_id: "user-1",
    concept_id: node.id,
    mastery_level: i === 0 ? 100 : i < 4 ? 60 : i < 8 ? 30 : 0,
    attempts: i < 4 ? 10 + i * 2 : i < 8 ? 5 + i : 0,
    correct_attempts: i === 0 ? 10 : i < 4 ? Math.round((10 + i * 2) * 0.7) : i < 8 ? Math.round((5 + i) * 0.5) : 0,
    last_practiced: i < 4 ? new Date(Date.now() - i * 86400000).toISOString() : null,
    status: i === 0 ? "mastered" : i < 4 ? "in_progress" : i < 8 ? "unlocked" : "locked",
  }));
}

function generateMockConnections(nodes: ConceptNode[]): { from: string; to: string }[] {
  const connections: { from: string; to: string }[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    if (i % 4 !== 3) {
      connections.push({ from: nodes[i].id, to: nodes[i + 1].id });
    }
    if (i + 4 < nodes.length) {
      connections.push({ from: nodes[i].id, to: nodes[i + 4].id });
    }
  }
  return connections;
}

const legendItems = [
  { label: "Locked", icon: Lock, color: "text-muted-foreground", dot: "bg-muted-foreground/50" },
  { label: "Unlocked", icon: Unlock, color: "text-secondary", dot: "bg-secondary" },
  { label: "In Progress", icon: Play, color: "text-accent", dot: "bg-accent" },
  { label: "Mastered", icon: CheckCircle2, color: "text-success", dot: "bg-success" },
];

const statusColorMap: Record<string, string> = {
  locked: "stroke-muted-foreground/20",
  unlocked: "stroke-secondary/30",
  in_progress: "stroke-accent/30",
  mastered: "stroke-success/40",
};

export function KnowledgeMap({
  nodes: externalNodes,
  masteries: externalMasteries,
  connections: externalConnections,
  onPractice,
  onMarkReviewed,
  onNodeSelect,
}: KnowledgeMapProps) {
  const [nodes] = useState<ConceptNode[]>(externalNodes?.length ? externalNodes : generateMockNodes());
  const [masteries] = useState<ConceptMastery[]>(externalMasteries?.length ? externalMasteries : generateMockMasteries(nodes));
  const [connections] = useState(externalConnections?.length ? externalConnections : generateMockConnections(nodes));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
  const selectedMastery = selectedNodeId
    ? masteries.find((m) => m.concept_id === selectedNodeId)
    : undefined;
  const relatedNodes = selectedNode
    ? nodes.filter(
        (n) =>
          n.id !== selectedNode.id &&
          connections.some(
            (c) =>
              (c.from === selectedNode.id && c.to === n.id) ||
              (c.to === selectedNode.id && c.from === n.id)
          )
      )
    : [];

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId);
      onNodeSelect?.(nodeId);
    },
    [selectedNodeId, onNodeSelect]
  );

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(0.3, Math.min(3, prev * delta)));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0 || e.button === 1) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      }
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        setPosition({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    },
    [isPanning, panStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const masteryPercentage =
    nodes.length > 0
      ? Math.round(
          (masteries.filter((m) => m.status === "mastered").length / nodes.length) * 100
        )
      : 0;

  const getStatus = (nodeId: string): string => {
    return masteries.find((m) => m.concept_id === nodeId)?.status ?? "locked";
  };

  const getEdgeColor = (fromId: string, toId: string): string => {
    const fromStatus = getStatus(fromId);
    const toStatus = getStatus(toId);
    if (fromStatus === "mastered" && toStatus === "mastered") return statusColorMap.mastered;
    if (fromStatus === "in_progress" || toStatus === "in_progress") return statusColorMap.in_progress;
    if (fromStatus === "unlocked" || toStatus === "unlocked") return statusColorMap.unlocked;
    return statusColorMap.locked;
  };

  return (
    <div className="relative flex h-full min-h-[600px] flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="flex items-center gap-3">
          <h3 className="game-text text-sm font-bold text-foreground">
            Knowledge Map
          </h3>
          <Badge variant="outline" className="gap-1 text-xs">
            {masteryPercentage}% Mastered
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {legendItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-muted-foreground"
            >
              <div className={cn("h-2 w-2 rounded-full", item.dot)} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((s) => Math.max(0.3, s - 0.1))}
            className="h-7 w-7 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center text-xs text-muted-foreground">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((s) => Math.min(3, s + 0.1))}
            className="h-7 w-7 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 w-7 p-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative flex flex-1">
        <svg
          ref={svgRef}
          className={cn(
            "h-full w-full",
            isPanning ? "cursor-grabbing" : "cursor-grab"
          )}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <g
            transform={`translate(${position.x}, ${position.y}) scale(${scale})`}
          >
            {connections.map((conn, i) => {
              const from = nodes.find((n) => n.id === conn.from);
              const to = nodes.find((n) => n.id === conn.to);
              if (!from || !to) return null;
              return (
                <line
                  key={i}
                  x1={from.x_position}
                  y1={from.y_position}
                  x2={to.x_position}
                  y2={to.y_position}
                  className={cn(
                    "stroke-2 transition-colors duration-300",
                    getEdgeColor(conn.from, conn.to)
                  )}
                  strokeLinecap="round"
                />
              );
            })}

            {nodes.map((node) => (
              <SkillNode
                key={node.id}
                node={node}
                mastery={masteries.find((m) => m.concept_id === node.id)}
                isSelected={selectedNodeId === node.id}
                onClick={() => handleNodeClick(node.id)}
              />
            ))}
          </g>
        </svg>

        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute right-0 top-0 h-full w-80 border-l border-border bg-card shadow-2xl"
            >
              <ConceptDetails
                node={selectedNode}
                mastery={selectedMastery}
                relatedNodes={relatedNodes}
                onClose={() => setSelectedNodeId(null)}
                onPractice={onPractice}
                onMarkReviewed={onMarkReviewed}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
