import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, BattleState } from "@/types";

interface GameState {
  // Profile
  profile: Profile | null;
  setProfile: (profile: Profile) => void;

  // Sound
  soundEnabled: boolean;
  musicEnabled: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;

  // Battle
  battleState: BattleState | null;
  setBattleState: (state: BattleState | null) => void;
  updateBattleState: (partial: Partial<BattleState>) => void;

  // Inventory
  coins: number;
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => void;

  // UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Notifications
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  incrementNotifications: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),

      soundEnabled: true,
      musicEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),

      battleState: null,
      setBattleState: (state) => set({ battleState: state }),
      updateBattleState: (partial) =>
        set((state) => ({
          battleState: state.battleState
            ? { ...state.battleState, ...partial }
            : null,
        })),

      coins: 0,
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      removeCoins: (amount) =>
        set((state) => ({ coins: Math.max(0, state.coins - amount) })),

      sidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      notificationCount: 0,
      setNotificationCount: (count) => set({ notificationCount: count }),
      incrementNotifications: () =>
        set((state) => ({ notificationCount: state.notificationCount + 1 })),
    }),
    {
      name: "questlearn-game-state",
      partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        coins: state.coins,
      }),
    }
  )
);
