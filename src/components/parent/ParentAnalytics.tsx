"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Download, Minus, Target } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DayData {
  day: string;
  value: number;
}

interface SubjectPerformance {
  name: string;
  score: number;
  classAverage: number;
  color: string;
}

interface ParentAnalyticsProps {
  weeklyActivity: DayData[];
  subjectPerformance: SubjectPerformance[];
  accuracyTrend: DayData[];
  timeTrend: DayData[];
  weakAreas: string[];
}

export function ParentAnalytics({
  weeklyActivity,
  subjectPerformance,
  accuracyTrend,
  timeTrend,
  weakAreas,
}: ParentAnalyticsProps) {
  const maxActivity = Math.max(...weeklyActivity.map((d) => d.value), 1);

  const handleDownload = () => {
    toast.success("Report downloaded successfully");
  };

  const TrendIcon = ({
    current,
    previous,
  }: {
    current: number;
    previous: number;
  }) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-success" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-danger" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Learning Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Weekly performance overview
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="mr-1.5 h-4 w-4" />
          Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              7-Day Activity (minutes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2">
              {weeklyActivity.map((day, i) => (
                <motion.div
                  key={day.day}
                  className="flex flex-1 flex-col items-center gap-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${(day.value / maxActivity) * 120}px`,
                    }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className={cn(
                      "w-full rounded-t-md transition-all",
                      day.value >= maxActivity * 0.7
                        ? "bg-primary"
                        : day.value >= maxActivity * 0.4
                          ? "bg-secondary"
                          : "bg-muted"
                    )}
                    style={{ minHeight: day.value > 0 ? 8 : 0 }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {day.day.slice(0, 3)}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjectPerformance.map((subject, i) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="text-foreground">{subject.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {subject.classAverage > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          avg {subject.classAverage}%
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-xs font-mono font-semibold",
                          subject.score >= 80
                            ? "text-success"
                            : subject.score >= 50
                              ? "text-accent"
                              : "text-danger"
                        )}
                      >
                        {subject.score}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${subject.score}%` }}
                          transition={{ duration: 0.6, delay: i * 0.08 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                      </div>
                    </div>
                    {subject.classAverage > 0 && (
                      <div className="relative flex h-4 w-4 items-center justify-center">
                        <div
                          className="absolute h-0.5 w-4 rounded-full bg-foreground/60"
                          style={{
                            marginTop: `${(subject.classAverage - 50) * 0.5}px`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Accuracy Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-1">
                {accuracyTrend.map((day, i) => (
                  <motion.div
                    key={day.day}
                    className="flex flex-1 flex-col items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className="text-[10px] text-muted-foreground">
                      {day.value}%
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${day.value * 0.8}px` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={cn(
                        "w-full rounded-t-sm",
                        day.value >= 80
                          ? "bg-success"
                          : day.value >= 50
                            ? "bg-accent"
                            : "bg-danger"
                      )}
                      style={{ minHeight: day.value > 0 ? 4 : 0 }}
                    />
                    <span className="text-[9px] text-muted-foreground">
                      {day.day.slice(0, 2)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Areas Needing Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weakAreas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No weak areas identified
                </p>
              ) : (
                <div className="space-y-2">
                  {weakAreas.map((area, i) => (
                    <motion.div
                      key={area}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-2 rounded-lg bg-danger/10 p-2.5"
                    >
                      <Target className="h-4 w-4 text-danger" />
                      <span className="text-sm text-foreground">{area}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
