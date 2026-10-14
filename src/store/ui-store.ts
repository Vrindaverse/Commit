'use client';

import { create } from 'zustand';

interface UIStore {
  profileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  toggleProfile: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  profileOpen: false,
  openProfile: () => set({ profileOpen: true }),
  closeProfile: () => set({ profileOpen: false }),
  toggleProfile: () => set((s) => ({ profileOpen: !s.profileOpen })),
}));
