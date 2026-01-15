"use client";

import { create } from "zustand";

interface DemoStore {
    isDemoMode: boolean;
    simulateSuccess: boolean;
    simulateError: string | null;

    toggleDemoMode: () => void;
    setSimulateSuccess: (value: boolean) => void;
    setSimulateError: (error: string | null) => void;
}

export const useDemoStore = create<DemoStore>((set) => ({
    isDemoMode: false,
    simulateSuccess: true,
    simulateError: null,

    toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),

    setSimulateSuccess: (value) => set({ simulateSuccess: value }),

    setSimulateError: (error) => set({ simulateError: error })
}));
