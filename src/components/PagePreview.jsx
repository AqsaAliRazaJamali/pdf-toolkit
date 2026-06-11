import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ZoomIn, ZoomOut, Grid, Layers, Loader2, AlertTriangle, CheckSquare, Square } from 'lucide-react';

// Initialize pdfjs-dist worker thread globally using your vendor source path URL
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export default function PagePreview({ file, selectedPages = [], onSelectionChange, addLog }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pagesData, setPagesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [thumbSize, setThumbSize] = useState('md'); // 'sm' | 'md' | 'lg'
  
  const renderQueueRef = useRef(new Set());
  const fileIdRef = useRef('');

  const sizeDimensions = {
    sm: { width: 100, containerClass: 'w-[120px]' },
    md: { width: 160, containerClass: 'w-[180px]' },
    lg: { width: 220, containerClass: 'w-[240px]' }
  };

  // Safe client-side document bootstrapping thread
  useEffect(() => {
    if (!file) {
      setPdfDoc(null);
      setPagesData([]);
      return;
    }

    const initPdfRenderer = async () => {
      setLoading(true);
      setError('');
      setPagesData([]);
      renderQueueRef.current.clear();
      fileIdRef.current = `${file.name}-${file.size}-${file.lastModified}`;

      try {
        const fileBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        
        const count = doc.numPages;
        // Seed blank layout definitions for reactive skeletal lazy loading states
        const initialPages = Array.from({ length: count }, (_, i) => ({
          pageNumber: i + 1,
          dimensions: null,
          rotationState: 0,
          renderedUrl: null
        }));
        
        setPagesData(initialPages);
        if (addLog) addLog(`Generated workspace layout nodes for ${count} sheets`);
      } catch (err) {
        console.error(err);
        setError('Failed to extract document map layers. Target binary container might be locked or damaged.');
      } finally {
        setLoading(false);
      }
    };

    initPdfRenderer();
  }, [file]);

  // Background pipeline to lazily generate canvas raster buffers onto visible nodes
  const renderThumbnail = async (pageIndex) => {
    if (!pdfDoc || renderQueueRef.current.has(pageIndex) || pagesData[pageIndex]?.renderedUrl) return;
    
    renderQueueRef.current.add(pageIndex);
    const targetFileId = fileIdRef.current;

    try {
      const page = await pdfDoc.getPage(pageIndex + 1);
      const originalViewport = page.getViewport({ scale: 1.0 });
      
      const scaleMultiplier = sizeDimensions[thumbSize].width / originalViewport.width;
      const viewport = page.getViewport({ scale: scaleMultiplier });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      
      // Ensure the file hasn't changed while this background worker completed rendering
      if (fileIdRef.current !== targetFileId) return;

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      setPagesData(prev => {
        const next = [...prev];
        if (next[pageIndex]) {
          next[pageIndex] = {
            ...next[pageIndex],
            dimensions: `${Math.round(originalViewport.width)} × ${Math.round(originalViewport.height)} pt`,
            rotationState: page.rotate,
            renderedUrl: dataUrl
          };
        }
        return next;
      });
    } catch (err) {
      console.error(`Page thumbnail execution fault on block index ${pageIndex}:`, err);
    } finally {
      renderQueueRef.current.delete(pageIndex);
    }
  };

  // Multi-selection structural matrix mapper with accessibility focus logic
  const handleTogglePageSelection = (pageIndex) => {
    if (!onSelectionChange) return;

    let updatedSelection = [...selectedPages];
    if (updatedSelection.includes(pageIndex)) {
      updatedSelection = updatedSelection.filter(i => i !== pageIndex);
    } else {
      updatedSelection.push(pageIndex);
      updatedSelection.sort((a, b) => a - b);
    }
    
    onSelectionChange(updatedSelection);
  };

  const handleSelectAll = () => {
    if (!pdfDoc || !onSelectionChange) return;
    const allIndices = Array.from({ length: pdfDoc.numPages }, (_, i) => i);
    onSelectionChange(allIndices);
    if (addLog) addLog(`Selected global sequence layer arrays: 1 - ${pdfDoc.numPages}`);
  };

  const handleClearAll = () => {
    if (!onSelectionChange) return;
    onSelectionChange([]);
  };

  // Intersection observer hook to dynamically render thumbs when elements scroll into view
  const thumbNodeRef = (node, index) => {
    if (!node || pagesData[index]?.renderedUrl) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        renderThumbnail(index);
        observer.disconnect();
      }
    }, { rootMargin: '100px' });

    observer.observe(node);
  };

  if (!file) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-300">
      
      {/* Subheader Control Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-500/10 rounded-xl border border-teal-500/20 text-teal-400">
            <Grid className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Interactive Document Map</h3>
            <p className="text-[10px] text-slate-500 font-medium">Click containers to isolate targeted structure targets visually</p>
          </div>
        </div>

        {/* Global Select & Zoom Modifiers Layout Array */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 gap-1 text-[11px] font-bold">
            <button onClick={handleSelectAll} className="px-2.5 py-1 text-slate-400 hover:text-white transition-colors">All</button>
            <button onClick={handleClearAll} className="px-2.5 py-1 text-slate-400 hover:text-white transition-colors">Reset</button>
          </div>

          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 gap-1">
            <button 
              onClick={() => setThumbSize('sm')} 
              className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition-all ${thumbSize === 'sm' ? 'bg-white/10 text-white' : ''}`}
              title="Small Previews"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setThumbSize('md')} 
              className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition-all ${thumbSize === 'md' ? 'bg-white/10 text-white' : ''}`}
              title="Standard Previews"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setThumbSize('lg')} 
              className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition-all ${thumbSize === 'lg' ? 'bg-white/10 text-white' : ''}`}
              title="Large Previews"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Layout Frame Workspace Matrix */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
          <p className="text-xs text-slate-400 font-medium">Spawning background rendering buffers...</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="max-h-[380px] overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 scrollbar-thin">
          {pagesData.map((page, index) => {
            const isSelected = selectedPages.includes(index);
            return (
              <div
                key={index}
                ref={(node) => thumbNodeRef(node, index)}
                onClick={() => handleTogglePageSelection(index)}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleTogglePageSelection(index); } }}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                className={`group flex flex-col items-center justify-between bg-black/30 border rounded-xl p-2.5 cursor-pointer transition-all duration-200 outline-none focus:ring-2 focus:ring-teal-500/50 select-none
                  ${isSelected 
                    ? 'border-teal-500 bg-teal-500/5 shadow-lg shadow-teal-500/5' 
                    : 'border-white/5 hover:border-white/20 hover:bg-black/50'}`}
              >
                {/* Image Map Layer Slot View Container */}
                <div className={`w-full flex items-center justify-center bg-zinc-950/40 border border-white/5 rounded-lg overflow-hidden relative aspect-[3/4] group-hover:shadow-inner transition-shadow`}>
                  {page.renderedUrl ? (
                    <img 
                      src={page.renderedUrl} 
                      alt={`Page snapshot data frame ${page.pageNumber}`}
                      className="w-auto h-full object-contain pointer-events-none group-hover:scale-[1.02] transition-transform duration-300"
                      style={{ transform: page.rotationState ? `rotate(${page.rotationState}deg)` : undefined }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                    </div>
                  )}

                  {/* Absolute State Checkbox Flag Overlays */}
                  <div className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-md border border-white/10 backdrop-blur-md">
                    {isSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-teal-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                    )}
                  </div>
                </div>

                {/* Sub-label Matrix Metrics Strings */}
                <div className="w-full text-center mt-2 space-y-0.5">
                  <p className={`text-xs font-bold ${isSelected ? 'text-teal-400' : 'text-slate-400'}`}>
                    Sheet {page.pageNumber}
                  </p>
                  {page.dimensions && (
                    <p className="text-[9px] font-medium text-slate-600 font-mono tracking-tighter">
                      {page.dimensions}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}