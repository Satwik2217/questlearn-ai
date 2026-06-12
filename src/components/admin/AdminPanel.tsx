"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BookOpen,
  Layers,
  BarChart3,
  Cpu,
  Settings,
  LayoutDashboard,
  UserCog,
  GraduationCap,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
}

interface AdminPanelProps {
  stats: StatCard[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  children: React.ReactNode;
}

const sections = [
  { id: "users", label: "Users", icon: Users },
  { id: "boards", label: "Boards", icon: Globe },
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "ai-usage", label: "AI Usage", icon: Cpu },
  { id: "subscriptions", label: "Subscriptions", icon: GraduationCap },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AdminPanel({
  stats,
  activeSection,
  onSectionChange,
  children,
}: AdminPanelProps) {
  return (
    <div className="flex gap-6">
      <nav className="hidden w-56 shrink-0 space-y-1 lg:block">
        {sections.map((section) => {
          const Icon = section.icon;
          const active = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary/15 text-primary shadow-[0_0_10px_rgba(139,92,246,0.15)]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{section.label}</span>
              {active && (
                <motion.div
                  layoutId="admin-active"
                  className="ml-auto h-2 w-2 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex-1 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        {stat.trend && stat.trendValue && (
                          <span
                            className={cn(
                              "text-xs",
                              stat.trend === "up"
                                ? "text-success"
                                : "text-danger"
                            )}
                          >
                            {stat.trend === "up" ? "↑" : "↓"} {stat.trendValue}
                          </span>
                        )}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {sections.map((section) => {
            const Icon = section.icon;
            const active = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
