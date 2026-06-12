"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Gamepad2,
  Bell,
  CreditCard,
  Save,
  CheckCircle2,
  Loader2,
  Shield,
  Volume2,
  Music,
  Palette,
  ChevronRight,
  Crown,
  Star,
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { CharacterType, SubscriptionTier } from "@/types";

const characterOptions: { value: CharacterType; label: string; color: string }[] = [
  { value: "knight", label: "Knight", color: "#8b5cf6" },
  { value: "wizard", label: "Wizard", color: "#3b82f6" },
  { value: "ninja", label: "Ninja", color: "#ef4444" },
  { value: "archer", label: "Archer", color: "#22c55e" },
  { value: "scientist", label: "Scientist", color: "#f59e0b" },
  { value: "explorer", label: "Explorer", color: "#06b6d4" },
];

const subscriptionPlans: { tier: SubscriptionTier; label: string; price: string; features: string[]; color: string }[] = [
  {
    tier: "free",
    label: "Free",
    price: "$0/mo",
    color: "#94a3b8",
    features: ["Basic quests", "1 subject", "Limited AI generations"],
  },
  {
    tier: "premium",
    label: "Premium",
    price: "$9.99/mo",
    color: "#f59e0b",
    features: ["All quests", "All subjects", "Unlimited AI", "Premium items", "Priority support"],
  },
  {
    tier: "school",
    label: "School",
    price: "$4.99/student/mo",
    color: "#22c55e",
    features: ["All premium features", "Classroom management", "Teacher dashboard", "Progress reports"],
  },
  {
    tier: "teacher",
    label: "Teacher",
    price: "Free",
    color: "#8b5cf6",
    features: ["Create classrooms", "Assign quests", "Student analytics", "Custom content"],
  },
];

export default function SettingsPage() {
  const supabase = createClient();
  const { user, profile, refreshProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState("account");
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [accountForm, setAccountForm] = useState({
    displayName: profile?.display_name || "",
    email: user?.email || "",
  });

  const [gameSettings, setGameSettings] = useState({
    soundEffects: true,
    music: true,
    characterType: profile?.character_type || "knight" as CharacterType,
    avatarColors: "#8b5cf6",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    achievementNotifications: true,
    questReminders: true,
    weeklyReport: false,
  });

  const handleSaveAccount = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: accountForm.displayName, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success("Account settings saved");
    } catch (error) {
      console.error("Failed to save account:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGame = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          character_type: gameSettings.characterType,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success("Game settings saved");
    } catch (error) {
      console.error("Failed to save game settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    toast.success("Notification preferences saved");
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="game-text text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your experience</p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="game" className="gap-2">
            <Gamepad2 className="h-4 w-4" /> Game
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2">
            <CreditCard className="h-4 w-4" /> Subscription
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="account" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="game-text text-lg">Account Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={accountForm.displayName}
                      onChange={(e) => setAccountForm({ ...accountForm, displayName: e.target.value })}
                      placeholder="Your display name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        value={accountForm.email}
                        readOnly
                        className="pl-10 opacity-60"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Change Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        className="pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button onClick={handleSaveAccount} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="game" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="game-text text-lg">Audio Settings</CardTitle>
                  <CardDescription>Control sound and music</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Sound Effects</p>
                        <p className="text-xs text-muted-foreground">Quest completions, rewards, UI sounds</p>
                      </div>
                    </div>
                    <Switch
                      checked={gameSettings.soundEffects}
                      onCheckedChange={(v) => setGameSettings({ ...gameSettings, soundEffects: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <Music className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Background Music</p>
                        <p className="text-xs text-muted-foreground">World and battle theme music</p>
                      </div>
                    </div>
                    <Switch
                      checked={gameSettings.music}
                      onCheckedChange={(v) => setGameSettings({ ...gameSettings, music: v })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="game-text text-lg">Character</CardTitle>
                  <CardDescription>Choose your character type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {characterOptions.map((char) => (
                      <button
                        key={char.value}
                        onClick={() => setGameSettings({ ...gameSettings, characterType: char.value })}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-200",
                          gameSettings.characterType === char.value
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                            : "border-border bg-card hover:border-primary/40"
                        )}
                      >
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${char.color}20`, color: char.color }}
                        >
                          <Shield className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium text-foreground">{char.label}</span>
                        {gameSettings.characterType === char.value && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Avatar Color</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={gameSettings.avatarColors}
                        onChange={(e) => setGameSettings({ ...gameSettings, avatarColors: e.target.value })}
                        className="h-10 w-10 cursor-pointer rounded-lg border border-border bg-transparent"
                      />
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{gameSettings.avatarColors}</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleSaveGame} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Game Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="game-text text-lg">Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "pushNotifications", label: "Push Notifications", desc: "Receive push notifications on your device", icon: Bell },
                    { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email", icon: Mail },
                    { key: "achievementNotifications", label: "Achievement Notifications", desc: "Get notified when you unlock achievements", icon: Sparkles },
                    { key: "questReminders", label: "Quest Reminders", desc: "Reminders about pending quests", icon: Star },
                    { key: "weeklyReport", label: "Weekly Report", desc: "Weekly progress summary via email", icon: ChevronRight },
                  ].map((item) => {
                    const Icon = item.icon;
                    const checked = notificationSettings[item.key as keyof typeof notificationSettings];
                    return (
                      <div key={item.key} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={checked}
                          onCheckedChange={(v) =>
                            setNotificationSettings({ ...notificationSettings, [item.key]: v })
                          }
                        />
                      </div>
                    );
                  })}
                  <Button onClick={handleSaveNotifications} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="game-text text-lg">Current Plan</CardTitle>
                  <CardDescription>Your active subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Crown className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-foreground">Free Plan</h3>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Basic features with limited quests</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="game-text text-lg">Upgrade Options</CardTitle>
                  <CardDescription>Unlock more features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {subscriptionPlans.map((plan) => (
                      <div
                        key={plan.tier}
                        className="relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
                      >
                        {plan.tier === "premium" && (
                          <div className="absolute -right-2 -top-2">
                            <Badge variant="accent" className="gap-1">
                              <Sparkles className="h-3 w-3" /> Popular
                            </Badge>
                          </div>
                        )}
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${plan.color}20` }}>
                          <Crown className="h-5 w-5" style={{ color: plan.color }} />
                        </div>
                        <h3 className="mt-3 text-base font-bold text-foreground">{plan.label}</h3>
                        <p className="game-text mt-1 text-xl font-bold" style={{ color: plan.color }}>{plan.price}</p>
                        <ul className="mt-4 flex-1 space-y-2">
                          {plan.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant={plan.tier === "free" ? "outline" : "game-primary"}
                          size="sm"
                          className="mt-4 w-full"
                          disabled={plan.tier === "free"}
                        >
                          {plan.tier === "free" ? "Current" : "Upgrade"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="game-text text-lg text-danger">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" size="sm">
                    Cancel Subscription
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
