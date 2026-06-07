import React from 'react';
import { Combine, Scissors, FileText, Clock, Shield, Zap, HardDrive, ArrowUpRight, Sparkles } from 'lucide-react';

export default function Dashboard({ setCurrentView, activityLog }) {
  const tools = [
    { 
      id: 'merge', 
      name: 'Merge Documents', 
      desc: 'Combine multiple PDF files into a single, seamless document while preserving layout order.', 
      icon: Combine, 
      color: 'from-blue-500 to-indigo-600',
      badge: 'Popular'
    },
    { 
      id: 'split', 
      name: 'Split & Extract Pages', 
      desc: 'Sparsely detach page ranges or isolate single sheets into dedicated standalone files.', 
      icon: Scissors, 
      color: 'from-amber-500 to-orange-600',
      badge: 'Precise'
    },
    { 
      id: 'extract', 
      name: 'Text Extraction Studio', 
      desc: 'Instantly scrub hidden ASCII text layers out of structural elements into plaintext.', 
      icon: FileText, 
      color: 'from-emerald-500 to-teal-600',
      badge: 'AI-Ready'
    },
    {
      id: 'compress',
      name: 'PDF Compressor Studio',
      desc: 'Optimize structural layouts and minimize document sizes safely in local memory.',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-600',
      badge: 'New'
    }
  ];

  // Derive dynamic metrics from the session log to show live data
  const totalOperations = activityLog.length;

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      
      {/* Premium Hero Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-8 shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full backdrop-blur-md">
            <Zap size={12} className="animate-pulse text-indigo-400" /> Client-Side Engine Active
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Local Document Workspace
          </h1>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed">
            Run hyper-fast file transformations straight inside your browser compilation sandbox. Your uploads never touch a third-party server.
          </p>
        </div>
      </div>

      {/* Analytics Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Zap size={22} />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Session Speed</div>
            <div className="text-xl font-bold text-slate-800 mt-0.5">Instant (0ms server latency)</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Shield size={22} />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Privacy Rating</div>
            <div className="text-xl font-bold text-slate-800 mt-0.5">100% Air-Gapped / Secure</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <HardDrive size={22} />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Actions Completed</div>
            <div className="text-xl font-bold text-slate-800 mt-0.5">{totalOperations} Task{totalOperations !== 1 && 's'} logged</div>
          </div>
        </div>
      </div>

      {/* Interactive Feature Catalog */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Available Utility Suites</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div 
                key={tool.id} 
                onClick={() => setCurrentView(tool.id)}
                className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div className={`bg-gradient-to-br ${tool.color} text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/5 group-hover:scale-105 transition-transform duration-200`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200/60">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                    {tool.name} 
                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">{tool.desc}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-50 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  Launch Studio Engine &rarr;
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Session Log */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Clock size={18} className="text-slate-500" />
            <h2>Live Session Activity Feed</h2>
          </div>
          <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 border rounded-md">
            Resets on reload
          </span>
        </div>
        
        {activityLog.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm bg-slate-50/20">
            <p>No transactions registered in this context block yet.</p>
            <p className="text-xs text-slate-300 mt-1">Staged file workflows will build real-time activity nodes here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activityLog.map((log, index) => (
              <div key={index} className="px-6 py-3.5 flex justify-between items-center text-sm hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400"></span>
                  <span className="font-medium text-slate-700">{log.action}</span>
                </div>
                <span className="text-slate-400 font-mono text-xs bg-slate-50 px-2 py-1 rounded border border-slate-100">{log.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
