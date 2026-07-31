import { User, Palette, Bell, Key, Database, Info } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useToastStore } from '../store/toastStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Field';
import { Toggle } from '../components/ui/Toggle';
import { cn } from '../lib/utils';

export function SettingsPage() {
  const { settings, updateSettings, setTheme } = useSettingsStore();
  const { addToast } = useToastStore();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-slate-400 mt-1">Configure your JARVIS experience</p>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4"><User size={18} className="text-blue-400" /><h3 className="font-semibold text-slate-200">Profile</h3></div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Name" defaultValue="Jorel Wicky" />
          <Input label="Email" defaultValue="lmashrel@gmail.com" />
          <Input label="Timezone" defaultValue="Europe/Paris" />
          <Input label="Language" defaultValue="English" />
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4"><Key size={18} className="text-purple-400" /><h3 className="font-semibold text-slate-200">Model Configuration</h3></div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Default Model</label>
            <select className="input-field" defaultValue="gpt-4">
              <option value="gpt-4">GPT-4</option>
              <option value="claude-3">Claude 3</option>
              <option value="gemini">Gemini Pro</option>
              <option value="local">Local Model</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Temperature: 0.7</label>
            <input type="range" min="0" max="2" step="0.1" defaultValue="0.7" className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Max Tokens</label>
            <input type="number" defaultValue="4096" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">System Prompt</label>
            <textarea defaultValue="You are JARVIS, a helpful AI assistant." rows={3} className="input-field resize-none" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4"><Palette size={18} className="text-cyan-400" /><h3 className="font-semibold text-slate-200">Appearance</h3></div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Theme</label>
            <div className="flex gap-2">
              {(['dark', 'light', 'system'] as const).map((t) => (
                <button key={t} onClick={() => { setTheme(t); addToast('info', `Theme set to ${t}`); }} className={cn('px-4 py-2 rounded-xl text-sm font-medium capitalize', settings.theme === t ? 'bg-blue-600 text-white' : 'glass text-slate-400')}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Font Size</label>
            <select value={settings.fontSize} onChange={(e) => updateSettings({ fontSize: e.target.value as typeof settings.fontSize })} className="input-field">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4"><Bell size={18} className="text-orange-400" /><h3 className="font-semibold text-slate-200">Notifications</h3></div>
        <div className="space-y-3">
          <Toggle checked={settings.notifications} onChange={(v) => updateSettings({ notifications: v })} label="Enable notifications" />
          <Toggle checked={settings.autoSave} onChange={(v) => updateSettings({ autoSave: v })} label="Auto-save conversations" />
          <Toggle checked={settings.telemetry} onChange={(v) => updateSettings({ telemetry: v })} label="Send anonymous telemetry" />
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4"><Key size={18} className="text-red-400" /><h3 className="font-semibold text-slate-200">API Keys</h3></div>
        <div className="space-y-3">
          <Input label="OpenAI API Key" type="password" defaultValue="sk-••••••••••••••••••••••••" />
          <Input label="Anthropic API Key" type="password" placeholder="Enter your Anthropic API key" />
          <Input label="Google AI API Key" type="password" placeholder="Enter your Google AI API key" />
          <Button onClick={() => addToast('success', 'API keys saved')}>Save Keys</Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4"><Database size={18} className="text-green-400" /><h3 className="font-semibold text-slate-200">Data & Privacy</h3></div>
        <div className="space-y-3">
          <Button variant="outline" onClick={() => addToast('success', 'Data exported')}>Export All Data</Button>
          <Button variant="danger" onClick={() => addToast('warning', 'Are you sure? This cannot be undone.')}>Clear All Conversations</Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4"><Info size={18} className="text-slate-400" /><h3 className="font-semibold text-slate-200">About</h3></div>
        <div className="space-y-1 text-sm text-slate-400">
          <p>JARVIS — Ultimate AI Assistant Platform</p>
          <p>Version 2.0.0</p>
          <p>Built with React, TypeScript, Tailwind CSS, Zustand, Recharts</p>
        </div>
      </Card>
    </div>
  );
}