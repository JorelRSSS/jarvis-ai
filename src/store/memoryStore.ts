import { create } from 'zustand';
import type { Memory } from '../types';
import { mockMemories } from '../lib/mockData';
import { generateId } from '../lib/utils';

interface MemoryState {
  memories: Memory[];
  searchQuery: string;
  filterType: 'all' | Memory['type'];

  setSearchQuery: (q: string) => void;
  setFilterType: (t: MemoryState['filterType']) => void;
  addMemory: (m: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  memories: mockMemories,
  searchQuery: '',
  filterType: 'all',

  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterType: (t) => set({ filterType: t }),

  addMemory: (m) =>
    set((s) => ({
      memories: [
        {
          id: generateId('mem'),
          type: m.type || 'semantic',
          content: m.content || '',
          importance: m.importance ?? 0.5,
          timestamp: Date.now(),
          accessCount: 0,
          lastAccessed: Date.now(),
          tags: m.tags || [],
          source: m.source,
          decay: 0.1,
        },
        ...s.memories,
      ],
    })),

  deleteMemory: (id) => set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),

  updateMemory: (id, updates) =>
    set((s) => ({
      memories: s.memories.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),
}));