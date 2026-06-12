"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Trophy,
  Crown,
  Swords,
  MessageCircle,
  ArrowLeft,
  Loader2,
  LogOut,
  ChevronRight,
  Star,
  Zap,
  Calendar,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressGame } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Profile } from "@/types";

interface Guild {
  id: string;
  name: string;
  description: string;
  emblem: string | null;
  member_count: number;
  max_members: number;
  level: number;
  xp: number;
  xp_to_next: number;
  owner_id: string;
  invite_code: string;
  created_at: string;
}

interface GuildMember {
  id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
  profile: {
    display_name: string;
    avatar_url: string | null;
    character_type: string;
    level: number;
    total_xp: number;
  };
}

interface ChatMessage {
  id: string;
  guild_id: string;
  user_id: string;
  message: string;
  created_at: string;
  profile?: {
    display_name: string;
    avatar_url: string | null;
  };
}

export default function GuildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const { user, profile } = useAuthStore();
  const [guild, setGuild] = useState<Guild | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("members");

  const guildId = params.guildId as string;

  const fetchGuild = useCallback(async () => {
    try {
      const [{ data: guildData }, { data: membersData }, { data: chatData }] = await Promise.all([
        supabase.from("guilds").select("*").eq("id", guildId).single(),
        supabase
          .from("guild_members")
          .select("*, profile:profiles(*)")
          .eq("guild_id", guildId)
          .order("role", { ascending: true }),
        supabase
          .from("guild_chat")
          .select("*, profile:profiles(*)")
          .eq("guild_id", guildId)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      setGuild(guildData as unknown as Guild);
      setMembers(membersData as unknown as GuildMember[]);
      setMessages((chatData || []).reverse() as ChatMessage[]);
    } catch (error) {
      console.error("Failed to fetch guild:", error);
      toast.error("Failed to load guild");
    } finally {
      setLoading(false);
    }
  }, [guildId, supabase]);

  useEffect(() => {
    fetchGuild();
  }, [fetchGuild]);

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim()) return;
    try {
      const { error } = await supabase.from("guild_chat").insert({
        guild_id: guildId,
        user_id: user.id,
        message: newMessage.trim(),
      });

      if (error) throw error;

      setNewMessage("");
      const { data } = await supabase
        .from("guild_chat")
        .select("*, profile:profiles(*)")
        .eq("guild_id", guildId)
        .order("created_at", { ascending: false })
        .limit(50);

      setMessages((data || []).reverse() as ChatMessage[]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleLeave = async () => {
    if (!user || !guild) return;
    try {
      await supabase
        .from("guild_members")
        .delete()
        .eq("guild_id", guildId)
        .eq("user_id", user.id);

      await supabase
        .from("guilds")
        .update({ member_count: guild.member_count - 1 })
        .eq("id", guildId);

      toast.success("Left guild");
      router.push("/guilds");
    } catch (error) {
      console.error("Failed to leave guild:", error);
      toast.error("Failed to leave guild");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!guild) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Guild not found</p>
        <Button variant="outline" onClick={() => router.push("/guilds")}>
          Back to Guilds
        </Button>
      </div>
    );
  }

  const isOwner = guild.owner_id === user?.id;
  const isMember = members.some((m) => m.user_id === user?.id);

  const xpProgress = guild.xp_to_next > 0 ? Math.min(100, Math.round((guild.xp / guild.xp_to_next) * 100)) : 0;

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.push("/guilds")}>
          <ArrowLeft className="h-4 w-4" /> Back to Guilds
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-border bg-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="game-text text-2xl font-bold text-foreground">{guild.name}</h1>
              {isOwner && (
                <Badge variant="accent" className="gap-1">
                  <Crown className="h-3 w-3" /> Owner
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{guild.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {guild.member_count}/{guild.max_members} members
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-accent" /> Level {guild.level}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Created {new Date(guild.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="mt-3 max-w-md space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Guild XP</span>
                <span className="font-medium text-foreground">{guild.xp.toLocaleString()} / {guild.xp_to_next.toLocaleString()}</span>
              </div>
              <ProgressGame value={xpProgress} variant="primary" />
            </div>
          </div>
        </div>

        {isMember && !isOwner && (
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={handleLeave}
          >
            <LogOut className="h-4 w-4" /> Leave Guild
          </Button>
        )}
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" /> Members
            <Badge variant="outline" className="ml-1 text-[10px]">{members.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageCircle className="h-4 w-4" /> Chat
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <Trophy className="h-4 w-4" /> Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="game-text text-lg">Guild Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:border-primary/30"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-muted text-sm font-bold text-foreground">
                        {member.profile?.display_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {member.profile?.display_name || "Unknown"}
                        </p>
                        {member.role === "owner" && (
                          <Badge variant="accent" className="h-5 gap-1 px-1.5 text-[10px]">
                            <Crown className="h-2.5 w-2.5" /> Owner
                          </Badge>
                        )}
                        {member.role === "admin" && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Level {member.profile?.level || 1} | {member.profile?.total_xp?.toLocaleString() || 0} XP
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="game-text text-lg">Guild Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex h-[400px] flex-col gap-3 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2">
                      <Avatar className="mt-0.5 h-7 w-7">
                        <AvatarImage src={msg.profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-muted text-[10px] font-bold">
                          {msg.profile?.display_name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">
                            {msg.profile?.display_name || "Unknown"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {isMember && (
                <div className="flex items-center gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    Send
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="game-text text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  Guild Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-8 text-center">
                  <Swords className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No active challenges</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="game-text text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Member Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {members
                    .sort((a, b) => (b.profile?.total_xp || 0) - (a.profile?.total_xp || 0))
                    .slice(0, 10)
                    .map((member, i) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5"
                      >
                        <span className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                          i === 0 ? "bg-accent/20 text-accent" :
                          i === 1 ? "bg-muted text-muted-foreground" :
                          i === 2 ? "bg-amber-900/20 text-amber-700" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {i + 1}
                        </span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.profile?.avatar_url || undefined} />
                          <AvatarFallback className="bg-muted text-xs font-bold">
                            {member.profile?.display_name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {member.profile?.display_name || "Unknown"}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {member.profile?.total_xp?.toLocaleString() || 0} XP
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
