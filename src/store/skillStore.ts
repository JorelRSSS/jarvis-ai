import { create } from 'zustand';
import type { Skill } from '../types';
import { mockSkills } from '../lib/mockData';

interface SkillState {
  skills: Skill[];
  tab: 'installed' | 'browse';
  searchQuery: string;

  setTab: (t: 'installed' | 'browse') => void;
  setSearchQuery: (q: string) => void;
  toggleSkill: (id: string) => void;
  installSkill: (id: string) => void;
  uninstallSkill: (id: string) => void;
}

export const useSkillStore = create<SkillState>((set) => ({
  skills: mockSkills,
  tab: 'installed',
  searchQuery: '',

  setTab: (t) => set({ tab: t }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  toggleSkill: (id) =>
    set((s) => ({
      skills: s.skills.map((sk) => (sk.id === id ? { ...sk, enabled: !sk.enabled } : sk)),
    })),

  installSkill: (id) =>
    set((s) => ({
      skills: s.skills.map((sk) => (sk.id === id ? { ...sk, installed: true, enabled: true } : sk)),
    })),

  uninstallSkill: (id) =>
    set((s) => ({
      skills: s.skills.map((sk) => (sk.id === id ? { ...sk, installed: false, enabled: false } : sk)),
    })),
}));