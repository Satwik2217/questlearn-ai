"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  CalendarRange,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  Users,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AnalyticsCharts } from "@/components/teacher/AnalyticsCharts";
import { StudentProgress } from "@/components/teacher/StudentProgress";
import { toast } from "sonner";

export default function TeacherAnalytics() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const [dateFrom, setDateFrom] = useState(
    new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0]
  );
  const [dateTo, setDateTo] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeTab, setActiveTab] = useState<"overview" | "students">(
    "overview"
  );

  useEffect(() => {
    if (!loading && (!profile || (profile.role !== "teacher" && profile.role !== "admin"))) {
      router.push("/");
    }
  }, [profile, loading]);

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const handleExport = () => {
    toast.success("Analytics data exported as CSV");
  };

  const classPerformance = [
    { label: "Mathematics", value: 78, maxValue: 100, color: "bg-primary" },
    { label: "Science", value: 65, maxValue: 100, color: "bg-secondary" },
    { label: "English", value: 82, maxValue: 100, color: "bg-accent" },
    { label: "History", value: 59, maxValue: 100, color: "bg-success" },
    { label: "Geography", value: 71, maxValue: 100, color: "bg-danger" },
  ];

  const subjectComparison = [
    {
      name: "Mathematics",
      averageScore: 78,
      color: "#8b5cf6",
      trend: "up" as const,
    },
    {
      name: "Science",
      averageScore: 65,
      color: "#3b82f6",
      trend: "down" as const,
    },
    {
      name: "English",
      averageScore: 82,
      color: "#f59e0b",
      trend: "up" as const,
    },
    {
      name: "History",
      averageScore: 59,
      color: "#22c55e",
      trend: "stable" as const,
    },
    {
      name: "Geography",
      averageScore: 71,
      color: "#ef4444",
      trend: "up" as const,
    },
  ];

  const weakConcepts = [
    { name: "Algebraic Equations", mastery: 34 },
    { name: "Chemical Bonding", mastery: 28 },
    { name: "Grammar - Tenses", mastery: 45 },
    { name: "World War II Timeline", mastery: 52 },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/teacher")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Analytics
              </h1>
              <p className="text-sm text-muted-foreground">
                Track class and student performance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-8 w-36 text-xs"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-8 w-36 text-xs"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-1.5 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
              activeTab === "overview"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart3 className="h-4 w-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
              activeTab === "students"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="h-4 w-4" />
            By Student
          </button>
        </div>

        {activeTab === "overview" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Class Average
                      </p>
                      <p className="text-2xl font-bold text-foreground">71%</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-success">
                      <TrendingUp className="h-3 w-3" /> +5%
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total Students
                      </p>
                      <p className="text-2xl font-bold text-foreground">48</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-success">
                      <TrendingUp className="h-3 w-3" /> +3
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Completion Rate
                      </p>
                      <p className="text-2xl font-bold text-foreground">62%</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-danger">
                      <TrendingDown className="h-3 w-3" /> -2%
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Weak Concepts
                      </p>
                      <p className="text-2xl font-bold text-foreground">4</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/10">
                      <AlertTriangle className="h-4 w-4 text-danger" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <AnalyticsCharts
              classPerformance={classPerformance}
              subjectComparison={subjectComparison}
              weakConcepts={weakConcepts}
            />
          </>
        ) : (
          <StudentProgress students={[]} />
        )}
      </div>
    </div>
  );
}
