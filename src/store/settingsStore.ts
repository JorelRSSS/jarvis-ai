import { create } from 'zustand';
import type { AppSettings, ThemeMode } from '../types';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
  toggleSidebar: () => void;
  setTheme: (t: ThemeMode) => void;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  sidebarCollapsed: false,
  fontSize: 'medium',
  language: 'en',
  notifications: true,
  autoSave: true,
  telemetry: false,
  accentColor: 'blue',
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,

  updateSettings: (s) =>
    set((state) => ({ settings: { ...state.settings, ...s } })),

  toggleSidebar: () =>
    set((state) => ({
      settings: { ...state.settings, sidebarCollapsed: !state.settings.sidebarCollapsed },
    })),

  setTheme: (t) =>
    set((state) => ({ settings: { ...state.settings, theme: t } })),
}));