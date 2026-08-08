import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatTime,
  formatDate,
  formatBytes,
  generateId,
  truncate,
  getPriorityColor,
  getStatusColor,
  getMemoryTypeColor,
} from './utils';

describe('formatTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-08T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for timestamps less than 1 minute ago', () => {
    const now = Date.now();
    expect(formatTime(now - 30000)).toBe('just now');
  });

  it('returns minutes ago for timestamps less than 1 hour ago', () => {
    const now = Date.now();
    expect(formatTime(now - 300000)).toBe('5m ago');
  });

  it('returns hours ago for timestamps less than 24 hours ago', () => {
    const now = Date.now();
    expect(formatTime(now - 7200000)).toBe('2h ago');
  });

  it('returns days ago for timestamps less than 7 days ago', () => {
    const now = Date.now();
    expect(formatTime(now - 172800000)).toBe('2d ago');
  });

  it('returns locale date string for timestamps 7+ days ago', () => {
    const now = Date.now();
    const result = formatTime(now - 8 * 86400000);
    expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });
});

describe('formatDate', () => {
  it('formats a timestamp into a human-readable date string', () => {
    const ts = new Date('2026-08-08T12:00:00Z').getTime();
    const result = formatDate(ts);
    expect(result).toMatch(/Aug 8, 2026/);
  });

  it('formats different dates correctly', () => {
    const ts = new Date('2026-01-15T00:00:00Z').getTime();
    const result = formatDate(ts);
    expect(result).toMatch(/Jan 15, 2026/);
  });
});

describe('formatBytes', () => {
  it('returns "0 B" for zero bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('formats bytes correctly', () => {
    expect(formatBytes(500)).toBe('500 B');
  });

  it('formats kilobytes correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
  });

  it('formats gigabytes correctly', () => {
    expect(formatBytes(1073741824)).toBe('1 GB');
  });

  it('formats fractional values with 2 decimal places', () => {
    expect(formatBytes(1536)).toBe('1.5 KB');
  });
});

describe('generateId', () => {
  it('generates an id with default prefix "id"', () => {
    const id = generateId();
    expect(id).toMatch(/^id-\d+-[a-z0-9]+$/);
  });

  it('generates an id with custom prefix', () => {
    const id = generateId('conv');
    expect(id).toMatch(/^conv-\d+-[a-z0-9]+$/);
  });

  it('generates unique ids on successive calls', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });
});

describe('truncate', () => {
  it('returns the original string if shorter than length', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns the original string if exactly equal to length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates and appends ellipsis', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
  });

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('');
  });
});

describe('getPriorityColor', () => {
  it('returns correct color for "low"', () => {
    expect(getPriorityColor('low')).toBe('text-slate-400 bg-slate-500/10');
  });

  it('returns correct color for "medium"', () => {
    expect(getPriorityColor('medium')).toBe('text-blue-400 bg-blue-500/10');
  });

  it('returns correct color for "high"', () => {
    expect(getPriorityColor('high')).toBe('text-orange-400 bg-orange-500/10');
  });

  it('returns correct color for "critical"', () => {
    expect(getPriorityColor('critical')).toBe('text-red-400 bg-red-500/10');
  });

  it('falls back to "low" for unknown priority', () => {
    expect(getPriorityColor('unknown')).toBe('text-slate-400 bg-slate-500/10');
  });
});

describe('getStatusColor', () => {
  it('returns correct color for "pending"', () => {
    expect(getStatusColor('pending')).toBe('text-slate-400 bg-slate-500/10');
  });

  it('returns correct color for "in_progress"', () => {
    expect(getStatusColor('in_progress')).toBe('text-blue-400 bg-blue-500/10');
  });

  it('returns correct color for "completed"', () => {
    expect(getStatusColor('completed')).toBe('text-green-400 bg-green-500/10');
  });

  it('returns correct color for "failed"', () => {
    expect(getStatusColor('failed')).toBe('text-red-400 bg-red-500/10');
  });

  it('falls back to "pending" for unknown status', () => {
    expect(getStatusColor('unknown')).toBe('text-slate-400 bg-slate-500/10');
  });
});

describe('getMemoryTypeColor', () => {
  it('returns correct color for "episodic"', () => {
    expect(getMemoryTypeColor('episodic')).toBe('text-purple-400 bg-purple-500/10');
  });

  it('returns correct color for "semantic"', () => {
    expect(getMemoryTypeColor('semantic')).toBe('text-blue-400 bg-blue-500/10');
  });

  it('returns correct color for "procedural"', () => {
    expect(getMemoryTypeColor('procedural')).toBe('text-cyan-400 bg-cyan-500/10');
  });

  it('falls back to "semantic" for unknown type', () => {
    expect(getMemoryTypeColor('unknown')).toBe('text-blue-400 bg-blue-500/10');
  });
});