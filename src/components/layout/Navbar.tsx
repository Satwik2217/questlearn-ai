"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Bell,
  Zap,
  Flame,
  Volume2,
  VolumeX,
  Music,
  Music2,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Swords,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/useAuthStore";
import { useGameStore } from "@/store/useGameStore";

export function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);
  const coins = useGameStore((state) => state.coins);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const musicEnabled = useGameStore((state) => state.musicEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const toggleMusic = useGameStore((state) => state.toggleMusic);
  const sidebarOpen = useGameStore((state) => state.sidebarOpen);
  const toggleSidebar = useGameStore((state) => state.toggleSidebar);
  const notificationCount = useGameStore((state) => state.notificationCount);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 flex h-16 items-center gap-4 border-b border-border",
        "bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50",
        "transition-all duration-300",
        sidebarOpen ? "left-64" : "left-[72px]"
      )}
    >
      <div className="flex flex-1 items-center gap-4 px-4">
        <button
          onClick={onToggleSidebar || toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          <Swords className="h-5 w-5 text-primary" />
          <span className="game-text text-sm font-semibold text-foreground">
            QuestLearn AI
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4">
        <motion.div
          className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-1.5"
          whileHover={{ scale: 1.02 }}
        >
          <Zap className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">
            {profile?.total_xp || 0}
          </span>
        </motion.div>

        <motion.div
          className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-1.5"
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-yellow-400">✦</span>
          <span className="text-sm font-semibold text-foreground">{coins}</span>
        </motion.div>

        {profile && profile.streak_days > 0 && (
          <motion.div
            className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-3 py-1.5 text-orange-400"
            whileHover={{ scale: 1.02 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Flame className="h-4 w-4" />
            <span className="text-sm font-semibold">
              {profile.streak_days}
            </span>
          </motion.div>
        )}

        <button
          onClick={toggleSound}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={toggleMusic}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {musicEnabled ? (
            <Music2 className="h-4 w-4" />
          ) : (
            <Music className="h-4 w-4" />
          )}
        </button>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
              {profile?.display_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </button>

          <AnimatePresence>
            {profileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
              >
                <div className="border-b border-border bg-muted/50 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">
                    {profile?.display_name || "Adventurer"}
                  </p>
                  <p className="game-text text-xs text-primary">
                    Level {profile?.level || 1}
                  </p>
                </div>
                <div className="p-1">
                  <Link
                    href="/profile"
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={() => {
                      setProfileDropdown(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full border-b border-border bg-card px-4 py-3 shadow-xl md:hidden"
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-4 w-4 text-accent" />
                <span className="font-semibold text-foreground">
                  {profile?.total_xp || 0} XP
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-yellow-400">✦</span>
                <span className="font-semibold text-foreground">
                  {coins} coins
                </span>
              </div>
              {profile && profile.streak_days > 0 && (
                <div className="flex items-center gap-1 text-orange-400">
                  <Flame className="h-4 w-4" />
                  <span className="font-semibold">{profile.streak_days}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
