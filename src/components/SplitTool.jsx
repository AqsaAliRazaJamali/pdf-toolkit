import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import PagePreview from './PagePreview'; // Imported safely here
import { UploadCloud, FileText, Scissors, Sparkles, Sliders, HelpCircle, FileCheck, RefreshCw } from 'lucide-react';

export default function SplitTool({ addLog }) {
  const [file, setFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]); // Array tracking visual checkbox indexes
  const [range, setRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [splitMode, setSplitMode] = useState('range'); // 'range' or 'burst'

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    onDrop: acceptedFiles => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        setFile(selectedFile);
        setSelectedPages([]); // Reset selection when a brand new file drops
      }
    }
  });

  // Bidirectional Synchronization: Translates thumbnail array selections into comma-separated text strings
  const handleSelectionChange = (newIndices) => {
    setSelectedPages(newIndices);
    
    if (newIndices.length > 0) {
      // Maps 0-indexed values back to standard 1-based page numbers
      const formattedRange = newIndices.map(idx => idx + 1).join(', ');
      setRange(formattedRange);
    } else {
      setRange('');
    }
  };

  const splitPDF = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const fileBytes = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(fileBytes);
      const totalPages = srcPdf.getPageCount();

      let targetIndices = [];

      if (splitMode === 'burst') {
        // Mode: Split every page into separate files
        for (let i = 0; i < totalPages; i++) {
          const splitPdf = await PDFDocument.create();
          const [copiedPage] = await splitPdf.copyPages(srcPdf, [i]);
          splitPdf.addPage(copiedPage);
          const splitBytes = await splitPdf.save();
          downloadBlob(splitBytes, `page_${i + 1}_of_${file.name}`);
        }
        addLog(`Burst split completed for ${file.name} (${totalPages} files generated).`);
      } else {
        // Mode: Custom Range
        if (!range) {
          alert('Please provide specific page ranges or select pages from the document map below.');
          setLoading(false);
          return;
        }

        const splitPdf = await PDFDocument.create();
        const parts = range.split(',').map(p => p.trim());
        
        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            for (let i = start; i <= end; i++) {
              if (i >= 1 && i <= totalPages) targetIndices.push(i - 1);
            }
          } else {
            const num = Number(part);
            if (num >= 1 && num <= totalPages) targetIndices.push(num - 1);
          }
        }

        // Deduplicate indices while retaining targeted order
        targetIndices = [...new Set(targetIndices)];

        if (targetIndices.length === 0) throw new Error("No valid targeted page parameters match this layout.");

        const copiedPages = await splitPdf.copyPages(srcPdf, targetIndices);
        copiedPages.forEach(p => splitPdf.addPage(p));
        
        const splitBytes = await splitPdf.save();
        downloadBlob(splitBytes, `extracted_${range.replace(/,/g, '_')}_${file.name}`);
        addLog(`Extracted pages [${range}] from ${file.name}`);
      }
    } catch(err) {
      alert("Slicing execution anomaly: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (bytes, filename) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    link.download = filename;
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header section */}
      <div className="border-b pb-5">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-amber-500" size={24} /> 
          Precision Page Splicer
        </h2>
        <p className="text-sm text-slate-500 mt-1">Detach target structural modules or burst complete layouts into separate dynamic assets.</p>
      </div>

      {/* Upload Drag & Drop View */}
      {!file ? (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all duration-200 bg-white ${
          isDragActive ? 'border-amber-500 bg-amber-50/40 scale-[0.99]' : 'border-slate-200 hover:border-amber-400 hover:shadow-sm'
        }`}>
          <input {...getInputProps()} />
          <div className="bg-amber-50 text-amber-500 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <UploadCloud size={24} />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Drop source target</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto mt-0.5">Drag & drop your map file here, or click to browse device storage paths.</p>
        </div>
      ) : (
        /* Splicing Configuration Suite */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in-50 duration-200">
          
          {/* Active File Banner */}
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-amber-50 text-amber-600 p-2 rounded-lg shrink-0">
                <FileCheck size={18} />
              </div>
              <span className="text-sm font-semibold text-slate-800 truncate max-w-md">{file.name}</span>
            </div>
            <button 
              onClick={() => { setFile(null); setRange(''); setSelectedPages([]); }}
              className="text-xs font-semibold text-slate-400 hover:text-amber-600 flex items-center gap-1 shrink-0 transition-colors"
            >
              <RefreshCw size={12} /> Swap File
            </button>
          </div>

          {/* ADDED INTERACTIVE VISUAL THUMBNAIL MAP COMPONENT HERE */}
          <div className="p-6 pb-0 border-b border-slate-100">
            <PagePreview 
              file={file} 
              selectedPages={selectedPages} 
              onSelectionChange={handleSelectionChange} 
              addLog={addLog} 
            />
          </div>

          <div className="p-6 space-y-6">
            {/* Mode Select Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Extraction Mode Selection</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setSplitMode('range')}
                  className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                    splitMode === 'range' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sliders size={16} /> Custom Range
                </button>
                <button 
                  onClick={() => setSplitMode('burst')}
                  className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                    splitMode === 'burst' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Scissors size={16} /> Burst Every Page
                </button>
              </div>
            </div>

            {/* Mode Specific Inputs */}
            {splitMode === 'range' ? (
              <div className="space-y-3 animate-in fade-in-30 duration-150">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Array Mapping</label>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-medium"><HelpCircle size={12}/> Comma-separated tracking parameters</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Ex: 1-3, 5, 8-10" 
                  value={range} 
                  onChange={e => setRange(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 placeholder-slate-400 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white shadow-sm"
                />
                
                {/* Visual Helpers Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="bg-slate-50/60 border rounded-lg p-2.5 text-xs text-slate-500">
                    <span className="font-bold text-slate-700 block mb-0.5">Example: 1-5</span>
                    Extracts pages 1 through 5 into a clean new document.
                  </div>
                  <div className="bg-slate-50/60 border rounded-lg p-2.5 text-xs text-slate-500">
                    <span className="font-bold text-slate-700 block mb-0.5">Example: 2, 4, 7</span>
                    Isolates exactly pages 2, 4, and 7 together.
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-4 text-sm text-slate-600 space-y-1 animate-in fade-in-30 duration-150">
                <p className="font-semibold text-amber-800">Automatic Document Deconstruction</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This configuration maps every vector page index into its own unique standalone asset tracker. Processing time tracks proportionally with total length sizes.
                </p>
              </div>
            )}

            {/* Run Button Engine */}
            <button 
              onClick={splitPDF} 
              disabled={loading || (splitMode === 'range' && !range)}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-orange-500/10 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Isolating Targeted Matrix Sets...</span>
                </>
              ) : (
                <>
                  <Scissors size={18} />
                  <span>Execute Extraction Map</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
