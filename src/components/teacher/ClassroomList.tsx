"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Copy,
  Check,
  Users,
  ChevronDown,
  ChevronUp,
  Settings,
  Trash2,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Classroom } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface ClassroomListProps {
  classrooms: Classroom[];
  onRefresh: () => void;
  onSelect: (classroom: Classroom) => void;
}

export function ClassroomList({
  classrooms,
  onRefresh,
  onSelect,
}: ClassroomListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    subject_id: "",
    board: "",
    class: "",
  });

  const supabase = createClient();

  const copyInviteCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      toast.success("Invite code copied!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error("Classroom name is required");
      return;
    }
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }
      const { error } = await supabase.from("classrooms").insert({
        teacher_id: user.id,
        name: form.name.trim(),
        description: form.description.trim(),
        subject_id: form.subject_id || null,
        board: form.board || null,
        class: form.class || null,
        invite_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
      } as never);
      if (error) throw error;
      toast.success("Classroom created!");
      setCreateOpen(false);
      setForm({ name: "", description: "", subject_id: "", board: "", class: "" });
      onRefresh();
    } catch (err) {
      toast.error("Failed to create classroom");
      console.error(err);
    }
  };

  const handleEdit = async () => {
    if (!editOpen || !form.name.trim()) return;
    try {
      const { error } = await supabase
        .from("classrooms")
        .update({
          name: form.name.trim(),
          description: form.description.trim(),
          subject_id: form.subject_id || null,
          board: form.board || null,
          class: form.class || null,
        } as never)
        .eq("id", editOpen);
      if (error) throw error;
      toast.success("Classroom updated!");
      setEditOpen(null);
      setForm({ name: "", description: "", subject_id: "", board: "", class: "" });
      onRefresh();
    } catch (err) {
      toast.error("Failed to update classroom");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteOpen) return;
    try {
      const { error } = await supabase
        .from("classrooms")
        .delete()
        .eq("id", deleteOpen);
      if (error) throw error;
      toast.success("Classroom deleted");
      setDeleteOpen(null);
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete classroom");
      console.error(err);
    }
  };

  const openEdit = (classroom: Classroom) => {
    setEditOpen(classroom.id);
    setForm({
      name: classroom.name,
      description: classroom.description,
      subject_id: classroom.subject_id || "",
      board: classroom.board || "",
      class: classroom.class || "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Classrooms</h2>
          <p className="text-sm text-muted-foreground">
            Manage your classrooms and students
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4" />
              Create Classroom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Classroom</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Classroom Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Grade 10 Physics"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Brief description..."
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Subject ID</Label>
                  <Input
                    value={form.subject_id}
                    onChange={(e) =>
                      setForm({ ...form, subject_id: e.target.value })
                    }
                    placeholder="subject-id"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Board</Label>
                  <Input
                    value={form.board}
                    onChange={(e) =>
                      setForm({ ...form, board: e.target.value })
                    }
                    placeholder="CBSE"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Input
                    value={form.class}
                    onChange={(e) =>
                      setForm({ ...form, class: e.target.value })
                    }
                    placeholder="10"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreate}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {classrooms.length === 0 ? (
        <Card className="border-dashed border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground">
              No classrooms yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first classroom to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {classrooms.map((classroom) => (
              <motion.div
                key={classroom.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <Card
                  className="cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                  onClick={() =>
                    expandedId === classroom.id
                      ? setExpandedId(null)
                      : setExpandedId(classroom.id)
                  }
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">
                        {classroom.name}
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        <Users className="mr-1 h-3 w-3" />
                        {0} students
                      </Badge>
                    </div>
                    {classroom.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {classroom.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-md bg-muted/50 px-3 py-1.5 font-mono text-xs text-muted-foreground">
                        {classroom.invite_code}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyInviteCode(classroom.invite_code, classroom.id);
                        }}
                      >
                        {copiedId === classroom.id ? (
                          <Check className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {expandedId === classroom.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        Click for details
                      </span>
                    </div>
                    <AnimatePresence>
                      {expandedId === classroom.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 space-y-2 overflow-hidden"
                        >
                          <div className="h-2 rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: "0%" }}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelect(classroom);
                              }}
                            >
                              <Users className="mr-1 h-3.5 w-3.5" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEdit(classroom);
                              }}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteOpen(classroom.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={!!editOpen} onOpenChange={(o) => !o && setEditOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Classroom</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Classroom Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Subject ID</Label>
                <Input
                  value={form.subject_id}
                  onChange={(e) =>
                    setForm({ ...form, subject_id: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Board</Label>
                <Input
                  value={form.board}
                  onChange={(e) => setForm({ ...form, board: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Input
                  value={form.class}
                  onChange={(e) => setForm({ ...form, class: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditOpen(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEdit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteOpen} onOpenChange={(o) => !o && setDeleteOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Classroom</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this classroom? This action cannot
            be undone and will remove all student enrollments.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
