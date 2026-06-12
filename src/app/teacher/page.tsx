"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  TrendingUp,
  BookOpen,
  Plus,
  BarChart3,
  ScrollText,
  AlertTriangle,
  ChevronRight,
  School,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ActivityItem {
  id: string;
  type: "joined" | "completed" | "milestone" | "alert";
  message: string;
  time: string;
  student?: string;
}

interface AlertItem {
  id: string;
  student: string;
  subject: string;
  issue: string;
  severity: "low" | "medium" | "high";
}

export default function TeacherDashboard() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const supabase = createClient();

  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    avgProgress: 0,
    subjectsTaught: 0,
  });

  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    if (!loading && (!profile || (profile.role !== "teacher" && profile.role !== "admin"))) {
      router.push("/");
      return;
    }
    if (profile) loadData();
  }, [profile, loading]);

  const loadData = async () => {
    if (!profile?.id) return;
    try {
      const { data: rooms } = await supabase
        .from("classrooms")
        .select("*")
        .eq("teacher_id", profile.id);
      const cls = rooms || [];
      setClassrooms(cls);

      let totalStudents = 0;
      for (const room of cls as any[]) {
        const { count } = await supabase
          .from("classroom_students")
          .select("*", { count: "exact", head: true })
          .eq("classroom_id", room.id);
        totalStudents += count || 0;
      }

      setStats({
        totalStudents,
        activeStudents: Math.floor(totalStudents * 0.75),
        avgProgress: 62,
        subjectsTaught: new Set(cls.map((c: any) => c.subject_id).filter(Boolean)).size,
      });

      const mockActivities: ActivityItem[] = [
        {
          id: "1",
          type: "joined",
          message: "Sarah joined Grade 10 Physics",
          time: "2m ago",
          student: "Sarah",
        },
        {
          id: "2",
          type: "completed",
          message: "Arjun completed 'Newton's Laws' quest",
          time: "15m ago",
          student: "Arjun",
        },
        {
          id: "3",
          type: "milestone",
          message: "Priya reached Level 15!",
          time: "1h ago",
          student: "Priya",
        },
        {
          id: "4",
          type: "alert",
          message: "Rahul struggling with Algebra basics",
          time: "2h ago",
          student: "Rahul",
        },
      ];
      setActivities(mockActivities);

      setAlerts([
        {
          id: "1",
          student: "Rahul K.",
          subject: "Mathematics",
          issue: "Struggling with Algebra",
          severity: "high",
        },
        {
          id: "2",
          student: "Neha S.",
          subject: "Science",
          issue: "Low quiz scores - Chemistry",
          severity: "medium",
        },
        {
          id: "3",
          student: "Amit P.",
          subject: "English",
          issue: "Grammar concepts weak",
          severity: "low",
        },
      ]);
    } catch (err) {
      console.error("Error loading teacher data:", err);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const severityColor = (s: string) => {
    switch (s) {
      case "high": return "border-l-danger bg-danger/5";
      case "medium": return "border-l-accent bg-accent/5";
      case "low": return "border-l-primary bg-primary/5";
      default: return "border-l-border";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Teacher Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {profile.display_name}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/teacher/classrooms">
              <Button variant="primary" size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                Create Classroom
              </Button>
            </Link>
            <Link href="/teacher/analytics">
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-1.5 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalStudents}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Active Students
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.activeStudents}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                    <UserCheck className="h-5 w-5 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Average Progress
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.avgProgress}%
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Subjects Taught
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.subjectsTaught}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                    <BookOpen className="h-5 w-5 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Link href="/teacher/classrooms">
                    <Button
                      variant="outline"
                      className="h-auto w-full flex-col gap-2 py-4"
                    >
                      <School className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-sm font-semibold">
                          Create Classroom
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Set up a new class
                        </p>
                      </div>
                    </Button>
                  </Link>
                  <Link href="/teacher/analytics">
                    <Button
                      variant="outline"
                      className="h-auto w-full flex-col gap-2 py-4"
                    >
                      <BarChart3 className="h-6 w-6 text-accent" />
                      <div>
                        <p className="text-sm font-semibold">
                          View Analytics
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Track performance
                        </p>
                      </div>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="h-auto w-full flex-col gap-2 py-4"
                    onClick={() => router.push("/teacher/classrooms")}
                  >
                    <ScrollText className="h-6 w-6 text-secondary" />
                    <div>
                      <p className="text-sm font-semibold">Assign Quest</p>
                      <p className="text-xs text-muted-foreground">
                        Create assignments
                      </p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          activity.type === "joined" &&
                            "bg-success/10 text-success",
                          activity.type === "completed" &&
                            "bg-primary/10 text-primary",
                          activity.type === "milestone" &&
                            "bg-accent/10 text-accent",
                          activity.type === "alert" &&
                            "bg-danger/10 text-danger"
                        )}
                      >
                        {activity.type === "joined" && (
                          <Users className="h-4 w-4" />
                        )}
                        {activity.type === "completed" && (
                          <Activity className="h-4 w-4" />
                        )}
                        {activity.type === "milestone" && (
                          <TrendingUp className="h-4 w-4" />
                        )}
                        {activity.type === "alert" && (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          {activity.message}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Your Classrooms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {classrooms.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No classrooms yet
                    </p>
                  ) : (
                    classrooms.map((room) => (
                      <Link
                        key={room.id}
                        href={`/teacher/classrooms`}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {room.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {room.subject_id || "No subject"}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))
                  )}
                  <Link href="/teacher/classrooms">
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      View All Classrooms
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-danger" />
                  Performance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alerts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No alerts — all good!
                    </p>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={cn(
                          "rounded-lg border-l-2 px-3 py-2.5",
                          severityColor(alert.severity)
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">
                            {alert.student}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              alert.severity === "high" &&
                                "border-danger/30 text-danger",
                              alert.severity === "medium" &&
                                "border-accent/30 text-accent",
                              alert.severity === "low" &&
                                "border-primary/30 text-primary"
                            )}
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {alert.subject} · {alert.issue}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
