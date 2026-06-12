"use client";

import { motion } from "framer-motion";
import {
  X,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Link2,
  Swords,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressGame } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { ConceptNode, ConceptMastery } from "@/types";

interface ConceptDetailsProps {
  node: ConceptNode;
  mastery?: ConceptMastery;
  relatedNodes: ConceptNode[];
  onClose: () => void;
  onPractice: (nodeId: string) => void;
  onMarkReviewed: (nodeId: string) => void;
}

export function ConceptDetails({
  node,
  mastery,
  relatedNodes,
  onClose,
  onPractice,
  onMarkReviewed,
}: ConceptDetailsProps) {
  const status = mastery?.status ?? "locked";
  const masteryLevel = mastery?.mastery_level ?? 0;
  const attempts = mastery?.attempts ?? 0;
  const correctAttempts = mastery?.correct_attempts ?? 0;
  const accuracy = attempts > 0 ? Math.round((correctAttempts / attempts) * 100) : 0;
  const lastPracticed = mastery?.last_practiced
    ? new Date(mastery.last_practiced).toLocaleDateString()
    : "Never";

  const statusColors = {
    locked: "text-muted-foreground border-muted-foreground/30 bg-muted/10",
    unlocked: "text-secondary border-secondary/30 bg-secondary/10",
    in_progress: "text-accent border-accent/30 bg-accent/10",
    mastered: "text-success border-success/30 bg-success/10",
  };

  const statusLabels = {
    locked: "Locked",
    unlocked: "Unlocked",
    in_progress: "In Progress",
    mastered: "Mastered",
  };

  const handlePractice = () => {
    onPractice(node.id);
    toast.success(`Starting practice for "${node.name}"`);
  };

  const handleMarkReviewed = () => {
    onMarkReviewed(node.id);
    toast.success(`"${node.name}" marked as reviewed`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex h-full flex-col"
    >
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="game-text text-sm font-bold text-foreground">
          Concept Details
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-lg font-bold text-foreground">{node.name}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {node.description}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn("shrink-0 text-xs", statusColors[status])}
            >
              {statusLabels[status]}
            </Badge>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Mastery Progress
            </span>
            <span className="text-xs font-bold text-foreground">{masteryLevel}%</span>
          </div>
          <ProgressGame
            value={masteryLevel}
            variant={
              status === "mastered"
                ? "success"
                : status === "in_progress"
                  ? "accent"
                  : status === "unlocked"
                    ? "secondary"
                    : "primary"
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Last Practiced",
              value: lastPracticed,
              icon: Clock,
              color: "text-muted-foreground",
            },
            {
              label: "Total Attempts",
              value: attempts,
              icon: Target,
              color: "text-secondary",
            },
            {
              label: "Accuracy",
              value: `${accuracy}%`,
              icon: TrendingUp,
              color: accuracy >= 80 ? "text-success" : accuracy >= 50 ? "text-accent" : "text-danger",
            },
            {
              label: "Status",
              value: statusLabels[status],
              icon: BookOpen,
              color: statusColors[status].split(" ")[0],
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-muted/30 p-3"
            >
              <div className="flex items-center gap-1.5">
                <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                <span className="text-[10px] text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {relatedNodes.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Related Concepts
                </span>
              </div>
              <div className="space-y-2">
                {relatedNodes.map((related) => (
                  <div
                    key={related.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {related.name}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {related.description}
                      </p>
                    </div>
                    <button
                      onClick={() => onPractice(related.id)}
                      className="shrink-0 text-xs text-primary hover:text-primary/80"
                    >
                      Practice
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="space-y-3">
          <Button
            variant="game-primary"
            className="w-full gap-2"
            onClick={handlePractice}
          >
            <Swords className="h-4 w-4" />
            Practice Now
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleMarkReviewed}
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark as Reviewed
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
