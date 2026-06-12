"use client";

import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils/cn";
import { useGameStore } from "@/store/useGameStore";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface GameLayoutProps {
  children: React.ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sidebarOpen = useGameStore((state) => state.sidebarOpen);
  const setSidebarOpen = useGameStore((state) => state.setSidebarOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile, setSidebarOpen]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen, setSidebarOpen]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      <Sidebar />

      <Navbar onToggleSidebar={handleToggleSidebar} />

      <main
        className={cn(
          "relative min-h-screen transition-all duration-300 pt-16",
          sidebarOpen ? "ml-64" : "ml-[72px]"
        )}
      >
        <div className="animate-fade-in p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
