import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'text-slate-400 bg-slate-500/10',
    medium: 'text-blue-400 bg-blue-500/10',
    high: 'text-orange-400 bg-orange-500/10',
    critical: 'text-red-400 bg-red-500/10',
  };
  return colors[priority] || colors.low;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'text-slate-400 bg-slate-500/10',
    in_progress: 'text-blue-400 bg-blue-500/10',
    completed: 'text-green-400 bg-green-500/10',
    failed: 'text-red-400 bg-red-500/10',
  };
  return colors[status] || colors.pending;
}

export function getMemoryTypeColor(type: string): string {
  const colors: Record<string, string> = {
    episodic: 'text-purple-400 bg-purple-500/10',
    semantic: 'text-blue-400 bg-blue-500/10',
    procedural: 'text-cyan-400 bg-cyan-500/10',
  };
  return colors[type] || colors.semantic;
}