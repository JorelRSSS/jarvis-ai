import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from './chatStore';
import { mockConversations } from '../lib/mockData';

describe('chatStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useChatStore.setState({
      conversations: mockConversations,
      activeConversationId: mockConversations[0]?.id ?? null,
      isProcessing: false,
      searchQuery: '',
      selectedModel: 'gpt-4',
    });
  });

  describe('setActiveConversation', () => {
    it('sets the active conversation id', () => {
      const store = useChatStore.getState();
      store.setActiveConversation('conv-2');
      expect(useChatStore.getState().activeConversationId).toBe('conv-2');
    });
  });

  describe('createConversation', () => {
    it('adds a new conversation to the list', () => {
      const initialCount = useChatStore.getState().conversations.length;
      const store = useChatStore.getState();
      store.createConversation();
      const state = useChatStore.getState();
      expect(state.conversations.length).toBe(initialCount + 1);
    });

    it('sets the new conversation as active', () => {
      const store = useChatStore.getState();
      store.createConversation();
      const state = useChatStore.getState();
      expect(state.activeConversationId).toBeTruthy();
    });

    it('creates a conversation with empty messages', () => {
      const store = useChatStore.getState();
      store.createConversation();
      const state = useChatStore.getState();
      const newConv = state.conversations.find(
        (c) => c.id === state.activeConversationId,
      );
      expect(newConv).toBeDefined();
      expect(newConv!.messages).toEqual([]);
    });

    it('uses the currently selected model for the new conversation', () => {
      useChatStore.setState({ selectedModel: 'claude-3' });
      const store = useChatStore.getState();
      store.createConversation();
      const state = useChatStore.getState();
      const newConv = state.conversations.find(
        (c) => c.id === state.activeConversationId,
      );
      expect(newConv!.model).toBe('claude-3');
    });
  });

  describe('deleteConversation', () => {
    it('removes the conversation from the list', () => {
      const initialCount = useChatStore.getState().conversations.length;
      const store = useChatStore.getState();
      store.deleteConversation('conv-1');
      expect(useChatStore.getState().conversations.length).toBe(initialCount - 1);
    });

    it('removes the correct conversation', () => {
      const store = useChatStore.getState();
      store.deleteConversation('conv-2');
      const state = useChatStore.getState();
      expect(state.conversations.find((c) => c.id === 'conv-2')).toBeUndefined();
    });

    it('updates activeConversationId when deleting the active conversation', () => {
      useChatStore.setState({ activeConversationId: 'conv-1' });
      const store = useChatStore.getState();
      store.deleteConversation('conv-1');
      const state = useChatStore.getState();
      expect(state.activeConversationId).not.toBe('conv-1');
    });

    it('does not change activeConversationId when deleting a non-active conversation', () => {
      useChatStore.setState({ activeConversationId: 'conv-1' });
      const store = useChatStore.getState();
      store.deleteConversation('conv-2');
      expect(useChatStore.getState().activeConversationId).toBe('conv-1');
    });
  });

  describe('renameConversation', () => {
    it('renames the specified conversation', () => {
      const store = useChatStore.getState();
      store.renameConversation('conv-1', 'New Title');
      const state = useChatStore.getState();
      const conv = state.conversations.find((c) => c.id === 'conv-1');
      expect(conv!.title).toBe('New Title');
    });

    it('does not affect other conversations', () => {
      const store = useChatStore.getState();
      store.renameConversation('conv-1', 'New Title');
      const state = useChatStore.getState();
      const conv2 = state.conversations.find((c) => c.id === 'conv-2');
      expect(conv2!.title).toBe('Code Review Discussion');
    });
  });

  describe('setSearchQuery', () => {
    it('sets the search query', () => {
      const store = useChatStore.getState();
      store.setSearchQuery('test query');
      expect(useChatStore.getState().searchQuery).toBe('test query');
    });
  });

  describe('setSelectedModel', () => {
    it('sets the selected model', () => {
      const store = useChatStore.getState();
      store.setSelectedModel('claude-3');
      expect(useChatStore.getState().selectedModel).toBe('claude-3');
    });
  });

  describe('deleteMessage', () => {
    it('removes the specified message from the conversation', () => {
      const store = useChatStore.getState();
      store.deleteMessage('conv-1', 'msg-1');
      const state = useChatStore.getState();
      const conv = state.conversations.find((c) => c.id === 'conv-1');
      expect(conv!.messages.find((m) => m.id === 'msg-1')).toBeUndefined();
    });

    it('does not affect messages in other conversations', () => {
      const store = useChatStore.getState();
      store.deleteMessage('conv-1', 'msg-1');
      const state = useChatStore.getState();
      const conv2 = state.conversations.find((c) => c.id === 'conv-2');
      expect(conv2!.messages.length).toBeGreaterThan(0);
    });
  });

  describe('sendMessage', () => {
    it('adds a user message to the active conversation', async () => {
      useChatStore.setState({ activeConversationId: 'conv-1' });
      const store = useChatStore.getState();
      const initialMsgCount = useChatStore.getState().conversations.find(
        (c) => c.id === 'conv-1',
      )!.messages.length;

      await store.sendMessage('Test message');

      const state = useChatStore.getState();
      const conv = state.conversations.find((c) => c.id === 'conv-1');
      expect(conv!.messages.length).toBe(initialMsgCount + 2); // user + AI
    });

    it('sets isProcessing to true during send and false after', async () => {
      useChatStore.setState({ activeConversationId: 'conv-1' });
      const store = useChatStore.getState();

      const sendPromise = store.sendMessage('Test message');

      const duringState = useChatStore.getState();
      expect(duringState.isProcessing).toBe(true);

      await sendPromise;

      expect(useChatStore.getState().isProcessing).toBe(false);
    });

    it('does not send if no active conversation is set', async () => {
      useChatStore.setState({ activeConversationId: null });
      const store = useChatStore.getState();
      const initialCount = useChatStore.getState().conversations.length;

      await store.sendMessage('Test message');

      expect(useChatStore.getState().conversations.length).toBe(initialCount);
    });

    it('adds user message with role "user"', async () => {
      useChatStore.setState({ activeConversationId: 'conv-1' });
      const store = useChatStore.getState();

      await store.sendMessage('Hello AI');

      const state = useChatStore.getState();
      const conv = state.conversations.find((c) => c.id === 'conv-1');
      const userMsg = conv!.messages.find((m) => m.role === 'user');
      expect(userMsg).toBeDefined();
      expect(userMsg!.content).toBe('Hello AI');
    });

    it('adds AI response message with role "assistant"', async () => {
      useChatStore.setState({ activeConversationId: 'conv-1' });
      const store = useChatStore.getState();

      await store.sendMessage('Hello AI');

      const state = useChatStore.getState();
      const conv = state.conversations.find((c) => c.id === 'conv-1');
      const aiMsg = conv!.messages.find((m) => m.role === 'assistant');
      expect(aiMsg).toBeDefined();
      expect(typeof aiMsg!.content).toBe('string');
      expect(aiMsg!.content.length).toBeGreaterThan(0);
    });

    it('updates conversation title when it is the first message', async () => {
      useChatStore.setState({ activeConversationId: 'conv-1' });
      useChatStore.setState({
        conversations: useChatStore.getState().conversations.map((c) =>
          c.id === 'conv-1' ? { ...c, messages: [], title: 'New Conversation' } : c,
        ),
      });
      const store = useChatStore.getState();

      await store.sendMessage('First message here');

      const state = useChatStore.getState();
      const conv = state.conversations.find((c) => c.id === 'conv-1');
      expect(conv!.title).toBe('First message here');
    });
  });
});