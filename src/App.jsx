import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MergeTool from './components/MergeTool';
import SplitTool from './components/SplitTool';
import ExtractTool from './components/ExtractTool';
import CompressionTool from './components/CompressionTool';
import RotationTool from './components/RotationTool';

export default function App() {
  // Navigation Router State: 'dashboard' | 'merge' | 'split' | 'extract' | 'compress' | 'rotate'
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Localized Session Activity Telemetry Log State
  const [logs, setLogs] = useState([
    { id: 1, text: 'Workspace security framework initialized locally', time: 'Just Now', type: 'system' }
  ]);

  // Unified callback injector to add real-time operational metrics across all 5 child tool modules
  const addLog = (text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prevLogs) => [
      {
        id: Date.now(),
        text,
        time: timestamp,
        type: 'action'
      },
      ...prevLogs
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden antialiased selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* BACKGROUND GRAPHIC MATRIX: Subtle ambient radial glow effects for maximum UI depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-emerald-500/10 to-transparent blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-amber-500/10 to-transparent blur-[120px]" />
      </div>

      {/* SIDEBAR NAVIGATION PANEL */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
      />

      {/* REVERSED MATRIX VIEW ROUTER SHELL */}
      <main className="flex-1 relative overflow-y-auto h-screen border-l border-white/5 bg-slate-950/40 backdrop-blur-3xl pb-12">
        <div className="w-full">
          {currentView === 'dashboard' && (
            <Dashboard 
              setCurrentView={setCurrentView} 
              logs={logs} 
            />
          )}
          
          {currentView === 'compress' && (
            <CompressionTool addLog={addLog} />
          )}
          
          {currentView === 'merge' && (
            <MergeTool addLog={addLog} />
          )}
          
          {currentView === 'split' && (
            <SplitTool addLog={addLog} />
          )}
          
          {currentView === 'extract' && (
            <ExtractTool addLog={addLog} />
          )}

          {currentView === 'rotate' && (
            <RotationTool addLog={addLog} />
          )}
        </div>
      </main>

    </div>
  );
}
