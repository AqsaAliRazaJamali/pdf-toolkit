import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, degrees } from 'pdf-lib';
import PagePreview from './PagePreview'; // Imported safely
import { UploadCloud, RefreshCw, RotateCw, FileCheck, Sparkles, HelpCircle } from 'lucide-react';

export default function RotationTool({ addLog }) {
  const [file, setFile] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]); // Tracks visual thumbnail selections
  const [pageRange, setPageRange] = useState('all');
  const [angle, setAngle] = useState(90);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    onDrop: acceptedFiles => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        setFile(selectedFile);
        setSelectedPages([]);
        setPageRange('all');
      }
    }
  });

  // Synchronize thumbnail clicks directly to the page target field
  const handleSelectionChange = (newIndices) => {
    setSelectedPages(newIndices);
    if (newIndices.length > 0) {
      const formattedRange = newIndices.map(idx => idx + 1).join(', ');
      setPageRange(formattedRange);
    } else {
      setPageRange('all');
    }
  };

  const rotatePDF = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const totalPages = pdfDoc.getPageCount();
      
      let targetIndices = [];

      if (pageRange.trim().toLowerCase() === 'all') {
        targetIndices = Array.from({ length: totalPages }, (_, i) => i);
      } else {
        const parts = pageRange.split(',').map(p => p.trim());
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
      }

      targetIndices = [...new Set(targetIndices)];

      if (targetIndices.length === 0) throw new Error("No valid pages matched your criteria.");

      // Apply incremental rotational orientation shifts directly into vector maps
      targetIndices.forEach(index => {
        const page = pdfDoc.getPage(index);
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + angle) % 360));
      });

      const rotatedBytes = await pdfDoc.save();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([rotatedBytes], { type: 'application/pdf' }));
      link.download = `rotated_${angle}deg_${file.name}`;
      link.click();

      addLog(`Rotated sheets [${pageRange}] by ${angle}° CW for ${file.name}`);
    } catch (err) {
      alert("Rotational calculation failure: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b pb-5">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-amber-500" size={24} /> 
          Precision Angle Rotator
        </h2>
        <p className="text-sm text-slate-500 mt-1">Adjust spatial layout coordinates of explicit sheets without degradation lines.</p>
      </div>

      {!file ? (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all duration-200 bg-white ${
          isDragActive ? 'border-amber-500 bg-amber-50/40 scale-[0.99]' : 'border-slate-200 hover:border-amber-400 hover:shadow-sm'
        }`}>
          <input {...getInputProps()} />
          <div className="bg-amber-50 text-amber-500 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <RotateCw size={24} />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Drop asset container</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto mt-0.5">Select or drop target document structures here.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in-50 duration-200">
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-amber-50 text-amber-600 p-2 rounded-lg shrink-0">
                <FileCheck size={18} />
              </div>
              <span className="text-sm font-semibold text-slate-800 truncate max-w-md">{file.name}</span>
            </div>
            <button 
              onClick={() => { setFile(null); setPageRange('all'); setSelectedPages([]); }}
              className="text-xs font-semibold text-slate-400 hover:text-amber-600 flex items-center gap-1 shrink-0 transition-colors"
            >
              <RefreshCw size={12} /> Swap File
            </button>
          </div>

          {/* EMBEDDED PREVIEW CONTAINER */}
          <div className="p-6 pb-0 border-b border-slate-100">
            <PagePreview 
              file={file} 
              selectedPages={selectedPages} 
              onSelectionChange={handleSelectionChange} 
              addLog={addLog} 
            />
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Target Selection Scope</label>
                <input 
                  type="text" 
                  value={pageRange} 
                  onChange={e => setPageRange(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white shadow-sm"
                  placeholder="Ex: 1, 3-5, or 'all'"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Rotational Delta Bound</label>
                <select 
                  value={angle} 
                  onChange={e => setAngle(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white shadow-sm cursor-pointer"
                >
                  <option value={90}>90° Clockwise</option>
                  <option value={180}>180° Flip</option>
                  <option value={270}>270° Counter-Clockwise</option>
                </select>
              </div>
            </div>

            <button 
              onClick={rotatePDF} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Re-mapping Vector Degrees...</span>
                </>
              ) : (
                <>
                  <RotateCw size={18} />
                  <span>Apply Transformation Matrix</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
