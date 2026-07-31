// Core types for JARVIS platform

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
  systemPrompt?: string;
  pinned?: boolean;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  tags: string[];
  dependencies: string[];
  progress: number;
  schedule?: {
    type: 'one-time' | 'recurring';
    cron?: string;
  };
}

export type SkillCategory = 'reasoning' | 'coding' | 'creative' | 'analysis' | 'memory' | 'communication' | 'custom';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  level: number;
  maxLevel: number;
  experience: number;
  nextLevelAt: number;
  enabled: boolean;
  icon: string;
  capabilities: string[];
  lastUsed?: number;
  cooldown?: number;
  installed: boolean;
  author: string;
  rating: number;
}

export type MemoryType = 'episodic' | 'semantic' | 'procedural';

export interface Memory {
  id: string;
  type: MemoryType;
  content: string;
  importance: number;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  tags: string[];
  source?: string;
  decay: number;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  type: 'pdf' | 'doc' | 'url' | 'note';
  createdAt: number;
  updatedAt: number;
  tags: string[];
  size: number;
}

export interface AgentConfig {
  name: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  skills: string[];
  memoryEnabled: boolean;
  contextWindow: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  notifications: boolean;
  autoSave: boolean;
  telemetry: boolean;
  accentColor: string;
}

export interface DashboardStats {
  totalConversations: number;
  activeTasks: number;
  completedTasks: number;
  skillsLearned: number;
  memoryCount: number;
  uptime: number;
  lastActive: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface AnalyticsData {
  conversationsOverTime: { date: string; count: number }[];
  tasksCompletedOverTime: { date: string; count: number }[];
  skillUsage: { skill: string; usage: number }[];
  modelUsage: { model: string; percentage: number }[];
  responseTime: { date: string; time: number }[];
}