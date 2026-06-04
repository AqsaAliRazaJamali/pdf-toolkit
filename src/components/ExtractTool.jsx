import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Copy, Download, Search, Sparkles, Check, FileCheck } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).href;

export default function ExtractTool({ addLog }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ chars: 0, words: 0, paragraphs: 0 });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    onDrop: async acceptedFiles => {
      const file = acceptedFiles[0];
      if (!file) return;
      
      setFileName(file.name);
      setFileSize((file.size / 1024 / 1024).toFixed(2));
      setLoading(true);
      setText('');
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let completeText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const tokenContent = await page.getTextContent();
          const pageText = tokenContent.items.map(item => item.str).join(' ');
          completeText += `[--- Page ${i} ---]\n${pageText}\n\n`;
        }

        setText(completeText);
        addLog(`Extracted text layers from ${file.name}`);
      } catch (err) {
        alert("Extraction error: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  });

  // Calculate deep stats whenever text changes
  useEffect(() => {
    if (!text) {
      setStats({ chars: 0, words: 0, paragraphs: 0 });
      return;
    }
    const chars = text.length;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const paragraphs = text.split('\n').filter(p => p.trim().length > 0).length;
    setStats({ chars, words, paragraphs });
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxtFile = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `extracted_${fileName.replace('.pdf', '')}.txt`;
    link.click();
  };

  // Helper to highlight searched terms inside the text view safely
  const renderHighlightedText = () => {
    if (!searchQuery) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="text-indigo-600" size={24} /> 
            AI-Ready Text Extractor
          </h2>
          <p className="text-sm text-slate-500 mt-1">Convert locked visual PDF structures into pure, indexable plaintext streams instantly.</p>
        </div>
      </div>

      {/* Drag & Drop Main State */}
      {!text && !loading && (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200 bg-white ${
          isDragActive ? 'border-indigo-500 bg-indigo-50/40 scale-[0.99]' : 'border-slate-200 hover:border-indigo-400 hover:shadow-sm'
        }`}>
          <input {...getInputProps()} />
          <div className="bg-indigo-50 text-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <UploadCloud size={28} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Upload your PDF</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">Drag and drop your file here, or click to browse your local device storage.</p>
          <span className="inline-block mt-4 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Local Engine Only</span>
        </div>
      )}

      {/* Modern Loading State */}
      {loading && (
        <div className="bg-white border rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="space-y-1">
            <h4 className="font-medium text-slate-800">Scraping Text Elements...</h4>
            <p className="text-sm text-slate-400 max-w-xs">Reading vector streams and compiling structural layout tags dynamically.</p>
          </div>
        </div>
      )}

      {/* The Fancy Workspace */}
      {text && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT COLUMN: Sidebar Tools & Stats */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                  <FileCheck size={18} />
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">{fileName}</h4>
                  <p className="text-xs text-slate-400">{fileSize} MB</p>
                </div>
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-400">Words</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{stats.words}</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-400">Characters</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{stats.chars}</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="text-xs text-slate-400">Lines</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{stats.paragraphs}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
              <button 
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 font-medium text-sm py-2.5 px-4 rounded-lg border transition-all ${
                  copied 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied to Clipboard' : 'Copy Full Content'}
              </button>

              <button 
                onClick={downloadTxtFile}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow-sm transition-colors"
              >
                <Download size={16} />
                Download Plaintext (.txt)
              </button>

              <button 
                onClick={() => { setText(''); setFileName(''); }}
                className="w-full text-center text-xs text-slate-400 hover:text-red-500 font-medium pt-2 transition-colors"
              >
                Clear Workspace & Load New PDF
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Text Viewer Container */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            
            {/* Live Search Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search extracted content..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Workspace Preview
              </div>
            </div>

            {/* Fancy Scrollable Content Box */}
            <div className="p-5 h-[500px] overflow-y-auto font-mono text-sm leading-relaxed text-slate-700 whitespace-pre-wrap select-text bg-slate-50/30">
              {renderHighlightedText()}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}