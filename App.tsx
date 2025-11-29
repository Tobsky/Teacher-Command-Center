import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClassManager from './components/ClassManager';
import Attendance from './components/Attendance';
import Gradebook from './components/Gradebook';
import SnippetBank from './components/SnippetBank';
import SmartFeedback from './components/SmartFeedback';
import { useAppContext } from './context/AppContext';
import { AppView } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const { currentView } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="flex min-h-screen font-sans bg-slate-950 text-slate-200 relative">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen w-full md:ml-64 transition-all duration-300">
        <div className="md:hidden mb-6 flex items-center justify-between">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-blue-400 font-mono">DEV.TEACH_</span>
        </div>
        
        {renderView()}
      </main>
    </div>
  );
};

export default App;