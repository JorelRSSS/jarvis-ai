import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/ui/Toast';
import { OverviewPage } from './pages/OverviewPage';
import { ChatPage } from './pages/ChatPage';
import { TasksPage } from './pages/TasksPage';
import { SkillsPage } from './pages/SkillsPage';
import { MemoryPage } from './pages/MemoryPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [activePage, setActivePage] = useState('overview');

  const pages: Record<string, React.ReactNode> = {
    overview: <OverviewPage onNavigate={setActivePage} />,
    chat: <ChatPage />,
    tasks: <TasksPage />,
    skills: <SkillsPage />,
    memory: <MemoryPage />,
    knowledge: <KnowledgePage />,
    analytics: <AnalyticsPage />,
    settings: <SettingsPage />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {pages[activePage] || pages.overview}
      </main>
      <ToastContainer />
    </div>
  );
}