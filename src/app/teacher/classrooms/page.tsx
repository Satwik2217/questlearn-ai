"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, School } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ClassroomList } from "@/components/teacher/ClassroomList";
import { StudentProgress } from "@/components/teacher/StudentProgress";
import type { Classroom } from "@/types";

export default function ClassroomsPage() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const supabase = createClient();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [studentCounts, setStudentCounts] = useState<
    Record<string, number>
  >({});

  const loadClassrooms = useCallback(async () => {
    if (!profile) return;
    try {
      const { data } = await supabase
        .from("classrooms")
        .select("*")
        .eq("teacher_id", profile.id);
      const rooms = (data || []) as unknown as Classroom[];
      setClassrooms(rooms);

      const counts: Record<string, number> = {};
      for (const room of rooms) {
        const { count } = await supabase
          .from("classroom_students")
          .select("*", { count: "exact", head: true })
          .eq("classroom_id", room.id);
        counts[room.id] = count || 0;
      }
      setStudentCounts(counts);
    } catch (err) {
      console.error("Error loading classrooms:", err);
    }
  }, [profile, supabase]);

  useEffect(() => {
    if (!loading && (!profile || (profile.role !== "teacher" && profile.role !== "admin"))) {
      router.push("/");
      return;
    }
    if (profile) loadClassrooms();
  }, [profile, loading]);

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedClassroom && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedClassroom(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {selectedClassroom
                  ? selectedClassroom.name
                  : "Classroom Management"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {selectedClassroom
                  ? "Manage students and view progress"
                  : "Create and manage your classrooms"}
              </p>
            </div>
          </div>
          {!selectedClassroom && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <School className="h-4 w-4" />
              {classrooms.length} classroom{classrooms.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {selectedClassroom ? (
          <StudentProgress
            students={[]}
            onSelectStudent={(student) =>
              console.log("Selected student:", student)
            }
          />
        ) : (
          <ClassroomList
            classrooms={classrooms.map((c) => ({
              ...c,
              studentCount: studentCounts[c.id] || 0,
            }))}
            onRefresh={loadClassrooms}
            onSelect={(classroom) => setSelectedClassroom(classroom)}
          />
        )}
      </div>
    </div>
  );
}
