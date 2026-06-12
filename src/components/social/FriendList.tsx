"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  UserMinus,
  Clock,
  Flame,
  Circle,
  Search,
  X,
  Check,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Friend, Profile } from "@/types";

interface FriendWithProfile extends Friend {
  friend?: Profile;
}

interface FriendListProps {
  friends: FriendWithProfile[];
  pendingRequests: FriendWithProfile[];
  loading?: boolean;
  onAddFriend: (query: string) => Promise<void>;
  onRemoveFriend: (friendId: string) => Promise<void>;
  onAcceptRequest: (requestId: string) => Promise<void>;
  onRejectRequest: (requestId: string) => Promise<void>;
  onViewProfile: (profileId: string) => void;
}

function getOnlineStatus(lastActive: string): {
  label: string;
  color: string;
  dot: string;
} {
  const diff = Date.now() - new Date(lastActive).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 5) return { label: "Online", color: "text-success", dot: "bg-success" };
  if (minutes < 60) return { label: `${minutes}m ago`, color: "text-muted-foreground", dot: "bg-muted-foreground" };
  if (minutes < 1440) return { label: `${Math.floor(minutes / 60)}h ago`, color: "text-muted-foreground", dot: "bg-muted-foreground" };
  return {
    label: `${Math.floor(minutes / 1440)}d ago`,
    color: "text-muted-foreground",
    dot: "bg-muted-foreground",
  };
}

export function FriendList({
  friends,
  pendingRequests,
  loading,
  onAddFriend,
  onRemoveFriend,
  onAcceptRequest,
  onRejectRequest,
  onViewProfile,
}: FriendListProps) {
  const [addQuery, setAddQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = search
    ? friends.filter((f) =>
        f.friend?.display_name.toLowerCase().includes(search.toLowerCase())
      )
    : friends;

  const handleAdd = async () => {
    if (!addQuery.trim()) return;
    setAdding(true);
    try {
      await onAddFriend(addQuery.trim());
      setAddQuery("");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {pendingRequests.length > 0 && (
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Clock className="h-4 w-4 text-accent" />
            Pending Requests ({pendingRequests.length})
          </h3>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center justify-between rounded-xl border border-accent/20 bg-accent/5 p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={req.friend?.avatar_url || undefined} />
                    <AvatarFallback>
                      {req.friend?.display_name?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {req.friend?.display_name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Wants to be your friend
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-success"
                    onClick={() => onAcceptRequest(req.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-danger"
                    onClick={() => onRejectRequest(req.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          <Separator />
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Add friend by name or email..."
          value={addQuery}
          onChange={(e) => setAddQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button
          variant="game-primary"
          size="sm"
          onClick={handleAdd}
          disabled={adding || !addQuery.trim()}
          className="gap-2"
        >
          {adding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          Add
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            {search ? "No friends match your search" : "No friends yet. Add some!"}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((friend) => {
              const status = friend.friend
                ? getOnlineStatus(friend.friend.last_active)
                : { label: "Offline", color: "text-muted-foreground", dot: "bg-muted-foreground" };

              return (
                <motion.div
                  key={friend.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  <div
                    className="flex cursor-pointer items-center gap-3"
                    onClick={() => friend.friend && onViewProfile(friend.friend.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={friend.friend?.avatar_url || undefined}
                        />
                        <AvatarFallback>
                          {friend.friend?.display_name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                          status.dot
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {friend.friend?.display_name || "Unknown"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={cn("flex items-center gap-1", status.color)}>
                          <Circle className={cn("h-1.5 w-1.5 fill-current", status.dot)} />
                          {status.label}
                        </span>
                        {friend.friend && (
                          <>
                            <span>Lv.{friend.friend.level}</span>
                            <span className="flex items-center gap-0.5 text-accent">
                              <Flame className="h-3 w-3" />
                              {friend.friend.streak_days}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        friend.friend && onViewProfile(friend.friend.id)
                      }
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-danger hover:text-danger"
                      onClick={() => onRemoveFriend(friend.id)}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
