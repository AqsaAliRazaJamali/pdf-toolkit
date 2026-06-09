import React from 'react';
import { 
  Zap, 
  FolderSync, 
  Scissors, 
  FileText, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  Cpu,
  Lock as ProtectLockIcon // Safely aliased to prevent browser Lock() constructor collisions
} from 'lucide-react';

export default function Dashboard({ setCurrentView, logs }) {
  const tools = [
    {
      id: 'compress',
      title: 'Compress PDF',
      desc: 'Restructure file tokens and binary payloads in local RAM to reclaim storage space.',
      icon: Zap,
      color: 'from-emerald-500 to-teal-600',
      hover: 'hover:border-emerald-500/30 shadow-emerald-500/5'
    },
    {
      id: 'merge',
      title: 'Merge Documents',
      desc: 'Combine multiple PDF file streams into a single layout document with custom sorting.',
      icon: FolderSync,
      color: 'from-blue-500 to-indigo-600',
      hover: 'hover:border-blue-500/30 shadow-blue-500/5'
    },
    {
      id: 'split',
      title: 'Split & Extract',
      desc: 'Slice pages or explicit custom page ranges into fully independent standalone files.',
      icon: Scissors,
      color: 'from-rose-500 to-pink-600',
      hover: 'hover:border-rose-500/30 shadow-rose-500/5'
    },
    {
      id: 'extract',
      title: 'Extract Text',
      desc: 'Scrub text encoding layers directly out of structural layout streams into clear text files.',
      icon: FileText,
      color: 'from-purple-500 to-violet-600',
      hover: 'hover:border-purple-500/30 shadow-purple-500/5'
    },
    {
      id: 'rotate',
      title: 'Rotate Sheets',
      desc: 'Adjust spatial degrees orientation of specific page arrays while keeping vectors intact.',
      icon: RefreshCw,
      color: 'from-amber-500 to-orange-600',
      hover: 'hover:border-amber-500/30 shadow-amber-500/5'
    },
    {
      id: 'password',
      title: 'Protect PDF',
      desc: 'Inject security keys and restriction arrays locally into documents to lock editing or system access paths.',
      icon: ProtectLockIcon, // Using the safe aliased icon component here
      color: 'from-teal-500 to-emerald-600',
      hover: 'hover:border-teal-500/30 shadow-teal-500/5'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Workspace Dashboard
        </h2>
        <p className="text-slate-400 text-sm max-w-xl">
          Welcome to your local document matrix. Select an operation module below to modify binary file streams safely inside your web viewport.
        </p>
      </div>

      {/* CORE PERFORMANCE ANALYTICS SUMMARY BOXES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Privacy Status</p>
            <p className="text-sm font-bold text-slate-200">100% Air-Gapped Sandbox</p>
          </div>
        </div>
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Processing Engine</p>
            <p className="text-sm font-bold text-slate-200">Client-Side WebAssembly</p>
          </div>
        </div>
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Server Latency Rate</p>
            <p className="text-sm font-bold text-slate-200">0ms (Zero Data Transfer)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAIN UTILITY MATRIX SELECTION GRID */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setCurrentView(tool.id)}
                  className={`p-5 bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl text-left flex flex-col justify-between transition-all duration-300 group shadow-lg ${tool.hover} hover:scale-[1.01] hover:bg-white/[0.07]`}
                >
                  <div className="space-y-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-md shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200 text-base group-hover:text-white transition-colors">
                        {tool.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* DELTA ACTIVITY TIMELINE LOG TRACKER */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Telemetry Activity Feed</h3>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 shadow-2xl h-[334px] flex flex-col">
            <div className="overflow-y-auto space-y-3 flex-1 pr-1 font-mono text-[11px] scrollbar-thin">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className={`p-2.5 rounded-xl border transition-all duration-300 animate-in slide-in-from-top-2
                    ${log.type === 'system' 
                      ? 'bg-slate-900/40 border-white/5 text-slate-500' 
                      : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="leading-normal break-all">{log.text}</span>
                    <span className="text-[10px] text-slate-500 shrink-0 font-sans mt-0.5">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
