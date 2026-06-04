import React from 'react';
import { LayoutDashboard, Combine, Scissors, FileText, ShieldCheck } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'merge', name: 'Merge PDFs', icon: Combine },
    { id: 'split', name: 'Split PDFs', icon: Scissors },
    { id: 'extract', name: 'Extract Text', icon: FileText },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center gap-2 px-2 py-4 mb-6 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-lg text-white font-bold text-xl">PDF</div>
          <span className="font-bold text-lg tracking-wide">Toolkit Pro</span>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg text-xs text-slate-400">
        <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
        <span>Privacy First: All processing happens locally in your browser.</span>
      </div>
    </div>
  );
}