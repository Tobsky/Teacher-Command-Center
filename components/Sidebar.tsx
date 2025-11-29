import React from 'react';
import { LayoutDashboard, Users, UserCheck, BookOpen, Code, BrainCircuit, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AppView } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView } = useAppContext();

  const navItems = [
    { view: AppView.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { view: AppView.CLASSES, label: 'Classes & Roster', icon: <Users size={20} /> },
    { view: AppView.ATTENDANCE, label: 'Attendance', icon: <UserCheck size={20} /> },
    { view: AppView.GRADEBOOK, label: 'Gradebook', icon: <BookOpen size={20} /> },
    { view: AppView.SNIPPETS, label: 'Snippet Bank', icon: <Code size={20} /> },
    { view: AppView.FEEDBACK, label: 'Smart Feedback', icon: <BrainCircuit size={20} /> },
  ];

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    onClose(); // Close sidebar on mobile when item clicked
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800 flex flex-col 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-blue-400 font-mono tracking-tighter">
              DEV.TEACH<span className="text-slate-100">_</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Command Center v1.0</p>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.view}>
                <button
                  onClick={() => handleNavClick(item.view)}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors duration-200
                    ${currentView === item.view 
                      ? 'text-blue-400 bg-slate-800/50 border-r-2 border-blue-400' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800 mt-auto">
          <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              System Online
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              DB Sync Active
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;