import React from 'react';
import { 
  LayoutDashboard, 
  FolderSync, 
  Scissors, 
  FileText, 
  Zap, 
  RefreshCw,
  Layers,
  Lock as PasswordLockIcon 
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'compress', label: 'Compress PDF', icon: Zap },
    { id: 'merge', label: 'Merge PDFs', icon: FolderSync },
    { id: 'split', label: 'Split PDF', icon: Scissors },
    { id: 'extract', label: 'Extract Text', icon: FileText },
    { id: 'rotate', label: 'Rotate PDF', icon: RefreshCw },
    { id: 'password', label: 'Protect PDF', icon: PasswordLockIcon },
    { id: 'watermark', label: 'Watermark PDF', icon: Layers },
  ];

  return (
    <aside className="w-64 h-screen bg-slate-900/60 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between p-4 shrink-0 z-10">
      <div className="space-y-6">
        {/* BRANDING HEADER - Reverted to Toolkit Pro */}
        <div className="px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-emerald-500/20">
            PDF
          </div>
          <div>
            <h1 className="font-black text-sm tracking-wider uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Toolkit Pro
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Workspace</p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-gradient-to-r from-white/10 to-white/[0.02] border border-white/10 text-white shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}`}
              >
                <Icon className={`w-4 h-4 transition-colors duration-200
                  ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} 
                />
                <span>{item.label}</span>
                
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-glow" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* FOOTER USER CONTEXT MARGIN */}
      <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-slate-300">
          AJ
        </div>
        <div className="truncate">
          <p className="text-xs font-semibold text-slate-200 truncate">Aqsa Jamali</p>
          <p className="text-[10px] text-slate-500 font-mono">Local Sandbox</p>
        </div>
      </div>
    </aside>
  );
}
