import React from 'react';
import { LayoutDashboard, Combine, Scissors, FileText, Sparkles, Shield } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'merge', label: 'Merge PDF', icon: Combine },
    { id: 'split', label: 'Split PDF', icon: Scissors },
    { id: 'extract', label: 'Extract Text', icon: FileText },
    
    // ✨ ADD THIS NAV NODE HERE:
    { id: 'compress', label: 'Compress PDF', icon: Sparkles },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-400 fixed h-full flex flex-col justify-between z-20">
      <div className="p-6 space-y-8">
        {/* Workspace Brand Title */}
        <div className="flex items-center gap-2.5 text-white">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-600/20">
            <Shield size={18} />
          </div>
          <span className="font-bold tracking-tight text-sm uppercase">PDF Studio</span>
        </div>

        {/* Navigation Map */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/10' 
                    : 'hover:bg-slate-800/60 hover:text-slate-200'}`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-800 text-[11px] text-slate-500 font-medium">
        v1.1.0 • Client Sandbox
      </div>
    </aside>
  );
}
