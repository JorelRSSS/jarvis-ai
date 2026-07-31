import { create } from 'zustand';
import type { Conversation, Message } from '../types';
import { mockConversations, generateAIResponse } from '../lib/mockData';
import { generateId } from '../lib/utils';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isProcessing: boolean;
  searchQuery: string;
  selectedModel: string;

  setActiveConversation: (id: string) => void;
  createConversation: () => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  sendMessage: (content: string) => Promise<void>;
  setSearchQuery: (q: string) => void;
  setSelectedModel: (m: string) => void;
  deleteMessage: (convId: string, msgId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: mockConversations,
  activeConversationId: mockConversations[0]?.id ?? null,
  isProcessing: false,
  searchQuery: '',
  selectedModel: 'gpt-4',

  setActiveConversation: (id) => set({ activeConversationId: id }),

  createConversation: () => {
    const newConv: Conversation = {
      id: generateId('conv'),
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      model: get().selectedModel,
    };
    set((s) => ({
      conversations: [newConv, ...s.conversations],
      activeConversationId: newConv.id,
    }));
  },

  deleteConversation: (id) =>
    set((s) => {
      const filtered = s.conversations.filter((c) => c.id !== id);
      return {
        conversations: filtered,
        activeConversationId: s.activeConversationId === id ? filtered[0]?.id ?? null : s.activeConversationId,
      };
    }),

  renameConversation: (id, title) =>
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, title } : c)),
    })),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedModel: (m) => set({ selectedModel: m }),

  deleteMessage: (convId, msgId) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === convId ? { ...c, messages: c.messages.filter((m) => m.id !== msgId) } : c
      ),
    })),

  sendMessage: async (content: string) => {
    const { activeConversationId, selectedModel } = get();
    if (!activeConversationId) return;

    const userMsg: Message = {
      id: generateId('msg'),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === activeConversationId
          ? { ...c, messages: [...c.messages, userMsg], updatedAt: Date.now() }
          : c
      ),
      isProcessing: true,
    }));

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1500));

    const aiMsg: Message = {
      id: generateId('msg'),
      role: 'assistant',
      content: generateAIResponse(content),
      timestamp: Date.now(),
      metadata: { model: selectedModel, tokens: Math.floor(50 + Math.random() * 200), processingTime: Math.floor(500 + Math.random() * 1500) },
    };

    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              messages: [...c.messages, aiMsg],
              updatedAt: Date.now(),
              title: c.messages.length === 0 ? content.slice(0, 50) : c.title,
            }
          : c
      ),
      isProcessing: false,
    }));
  },
}));