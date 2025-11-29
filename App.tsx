import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClassManager from './components/ClassManager';
import Attendance from './components/Attendance';
import Gradebook from './components/Gradebook';
import SnippetBank from './components/SnippetBank';
import SmartFeedback from './components/SmartFeedback';
import { useAppContext } from './context/AppContext';
import { AppView } from './types';

const App: React.FC = () => {
  const { currentView } = useAppContext();

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard />;
      case AppView.CLASSES: return <ClassManager />;
      case AppView.ATTENDANCE: return <Attendance />;
      case AppView.GRADEBOOK: return <Gradebook />;
      case AppView.SNIPPETS: return <SnippetBank />;
      case AppView.FEEDBACK: return <SmartFeedback />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-slate-950 text-slate-200">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
        {renderView()}
      </main>
    </div>
  );
};

export default App;