"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  Globe,
  Backpack,
  Trophy,
  ScrollText,
  BarChart3,
  Map,
  User,
  ChevronLeft,
  ChevronRight,
  Swords,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/useAuthStore";
import { useGameStore } from "@/store/useGameStore";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Compass },
  { href: "/worlds", label: "Worlds", icon: Globe },
  { href: "/inventory", label: "Inventory", icon: Backpack },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/quests", label: "Quests", icon: ScrollText },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
  { href: "/knowledge-map", label: "Knowledge Map", icon: Map },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useGameStore((state) => state.sidebarOpen);
  const toggleSidebar = useGameStore((state) => state.toggleSidebar);
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);
  const coins = useGameStore((state) => state.coins);

  const xpProgress = profile
    ? ((profile.total_xp % 100) / 100) * 100
    : 0;

  const isActive = useCallback(
    (href: string) => {
      if (href === "/dashboard") return pathname === "/dashboard";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        initial={{ width: sidebarOpen ? 256 : 72 }}
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card/95 backdrop-blur-xl",
          "overflow-hidden"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <Swords className="h-6 w-6 text-primary" />
                <span className="game-text text-lg font-bold text-foreground">
                  QuestLearn
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary/15 text-primary shadow-[0_0_10px_rgba(139,92,246,0.15)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    "relative z-10 h-5 w-5 transition-transform duration-200",
                    active && "animate-xp-glow"
                  )}
                />
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="relative z-10 truncate"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && (
                  <span className="absolute right-2 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white shadow-lg">
                    {profile?.display_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {profile?.display_name || "Adventurer"}
                    </p>
                    <p className="game-text text-xs text-primary">
                      Level {profile?.level || 1}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">XP</span>
                    <span className="text-accent font-semibold">
                      {profile?.total_xp || 0} XP
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-400">✦</span> {coins} coins
                  </span>
                </div>

                <div className="flex gap-1.5 pt-1">
                  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Settings className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={signOut}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white shadow-lg">
                  {profile?.display_name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <button
                  onClick={signOut}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
