"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function useUser() {
  const { user, profile, loading, initialized, initialize, signOut, refreshProfile } =
    useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  return {
    user,
    profile,
    loading,
    initialized,
    isAuthenticated: !!user,
    signOut,
    refreshProfile,
  };
}
