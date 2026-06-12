"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FriendList } from "@/components/social/FriendList";
import type { Friend, Profile } from "@/types";

interface FriendWithProfile extends Friend {
  friend?: Profile;
}

export default function FriendsPage() {
  const supabase = createClient();
  const { user, profile } = useAuthStore();
  const [friends, setFriends] = useState<FriendWithProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendWithProfile[]>(
    []
  );
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [friendsRes, pendingRes, suggestionsRes] = await Promise.all([
        supabase
          .from("friends")
          .select("*, friend:profiles!friends_friend_id_fkey(*)")
          .eq("user_id", user.id)
          .eq("status", "accepted"),
        supabase
          .from("friends")
          .select("*, friend:profiles!friends_friend_id_fkey(*)")
          .eq("friend_id", user.id)
          .eq("status", "pending"),
        supabase
          .from("profiles")
          .select("*")
          .neq("id", user.id)
          .limit(6),
      ]);

      if (friendsRes.error) throw friendsRes.error;
      if (pendingRes.error) throw pendingRes.error;
      if (suggestionsRes.error) throw suggestionsRes.error;

      setFriends(
        (friendsRes.data || []) as unknown as FriendWithProfile[]
      );
      setPendingRequests(
        (pendingRes.data || []) as unknown as FriendWithProfile[]
      );
      setSuggestions((suggestionsRes.data || []) as Profile[]);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
      toast.error("Failed to load friends");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleAddFriend = async (query: string) => {
    try {
      const { data: foundProfile } = await supabase
        .from("profiles")
        .select("id")
        .or(`display_name.ilike.%${query}%,email.ilike.%${query}%`)
        .maybeSingle();

      if (!foundProfile) {
        toast.error("User not found");
        return;
      }

      if (foundProfile.id === user?.id) {
        toast.error("You cannot add yourself");
        return;
      }

      const { error } = await supabase.from("friends").insert({
        user_id: user!.id,
        friend_id: foundProfile.id,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("Friend request already sent");
          return;
        }
        throw error;
      }

      toast.success("Friend request sent!");
      fetchFriends();
    } catch (error) {
      console.error("Failed to add friend:", error);
      toast.error("Failed to send friend request");
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from("friends")
        .delete()
        .eq("id", friendId);

      if (error) throw error;

      toast.success("Friend removed");
      fetchFriends();
    } catch (error) {
      console.error("Failed to remove friend:", error);
      toast.error("Failed to remove friend");
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("friends")
        .update({ status: "accepted" })
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Friend request accepted!");
      fetchFriends();
    } catch (error) {
      console.error("Failed to accept request:", error);
      toast.error("Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("friends")
        .update({ status: "blocked" })
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Request rejected");
      fetchFriends();
    } catch (error) {
      console.error("Failed to reject request:", error);
      toast.error("Failed to reject request");
    }
  };

  const handleViewProfile = (profileId: string) => {
    window.location.href = `/profile/${profileId}`;
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="game-text text-3xl font-bold text-foreground">
            Friends
          </h1>
          <p className="text-sm text-muted-foreground">
            Connect with friends and classmates
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchFriends}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Friends",
            value: friends.length,
            icon: Users,
          },
          {
            label: "Pending",
            value: pendingRequests.length,
            icon: UserPlus,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="friends">
        <TabsList>
          <TabsTrigger value="friends" className="gap-2">
            <Users className="h-4 w-4" />
            Friends
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Suggestions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-6">
          <FriendList
            friends={friends}
            pendingRequests={pendingRequests}
            loading={loading}
            onAddFriend={handleAddFriend}
            onRemoveFriend={handleRemoveFriend}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onViewProfile={handleViewProfile}
          />
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          {suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No suggestions available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {suggestion.display_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Lv.{suggestion.level} -{" "}
                      {suggestion.total_xp.toLocaleString()} XP
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() =>
                      handleAddFriend(suggestion.display_name)
                    }
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Add
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
