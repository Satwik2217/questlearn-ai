"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BarData {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
}

interface SubjectData {
  name: string;
  averageScore: number;
  color: string;
  trend: "up" | "down" | "stable";
}

interface AnalyticsChartsProps {
  classPerformance: BarData[];
  subjectComparison: SubjectData[];
  weakConcepts: { name: string; mastery: number }[];
}

export function AnalyticsCharts({
  classPerformance,
  subjectComparison,
  weakConcepts,
}: AnalyticsChartsProps) {
  const donutPercentage = (value: number) =>
    Math.min(Math.max(value, 0), 100);

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
    if (trend === "up")
      return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === "down")
      return <TrendingDown className="h-4 w-4 text-danger" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Class Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classPerformance.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-foreground">{item.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {item.value}%
                  </span>
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / item.maxValue) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      item.color || "bg-primary"
                    )}
                    style={
                      item.color && !item.color.startsWith("bg-")
                        ? { backgroundColor: item.color }
                        : undefined
                    }
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subject Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectComparison.map((subject, i) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: subject.color }}
                >
                  {subject.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {subject.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendIcon trend={subject.trend} />
                      {subject.averageScore}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.averageScore}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Donut Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-6">
            {classPerformance.slice(0, 4).map((item, i) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-muted"
                    />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${donutPercentage(item.value)} ${100 - donutPercentage(item.value)}`}
                      strokeLinecap="round"
                      className={
                        item.color?.startsWith("bg-")
                          ? "text-primary"
                          : undefined
                      }
                      style={
                        item.color && !item.color.startsWith("bg-")
                          ? { stroke: item.color }
                          : undefined
                      }
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{
                        strokeDasharray: `${donutPercentage(item.value)} ${100 - donutPercentage(item.value)}`,
                      }}
                      transition={{ duration: 1, delay: i * 0.15 }}
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-foreground">
                    {Math.round(item.value)}%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weak Concepts</CardTitle>
        </CardHeader>
        <CardContent>
          {weakConcepts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No weak concepts identified
            </p>
          ) : (
            <div className="space-y-3">
              {weakConcepts.map((concept, i) => (
                <motion.div
                  key={concept.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground">{concept.name}</span>
                    <span
                      className={cn(
                        "text-xs font-mono",
                        concept.mastery < 30
                          ? "text-danger"
                          : concept.mastery < 60
                            ? "text-accent"
                            : "text-success"
                      )}
                    >
                      {concept.mastery}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${concept.mastery}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className={cn(
                        "h-full rounded-full",
                        concept.mastery < 30
                          ? "bg-danger"
                          : concept.mastery < 60
                            ? "bg-accent"
                            : "bg-success"
                      )}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
