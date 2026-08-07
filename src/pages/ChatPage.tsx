import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Send, Plus, Trash2, MessageSquare, Search } from 'lucide-react';
import { formatTime } from '../lib/utils';

export function ChatPage() {
  const {
    conversations,
    activeConversationId,
    isProcessing,
    searchQuery,
    selectedModel,
    setActiveConversation,
    createConversation,
    deleteConversation,
    renameConversation,
    sendMessage,
    setSearchQuery,
    setSelectedModel,
    deleteMessage,
  } = useChatStore();

  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    const content = input;
    setInput('');
    await sendMessage(content);
  };

  const handleRename = (id: string, title: string) => {
    renameConversation(id, title);
    setEditingId(null);
  };

  return (
    <div className="flex h-full p-4 gap-4">
      {/* Sidebar: conversation list */}
      <div className="w-72 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <Button onClick={createConversation} className="!px-3">
            <Plus size={18} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin">
          {filtered.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                conv.id === activeConversationId ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-white/5'
              }`}
            >
              <MessageSquare size={16} className="text-slate-400 shrink-0" />
              {editingId === conv.id ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleRename(conv.id, editTitle)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename(conv.id, editTitle)}
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-slate-200 focus:outline-none"
                />
              ) : (
                <div
                  className="flex-1 min-w-0"
                  onDoubleClick={() => { setEditingId(conv.id); setEditTitle(conv.title); }}
                >
                  <p className="text-sm font-medium text-slate-200 truncate">{conv.title}</p>
                  <p className="text-xs text-slate-500">{conv.messages.length} messages</p>
                </div>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-700">
          <label className="text-xs text-slate-500 mb-1 block">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3">Claude 3</option>
            <option value="llama-3">Llama 3</option>
          </select>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-100">{activeConversation.title}</h2>
              <Badge>{activeConversation.model}</Badge>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin pr-2">
              {activeConversation.messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <p>Start a conversation by sending a message below.</p>
                </div>
              )}
              {activeConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`group max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs opacity-50">{formatTime(msg.timestamp)}</span>
                      {msg.metadata?.tokens && (
                        <span className="text-xs opacity-50">{msg.metadata.tokens} tokens</span>
                      )}
                      <button
                        onClick={() => deleteMessage(activeConversation.id, msg.id)}
                        className="text-xs opacity-0 group-hover:opacity-50 hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type a message..."
                disabled={isProcessing}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
              <Button onClick={handleSend} disabled={isProcessing || !input.trim()}>
                <Send size={18} />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 text-center">
              <MessageSquare size={48} className="mx-auto text-slate-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-200 mb-2">No conversation selected</h3>
              <p className="text-slate-500 mb-4">Create a new conversation to get started.</p>
              <Button onClick={createConversation}>
                <Plus size={18} className="inline mr-1" /> New Conversation
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}