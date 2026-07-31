import { create } from 'zustand';
import type { Task, TaskStatus } from '../types';
import { mockTasks } from '../lib/mockData';
import { generateId } from '../lib/utils';

interface TaskState {
  tasks: Task[];
  filter: 'all' | TaskStatus;
  searchQuery: string;

  setFilter: (f: TaskState['filter']) => void;
  setSearchQuery: (q: string) => void;
  addTask: (t: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  updateTaskProgress: (id: string, progress: number) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: mockTasks,
  filter: 'all',
  searchQuery: '',

  setFilter: (f) => set({ filter: f }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  addTask: (t) =>
    set((s) => ({
      tasks: [
        {
          id: generateId('task'),
          title: t.title || 'Untitled Task',
          description: t.description || '',
          status: 'pending',
          priority: t.priority || 'medium',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          dueDate: t.dueDate,
          tags: t.tags || [],
          dependencies: [],
          progress: 0,
          schedule: t.schedule,
        },
        ...s.tasks,
      ],
    })),

  updateTaskStatus: (id, status) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, status, updatedAt: Date.now(), progress: status === 'completed' ? 100 : t.progress } : t
      ),
    })),

  updateTaskProgress: (id, progress) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, progress, updatedAt: Date.now() } : t)),
    })),

  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
}));