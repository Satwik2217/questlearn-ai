"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  User,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Student {
  id: string;
  name: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  completion_percentage: number;
  accuracy: number;
  last_active: string;
}

interface StudentProgressProps {
  students: Student[];
  onSelectStudent?: (student: Student) => void;
}

type SortKey = keyof Student;
type SortDir = "asc" | "desc";

export function StudentProgress({
  students,
  onSelectStudent,
}: StudentProgressProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
    list.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return list;
  }, [students, search, sortKey, sortDir]);

  const pageCount = Math.ceil(filtered.length / pageSize);
  const pageStudents = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />;
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3 text-primary" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 text-primary" />
    );
  };

  const completionColor = (pct: number) => {
    if (pct >= 80) return "bg-success";
    if (pct >= 50) return "bg-accent";
    if (pct >= 25) return "bg-secondary";
    return "bg-danger";
  };

  const accuracyColor = (acc: number) => {
    if (acc >= 80) return "text-success";
    if (acc >= 50) return "text-accent";
    return "text-danger";
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Student Progress
          </h3>
          <p className="text-sm text-muted-foreground">
            Track individual student performance
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search students..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <User className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-foreground">
            No students found
          </h3>
          <p className="text-sm text-muted-foreground">
            {search
              ? "Try a different search term"
              : "No students enrolled yet"}
          </p>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th
                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    onClick={() => toggleSort("name")}
                  >
                    <span className="inline-flex items-center">
                      Student <SortIcon col="name" />
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    onClick={() => toggleSort("level")}
                  >
                    <span className="inline-flex items-center">
                      Level <SortIcon col="level" />
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    onClick={() => toggleSort("xp")}
                  >
                    <span className="inline-flex items-center">
                      XP <SortIcon col="xp" />
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    onClick={() => toggleSort("completion_percentage")}
                  >
                    <span className="inline-flex items-center">
                      Completion <SortIcon col="completion_percentage" />
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    onClick={() => toggleSort("accuracy")}
                  >
                    <span className="inline-flex items-center">
                      Accuracy <SortIcon col="accuracy" />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pageStudents.map((student, i) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="cursor-pointer transition-colors hover:bg-muted/30"
                    onClick={() => onSelectStudent?.(student)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {student.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="font-mono">
                        Lv.{student.level}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground font-mono">
                        {student.xp.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Progress
                            value={student.completion_percentage}
                            className={cn(
                              "h-1.5",
                              student.completion_percentage >= 80
                                ? "[&>div]:bg-success"
                                : student.completion_percentage >= 50
                                  ? "[&>div]:bg-accent"
                                  : "[&>div]:bg-danger"
                            )}
                          />
                        </div>
                        <span className="w-10 text-right text-xs font-mono text-muted-foreground">
                          {student.completion_percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-sm font-mono font-semibold",
                          accuracyColor(student.accuracy)
                        )}
                      >
                        {student.accuracy}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(student.last_active)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Showing {page * pageSize + 1}-
                {Math.min((page + 1) * pageSize, filtered.length)} of{" "}
                {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: pageCount }, (_, i) => (
                  <Button
                    key={i}
                    variant={i === page ? "default" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page >= pageCount - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
