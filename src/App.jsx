import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MergeTool from './components/MergeTool';
import SplitTool from './components/SplitTool';
import ExtractTool from './components/ExtractTool';
import CompressionTool from './components/CompressionTool';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activityLog, setActivityLog] = useState([]);

  const addLog = (action) => {
    const newLog = {
      action,
      timestamp: new Date().toLocaleTimeString(),
    };
    setActivityLog([newLog, ...activityLog]);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} activityLog={activityLog} />;
      case 'merge':
        return <MergeTool addLog={addLog} />;
      case 'split':
        return <SplitTool addLog={addLog} />;
      case 'extract':
        return <ExtractTool addLog={addLog} />;
      
      // ADD THESE TWO LINES HERE:
      case 'compress':
        return <CompressionTool addLog={addLog} />;
      
      default:
        return <Dashboard setCurrentView={setCurrentView} activityLog={activityLog} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="ml-64 p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
