"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  School,
  DollarSign,
  Cpu,
  TrendingUp,
  TrendingDown,
  Globe,
  BookOpen,
  GraduationCap,
  Settings,
  Key,
  Plus,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { UserManagement } from "@/components/admin/UserManagement";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const supabase = createClient();
  const [activeSection, setActiveSection] = useState("users");

  useEffect(() => {
    if (!loading && profile?.role !== "admin") {
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

  const stats = [
    { label: "Total Users", value: "2,847", icon: Users, trend: "up" as const, trendValue: "12% this month" },
    { label: "Active Users", value: "1,893", icon: Activity, trend: "up" as const, trendValue: "8% this month" },
    { label: "Total Classrooms", value: "156", icon: School, trend: "up" as const, trendValue: "5 new this week" },
    { label: "Revenue (MRR)", value: "$12,450", icon: DollarSign, trend: "up" as const, trendValue: "18% this month" },
  ];

  const sectionContent = () => {
    switch (activeSection) {
      case "users":
        return (
          <div className="space-y-4">
            <UserManagement
              users={[]}
              onRefresh={() => {}}
            />
          </div>
        );

      case "boards":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Board Management
              </h3>
              <Button variant="primary" size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                Add Board
              </Button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                      Board
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                      Subjects
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                      Classes
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                      Students
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { board: "CBSE", subjects: 12, classes: "1-12", students: 1250 },
                    { board: "ICSE", subjects: 10, classes: "1-12", students: 420 },
                    { board: "IGCSE", subjects: 8, classes: "9-12", students: 310 },
                    { board: "State Board", subjects: 6, classes: "1-12", students: 867 },
                  ].map((b, i) => (
                    <tr key={b.board} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            {b.board}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {b.subjects}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {b.classes}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {b.students}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "subjects":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Subject Management
              </h3>
              <Button variant="primary" size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                Add Subject
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Mathematics", icon: "📐", chapters: 24, students: 1250, color: "#8b5cf6" },
                { name: "Science", icon: "🔬", chapters: 20, students: 980, color: "#3b82f6" },
                { name: "English", icon: "📖", chapters: 18, students: 1120, color: "#f59e0b" },
                { name: "History", icon: "🏛️", chapters: 15, students: 670, color: "#22c55e" },
                { name: "Geography", icon: "🌍", chapters: 14, students: 540, color: "#ef4444" },
                { name: "Computer Science", icon: "💻", chapters: 12, students: 430, color: "#06b6d4" },
              ].map((subject, i) => (
                <motion.div
                  key={subject.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="cursor-pointer transition-all hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                            style={{ backgroundColor: `${subject.color}20` }}
                          >
                            {subject.icon}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {subject.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {subject.chapters} chapters · {subject.students} students
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Settings className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">
              System Analytics
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Signups (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-1">
                    {[12, 18, 8, 24, 15, 20, 10].map((val, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${val * 4}px` }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          className="w-full rounded-t-sm bg-primary"
                        />
                        <span className="text-[9px] text-muted-foreground">
                          {["M", "T", "W", "T", "F", "S", "S"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">New Signups Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">24</p>
                  <p className="text-xs text-success">↑ 15% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">2,847</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>1,245 Students</span>
                    <span>89 Teachers</span>
                    <span>1,513 Parents</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "ai-usage":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">
              AI Usage Metrics
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-primary" />
                    Total Generations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">45,892</p>
                  <p className="text-xs text-success">↑ 22% this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-accent" />
                    Tokens Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">
                    12.4M
                  </p>
                  <p className="text-xs text-accent">≈ $248.00 cost</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-secondary" />
                    Avg. Generation Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">1.2s</p>
                  <p className="text-xs text-success">↓ 0.3s from last week</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Generations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                          User
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                          Model
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                          Tokens
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { user: "Teacher Sarah", type: "Lesson", model: "GPT-4o", tokens: 2450, time: "2m ago" },
                        { user: "Student Arjun", type: "Quiz", model: "GPT-4o-mini", tokens: 890, time: "5m ago" },
                        { user: "Teacher Raj", type: "Story", model: "GPT-4o", tokens: 3200, time: "12m ago" },
                        { user: "Student Priya", type: "Challenge", model: "GPT-4o-mini", tokens: 650, time: "18m ago" },
                      ].map((gen, i) => (
                        <tr key={i} className="transition-colors hover:bg-muted/30">
                          <td className="px-4 py-3 text-sm text-foreground">{gen.user}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">{gen.type}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{gen.model}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{gen.tokens.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{gen.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "subscriptions":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">
              Subscription Analytics
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Total Subscribers</p>
                  <p className="text-2xl font-bold text-foreground">1,245</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Free Tier</p>
                  <p className="text-2xl font-bold text-foreground">856</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Premium</p>
                  <p className="text-2xl font-bold text-foreground">312</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">School Plans</p>
                  <p className="text-2xl font-bold text-foreground">77</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Subscription Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { tier: "Free", percentage: 69, color: "bg-muted" },
                    { tier: "Premium", percentage: 25, color: "bg-primary" },
                    { tier: "School", percentage: 6, color: "bg-accent" },
                  ].map((t) => (
                    <div key={t.tier}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-foreground">{t.tier}</span>
                        <span className="text-xs text-muted-foreground">{t.percentage}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${t.color}`}
                          style={{ width: `${t.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">
              Settings
            </h3>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Maintenance Mode
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Disable all user access
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">Off</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      AI Content Generation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Allow teachers to generate content via AI
                    </p>
                  </div>
                  <Badge variant="success" className="text-xs">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Registration
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Allow new user registrations
                    </p>
                  </div>
                  <Badge variant="success" className="text-xs">Open</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">API Keys & Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "OpenAI API", key: "sk-...a3f8", status: "active" },
                  { name: "Supabase URL", key: "https://...supabase.co", status: "active" },
                ].map((api) => (
                  <div key={api.name} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{api.name}</p>
                        <p className="text-xs font-mono text-muted-foreground">{api.key}</p>
                      </div>
                    </div>
                    <Badge variant="success" className="text-xs">{api.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage users, content, and platform settings
          </p>
        </div>

        <AdminPanel
          stats={stats}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        >
          {sectionContent()}
        </AdminPanel>
      </div>
    </div>
  );
}
