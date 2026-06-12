"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Plus,
  LogIn,
  Users,
  Search,
  X,
  Loader2,
  RefreshCw,
  Hash,
  Crown,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GuildCard, GuildCardSkeleton } from "@/components/social/GuildCard";

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
  guild_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
  profile?: {
    display_name: string;
    avatar_url: string | null;
    character_type: string;
    level: number;
  };
}

export default function GuildsPage() {
  const supabase = createClient();
  const { user, profile } = useAuthStore();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [myGuilds, setMyGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [createForm, setCreateForm] = useState({ name: "", description: "" });
  const [joinCode, setJoinCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchGuilds = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: membership } = await supabase
        .from("guild_members")
        .select("guild_id")
        .eq("user_id", user.id);

      const myGuildIds = (membership || []).map((m) => m.guild_id);

      const [{ data: all }, { data: mine }] = await Promise.all([
        supabase.from("guilds").select("*").order("member_count", { ascending: false }),
        myGuildIds.length > 0
          ? supabase.from("guilds").select("*").in("id", myGuildIds)
          : { data: [] },
      ]);

      setGuilds((all || []) as Guild[]);
      setMyGuilds((mine || []) as Guild[]);
    } catch (error) {
      console.error("Failed to fetch guilds:", error);
      toast.error("Failed to load guilds");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchGuilds();
  }, [fetchGuilds]);

  const handleCreateGuild = async () => {
    if (!user || !createForm.name.trim()) return;
    setSubmitting(true);
    try {
      const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { data: guild, error } = await supabase
        .from("guilds")
        .insert({
          name: createForm.name.trim(),
          description: createForm.description.trim(),
          owner_id: user.id,
          invite_code: inviteCode,
          member_count: 1,
          max_members: 50,
          level: 1,
          xp: 0,
          xp_to_next: 1000,
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from("guild_members").insert({
        guild_id: guild.id,
        user_id: user.id,
        role: "owner",
      });

      toast.success(`Guild "${createForm.name}" created!`);
      setShowCreate(false);
      setCreateForm({ name: "", description: "" });
      fetchGuilds();
    } catch (error) {
      console.error("Failed to create guild:", error);
      toast.error("Failed to create guild");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinByCode = async () => {
    if (!user || !joinCode.trim()) return;
    setSubmitting(true);
    try {
      const { data: guild, error } = await supabase
        .from("guilds")
        .select("*")
        .eq("invite_code", joinCode.trim().toUpperCase())
        .single();

      if (error || !guild) {
        toast.error("Invalid invite code");
        return;
      }

      if (guild.member_count >= guild.max_members) {
        toast.error("Guild is full");
        return;
      }

      await supabase.from("guild_members").insert({
        guild_id: guild.id,
        user_id: user.id,
        role: "member",
      });

      await supabase
        .from("guilds")
        .update({ member_count: guild.member_count + 1 })
        .eq("id", guild.id);

      toast.success(`Joined ${guild.name}!`);
      setShowJoin(false);
      setJoinCode("");
      fetchGuilds();
    } catch (error) {
      console.error("Failed to join guild:", error);
      toast.error("Failed to join guild");
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinGuild = async (guildId: string) => {
    if (!user) return;
    try {
      const guild = guilds.find((g) => g.id === guildId);
      if (!guild) return;

      if (guild.member_count >= guild.max_members) {
        toast.error("Guild is full");
        return;
      }

      await supabase.from("guild_members").insert({
        guild_id: guildId,
        user_id: user.id,
        role: "member",
      });

      await supabase
        .from("guilds")
        .update({ member_count: guild.member_count + 1 })
        .eq("id", guildId);

      toast.success(`Joined ${guild.name}!`);
      fetchGuilds();
    } catch (error) {
      console.error("Failed to join guild:", error);
      toast.error("Failed to join guild");
    }
  };

  const filteredGuilds = guilds.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="game-text text-3xl font-bold text-foreground">Guilds & Study Teams</h1>
          <p className="text-sm text-muted-foreground">Join or create a study team to learn together</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showJoin} onOpenChange={setShowJoin}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" /> Join by Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="game-text">Join a Guild</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite Code</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="inviteCode"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="Enter invite code"
                      className="pl-10 font-mono uppercase"
                      maxLength={8}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleJoinByCode}
                  disabled={submitting || !joinCode.trim()}
                  className="w-full gap-2"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                  Join Guild
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button variant="game-primary" size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Create Guild
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="game-text">Create a Guild</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guildName">Guild Name</Label>
                  <Input
                    id="guildName"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="Enter guild name"
                    maxLength={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guildDesc">Description</Label>
                  <textarea
                    id="guildDesc"
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="Describe your guild..."
                    className="flex min-h-[80px] w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    maxLength={500}
                  />
                </div>
                <Button
                  onClick={handleCreateGuild}
                  disabled={submitting || !createForm.name.trim()}
                  className="w-full gap-2"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                  Create Guild
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guilds..."
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <GuildCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="discover" className="w-full">
          <TabsList>
            <TabsTrigger value="discover" className="gap-2">
              <Search className="h-4 w-4" /> Discover
            </TabsTrigger>
            <TabsTrigger value="my-guilds" className="gap-2">
              <Shield className="h-4 w-4" /> My Guilds
              {myGuilds.length > 0 && (
                <Badge variant="outline" className="ml-1 text-[10px]">
                  {myGuilds.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="mt-6">
            {filteredGuilds.length === 0 ? (
              <div className="flex flex-col items-center py-24 text-center">
                <Shield className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No guilds match your search" : "No guilds available"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGuilds.map((guild, i) => (
                  <GuildCard
                    key={guild.id}
                    id={guild.id}
                    name={guild.name}
                    description={guild.description}
                    memberCount={guild.member_count}
                    maxMembers={guild.max_members}
                    level={guild.level}
                    xp={guild.xp}
                    xpToNext={guild.xp_to_next}
                    isMember={myGuilds.some((g) => g.id === guild.id)}
                    isOwner={guild.owner_id === user?.id}
                    onJoin={handleJoinGuild}
                    onView={(id) => window.location.href = `/guilds/${id}`}
                    index={i}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-guilds" className="mt-6">
            {myGuilds.length === 0 ? (
              <div className="flex flex-col items-center py-24 text-center">
                <Shield className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">You haven't joined any guilds yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-2"
                  onClick={() => setShowCreate(true)}
                >
                  <Plus className="h-4 w-4" /> Create One
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myGuilds.map((guild, i) => (
                  <GuildCard
                    key={guild.id}
                    id={guild.id}
                    name={guild.name}
                    description={guild.description}
                    memberCount={guild.member_count}
                    maxMembers={guild.max_members}
                    level={guild.level}
                    xp={guild.xp}
                    xpToNext={guild.xp_to_next}
                    isMember
                    isOwner={guild.owner_id === user?.id}
                    onView={(id) => window.location.href = `/guilds/${id}`}
                    index={i}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
