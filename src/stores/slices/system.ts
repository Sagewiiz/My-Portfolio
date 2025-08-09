import type { StateCreator } from "zustand";
import { enterFullScreen, exitFullScreen } from "~/utils";

export interface SystemSlice {
  dark: boolean;
  volume: number;
  brightness: number;
  wifi: boolean;
  bluetooth: boolean;
  airdrop: boolean;
  fullscreen: boolean;
  recentApps: string[];
  toggleDark: () => void;
  toggleWIFI: () => void;
  toggleBluetooth: () => void;
  toggleAirdrop: () => void;
  toggleFullScreen: (v: boolean) => void;
  setVolume: (v: number) => void;
  setBrightness: (v: number) => void;
  addRecentApp: (id: string) => void;
}

export const createSystemSlice: StateCreator<SystemSlice> = (set) => ({
  dark: (() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  })(),
  volume: 100,
  brightness: 80,
  wifi: true,
  bluetooth: true,
  airdrop: true,
  fullscreen: false,
  recentApps: [],
  toggleDark: () =>
    set((state) => {
      const target = !state.dark;
      if (target) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return { dark: target };
    }),
  toggleWIFI: () => set((state) => ({ wifi: !state.wifi })),
  toggleBluetooth: () => set((state) => ({ bluetooth: !state.bluetooth })),
  toggleAirdrop: () => set((state) => ({ airdrop: !state.airdrop })),
  toggleFullScreen: (v) =>
    set(() => {
      v ? enterFullScreen() : exitFullScreen();
      return { fullscreen: v };
    }),
  setVolume: (v) => set(() => ({ volume: v })),
  setBrightness: (v) => set(() => ({ brightness: v })),
  addRecentApp: (id) =>
    set((state) => {
      const list = [id, ...state.recentApps.filter((x) => x !== id)].slice(0, 7);
      return { recentApps: list };
    })
});
