import { create } from "zustand";

interface StudioUiState {
  launcherOpen: boolean;
  setLauncherOpen: (open: boolean) => void;
}

/** UI-only studio state (dialogs, panels), kept apart from scan data. */
export const useStudioUi = create<StudioUiState>()((set) => ({
  launcherOpen: false,
  setLauncherOpen: (launcherOpen) => set({ launcherOpen }),
}));
