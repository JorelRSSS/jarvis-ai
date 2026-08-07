import type { Conversation, Task, Memory, DashboardStats } from '../types';

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Project Planning',
    messages: [
      { id: 'msg-1', role: 'user', content: 'Help me plan the Q3 roadmap', timestamp: Date.now() - 3600000 },
      { id: 'msg-2', role: 'assistant', content: 'Sure! Let me break down the Q3 roadmap into key milestones...', timestamp: Date.now() - 3500000, metadata: { model: 'gpt-4', tokens: 150, processingTime: 1200 } },
    ],
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3500000,
    model: 'gpt-4',
  },
  {
    id: 'conv-2',
    title: 'Code Review Discussion',
    messages: [
      { id: 'msg-3', role: 'user', content: 'Can you review this PR?', timestamp: Date.now() - 7200000 },
      { id: 'msg-4', role: 'assistant', content: 'I will review the PR and provide feedback on the changes.', timestamp: Date.now() - 7100000, metadata: { model: 'gpt-4', tokens: 85, processingTime: 900 } },
    ],
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7100000,
    model: 'gpt-4',
  },
  {
    id: 'conv-3',
    title: 'Bug Investigation',
    messages: [
      { id: 'msg-5', role: 'user', content: 'There is a memory leak in the app', timestamp: Date.now() - 10800000 },
      { id: 'msg-6', role: 'assistant', content: 'Let me help diagnose the memory leak. Can you share the heap snapshot?', timestamp: Date.now() - 10700000, metadata: { model: 'gpt-4', tokens: 95, processingTime: 1100 } },
    ],
    createdAt: Date.now() - 10800000,
    updatedAt: Date.now() - 10700000,
    model: 'gpt-4',
  },
];

export function generateAIResponse(content: string): string {
  const responses = [
    `Here is my analysis of "${content.slice(0, 50)}": Based on the context, I recommend proceeding with a structured approach that addresses the key requirements.`,
    `I understand you are asking about "${content.slice(0, 50)}". Let me provide a detailed response with the relevant information.`,
    `Regarding "${content.slice(0, 50)}", I have processed your request and here are the key points to consider.`,
    `Thank you for your message about "${content.slice(0, 50)}". Here is what I found and my recommendations.`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Fix authentication flow',
    description: 'Users are experiencing intermittent login failures on the production server.',
    status: 'in_progress',
    priority: 'high',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
    tags: ['bug', 'auth'],
    dependencies: [],
    progress: 65,
  },
  {
    id: 'task-2',
    title: 'Design dashboard analytics page',
    description: 'Create wireframes and implement the analytics page with charts and metrics.',
    status: 'pending',
    priority: 'medium',
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
    tags: ['design', 'frontend'],
    dependencies: [],
    progress: 0,
  },
  {
    id: 'task-3',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    status: 'completed',
    priority: 'critical',
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 86400000,
    tags: ['devops', 'ci'],
    dependencies: [],
    progress: 100,
  },
  {
    id: 'task-4',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with examples and response schemas.',
    status: 'pending',
    priority: 'low',
    createdAt: Date.now() - 345600000,
    updatedAt: Date.now() - 345600000,
    tags: ['docs'],
    dependencies: [],
    progress: 0,
  },
  {
    id: 'task-5',
    title: 'Optimize database queries',
    description: 'Review and optimize slow queries identified in the performance audit.',
    status: 'in_progress',
    priority: 'medium',
    createdAt: Date.now() - 432000000,
    updatedAt: Date.now() - 7200000,
    tags: ['performance', 'backend'],
    dependencies: [],
    progress: 30,
  },
];

export const mockMemories: Memory[] = [
  {
    id: 'mem-1',
    type: 'semantic',
    content: 'The user prefers TypeScript over JavaScript for all new projects.',
    importance: 0.9,
    timestamp: Date.now() - 86400000,
    accessCount: 12,
    lastAccessed: Date.now() - 3600000,
    tags: ['preference', 'tech'],
    decay: 0.1,
  },
  {
    id: 'mem-2',
    type: 'episodic',
    content: 'User completed the onboarding tutorial on July 31, 2026.',
    importance: 0.7,
    timestamp: Date.now() - 172800000,
    accessCount: 3,
    lastAccessed: Date.now() - 86400000,
    tags: ['onboarding'],
    decay: 0.15,
  },
  {
    id: 'mem-3',
    type: 'procedural',
    content: 'To deploy the app, run npm run build && npm run deploy on the main branch.',
    importance: 0.8,
    timestamp: Date.now() - 259200000,
    accessCount: 8,
    lastAccessed: Date.now() - 7200000,
    tags: ['deploy', 'procedure'],
    decay: 0.05,
  },
  {
    id: 'mem-4',
    type: 'semantic',
    content: 'The project uses Tailwind CSS for styling and lucide-react for icons.',
    importance: 0.6,
    timestamp: Date.now() - 345600000,
    accessCount: 5,
    lastAccessed: Date.now() - 172800000,
    tags: ['tech', 'frontend'],
    decay: 0.2,
  },
];

export const mockDashboardStats: DashboardStats = {
  totalConversations: 42,
  activeTasks: 8,
  completedTasks: 15,
  skillsLearned: 6,
  memoryCount: 24,
  uptime: 99.8,
  lastActive: Date.now() - 1800000,
};