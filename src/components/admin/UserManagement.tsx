"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { UserRole, Profile } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface UserProfile extends Profile {
  email?: string;
  status?: "active" | "inactive";
}

interface UserManagementProps {
  users: UserProfile[];
  onRefresh: () => void;
}

export function UserManagement({ users, onRefresh }: UserManagementProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(0);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null);
  const [editRole, setEditRole] = useState<UserRole>("student");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");
  const pageSize = 10;

  const supabase = createClient();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        u.display_name.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || (u.status || "active") === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const pageCount = Math.ceil(filtered.length / pageSize);
  const pageUsers = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const openEdit = (user: UserProfile) => {
    setEditUser(user);
    setEditRole(user.role);
    setEditStatus(user.status || "active");
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: editRole, status: editStatus } as never)
        .eq("id", editUser.id);
      if (error) throw error;
      toast.success("User updated successfully");
      setEditUser(null);
      onRefresh();
    } catch (err) {
      toast.error("Failed to update user");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", deleteUser.id);
      if (error) throw error;
      toast.success("User deleted successfully");
      setDeleteUser(null);
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete user");
      console.error(err);
    }
  };

  const roleBadge = (role: UserRole) => {
    const styles: Record<UserRole, string> = {
      admin: "bg-danger/10 text-danger border-danger/20",
      teacher: "bg-primary/10 text-primary border-primary/20",
      parent: "bg-accent/10 text-accent border-accent/20",
      student: "bg-secondary/10 text-secondary border-secondary/20",
    };
    return (
      <Badge variant="outline" className={cn("text-xs", styles[role])}>
        {role}
      </Badge>
    );
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                {roleFilter === "all" ? "All Roles" : roleFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRoleFilter("all")}>
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("student")}>
                Student
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("teacher")}>
                Teacher
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("parent")}>
                Parent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("admin")}>
                Admin
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                {statusFilter === "all" ? "All" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <Shield className="mb-3 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-foreground">
            No users found
          </h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Last Active
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pageUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {user.display_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {user.display_name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {user.email || "—"}
                    </td>
                    <td className="px-4 py-3">{roleBadge(user.role)}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          (user.status || "active") === "active"
                            ? "text-success border-success/30 bg-success/10"
                            : "text-danger border-danger/30 bg-danger/10"
                        )}
                      >
                        {(user.status || "active") === "active" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {user.status || "active"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {timeAgo(user.last_active)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openEdit(user)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => setDeleteUser(user)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
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

      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editUser && (
              <>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {editUser.display_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {editUser.display_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {editUser.email || "No email"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex gap-2">
                    {(["student", "teacher", "parent", "admin"] as UserRole[]).map(
                      (r) => (
                        <Button
                          key={r}
                          variant={editRole === r ? "default" : "outline"}
                          size="sm"
                          onClick={() => setEditRole(r)}
                          className="flex-1 capitalize"
                        >
                          {r}
                        </Button>
                      )
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={editStatus === "active" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEditStatus("active")}
                      className="flex-1"
                    >
                      Active
                    </Button>
                    <Button
                      variant={editStatus === "inactive" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEditStatus("inactive")}
                      className="flex-1"
                    >
                      Inactive
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteUser}
        onOpenChange={(o) => !o && setDeleteUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this user? This will permanently
            remove all associated data including progress, achievements, and
            subscriptions.
          </p>
          {deleteUser && (
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {deleteUser.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {deleteUser.display_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {deleteUser.email || "No email"} · {deleteUser.role}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteUser(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
