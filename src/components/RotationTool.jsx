import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, degrees } from 'pdf-lib';
import { RefreshCw, FileUp, Loader2, Sparkles, AlertTriangle, FileCheck } from 'lucide-react';

export default function RotationTool({ addLog }) {
  const [file, setFile] = useState(null);
  const [pageRange, setPageRange] = useState('all');
  const [rotationAngle, setRotationAngle] = useState(90); // 90, 180, 270
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setError('');
    setSuccess(false);
    const uploadedFile = acceptedFiles[0];
    
    if (!uploadedFile) return;
    
    if (uploadedFile.type !== 'application/pdf') {
      setError('Invalid file type. Please upload a valid PDF document.');
      return;
    }
    
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: false });
      setTotalPages(pdfDoc.getPageCount());
      setFile(uploadedFile);
    } catch (err) {
      setError('Error reading PDF structure. The file might be encrypted or corrupted.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  // Helper logic to parse user input syntax (identical to Split tool parsing architecture)
  const parsePageRange = (input, maxPages) => {
    const pages = new Set();
    const cleanInput = input.replace(/\s+/g, '').toLowerCase();

    if (cleanInput === 'all') {
      for (let i = 1; i <= maxPages; i++) pages.add(i);
      return Array.from(pages);
    }

    const segments = cleanInput.split(',');
    for (const segment of segments) {
      if (segment.includes('-')) {
        const [startStr, endStr] = segment.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);

        if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
          throw new Error(`Invalid range syntax or out of boundaries: "${segment}"`);
        }
        for (let i = start; i <= end; i++) pages.add(i);
      } else {
        const pageNum = parseInt(segment, 10);
        if (isNaN(pageNum) || pageNum < 1 || pageNum > maxPages) {
          throw new Error(`Invalid page target descriptor: "${segment}"`);
        }
        pages.add(pageNum);
      }
    }

    if (pages.size === 0) throw new Error('Target selection array is completely empty.');
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleRotation = async () => {
    if (!file) {
      setError('Empty operation scope. Please drop a target PDF file first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // 1. Resolve selected pages array target criteria
      const targetPages = parsePageRange(pageRange, totalPages);
      
      // 2. Iterate through selection coordinates and modify spatial degrees values
      targetPages.forEach((pageIndex) => {
        const page = pdfDoc.getPage(pageIndex - 1);
        const currentRotation = page.getRotation().angle;
        
        // Accumulate rotation angles smoothly relative to current base spatial configuration
        const newAngle = (currentRotation + rotationAngle) % 360;
        page.setRotation(degrees(newAngle));
      });

      // 3. Serialize transformed document to local binary array buffer
      const modifiedBytes = await pdfDoc.save();
      
      // 4. Instantiate zero-latency local memory download link
      const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${file.name.replace('.pdf', '')}_rotated.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess(true);
      addLog(`Rotated pages [${pageRange}] by ${rotationAngle}° clockwise`);
    } catch (err) {
      setError(err.message || 'Execution fault inside local binary mutation pipeline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-white animate-in fade-in duration-300">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin-slow" />
          PDF Rotation Studio
        </h2>
        <p className="text-slate-400 text-sm">
          Manipulate spatial orientations of specific document frames. Vector coordinates and layouts remain fully preserved locally.
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-4 group
            ${isDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
        >
          <input {...getInputProps()} />
          <div className="p-4 bg-white/5 rounded-full border border-white/10 group-hover:scale-110 transition-transform duration-300">
            <FileUp className={`w-8 h-8 ${isDragActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'}`} />
          </div>
          {file ? (
            <div className="space-y-1">
              <p className="text-amber-400 font-medium max-w-md truncate">{file.name}</p>
              <p className="text-xs text-slate-400">Total Structural Map: {totalPages} Pages</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="font-medium text-slate-200">Drag & drop your target file here</p>
              <p className="text-xs text-slate-500">or click to browse local storage volumes</p>
            </div>
          )}
        </div>

        {file && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 border border-white/5 rounded-xl animate-in slide-in-from-bottom-2 duration-300">
            
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Target Page Sequence Criteria
              </label>
              <input 
                type="text" 
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="e.g. 1, 3-5, all"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 font-mono transition-colors"
              />
              <p className="text-[11px] text-slate-500">
                Accepts indices sequences separated by commas or dash increments. Use <span className="text-slate-400 font-mono">all</span> for entire file.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Angular Delta Step
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 90, label: '90° CW' },
                  { value: 180, label: '180°' },
                  { value: 270, label: '270° CW' }
                ].map((angle) => (
                  <button
                    key={angle.value}
                    onClick={() => setRotationAngle(angle.value)}
                    className={`py-2.5 px-3 rounded-xl border font-medium text-xs transition-all duration-200
                      ${rotationAngle === angle.value 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-inner' 
                        : 'bg-black/20 border-white/5 hover:border-white/10 text-slate-300'}`}
                  >
                    {angle.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-sm text-rose-300 animate-shake">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 text-sm text-emerald-300">
            <FileCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
            <span>Binary array mutated and downloaded successfully. Layout scales completely preserved.</span>
          </div>
        )}

        <button
          onClick={handleRotation}
          disabled={loading || !file}
          className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg
            ${loading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
              : !file 
                ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5' 
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-amber-500/10 active:scale-[0.99]'}`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
              <span>Rotating Vector Coordinates...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              <span>Rotate PDF Streams</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}