import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { Type, Image as ImageIcon, FileUp, Loader2, AlertTriangle, CheckCircle2, ShieldAlert, Settings, Palette, Layers } from 'lucide-react';

export default function WatermarkTool({ addLog }) {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState('text'); // 'text' | 'image'

  // Text Configuration States
  const [wmText, setWmText] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [rotation, setRotation] = useState(45);
  const [opacity, setOpacity] = useState(0.3);
  const [textColor, setTextColor] = useState('#ff0000');
  
  // Image Configuration States
  const [imageFile, setImageFile] = useState(null);
  const [imageScale, setImageScale] = useState(0.5);
  const [imageOpacity, setImageOpacity] = useState(0.3);
  const [imageRotation, setImageRotation] = useState(0);

  // Layout & Target States
  const [position, setPosition] = useState('center'); // 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'custom'
  const [customX, setCustomX] = useState(100);
  const [customY, setCustomY] = useState(100);
  const [pageTargetMode, setPageTargetMode] = useState('all'); // 'all' | 'custom'
  const [pageRangeInput, setPageRangeInput] = useState('all');

  // Operational System States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Preset Color Palettes
  const colorPresets = [
    { name: 'Red', hex: '#ff0000' },
    { name: 'Gray', hex: '#718096' },
    { name: 'Blue', hex: '#3182ce' },
    { name: 'Black', hex: '#000000' }
  ];

  const onDropPDF = useCallback(async (acceptedFiles) => {
    setError('');
    setSuccess(false);
    const uploadedFile = acceptedFiles[0];
    
    if (!uploadedFile) return;
    if (uploadedFile.type !== 'application/pdf') {
      setError('Invalid format. Please upload a valid PDF document.');
      return;
    }

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: false });
      setPageCount(pdfDoc.getPageCount());
      setFile(uploadedFile);
    } catch (err) {
      setError('Failed to read PDF structure. The file might be encrypted or corrupted.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropPDF,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleImageUpload = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      setError('Unsupported image format. Please use PNG or JPG files for watermarks.');
      return;
    }
    setImageFile(file);
  };

  // Safe Page Range Index Parser (Matches Split Engine Rules)
  const parsePageRanges = (input, maxPages) => {
    if (input.trim().toLowerCase() === 'all') {
      return Array.from({ length: maxPages }, (_, i) => i);
    }

    const pages = new Set();
    const parts = input.split(',');

    for (let part of parts) {
      part = part.trim();
      if (/^\d+$/.test(part)) {
        const p = parseInt(part, 10) - 1;
        if (p >= 0 && p < maxPages) pages.add(p);
      } else if (/^\d+-\d+$/.test(part)) {
        const [start, end] = part.split('-').map(num => parseInt(num, 10) - 1);
        if (start <= end && start >= 0 && end < maxPages) {
          for (let i = start; i <= end; i++) pages.add(i);
        }
      } else {
        throw new Error('Invalid page range format syntax.');
      }
    }
    
    if (pages.size === 0) throw new Error('Target range resolves to zero pages.');
    return Array.from(pages);
  };

  // Convert Hex values safely to fractional pdf-lib RGB mapping scales
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 1, g: 0, b: 0 };
  };

  const computeCoordinates = (pageWidth, pageHeight, contentWidth, contentHeight) => {
    switch (position) {
      case 'topLeft': return { x: 40, y: pageHeight - contentHeight - 40 };
      case 'topRight': return { x: pageWidth - contentWidth - 40, y: pageHeight - contentHeight - 40 };
      case 'bottomLeft': return { x: 40, y: 40 };
      case 'bottomRight': return { x: pageWidth - contentWidth - 40, y: 40 };
      case 'custom': return { x: customX, y: customY };
      case 'center':
      default:
        return { x: (pageWidth - contentWidth) / 2, y: (pageHeight - contentHeight) / 2 };
    }
  };

  const handleApplyWatermark = async () => {
    if (!file) {
      setError('Please select or drop a target PDF file first.');
      return;
    }
    if (mode === 'text' && !wmText.trim()) {
      setError('Watermark text configuration string cannot be empty.');
      return;
    }
    if (mode === 'image' && !imageFile) {
      setError('Please upload an image asset container to apply as a watermark.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const targetPageIndices = parsePageRanges(pageTargetMode === 'all' ? 'all' : pageRangeInput, pageCount);
      
      const pages = pdfDoc.getPages();
      let embeddedImage = null;

      if (mode === 'image') {
        const imgBuffer = await imageFile.arrayBuffer();
        embeddedImage = imageFile.type === 'image/png' 
          ? await pdfDoc.embedPng(imgBuffer)
          : await pdfDoc.embedJpg(imgBuffer);
      }

      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const index of targetPageIndices) {
        const page = pages[index];
        const { width, height } = page.getSize();

        if (mode === 'text') {
          const textWidth = helveticaFont.widthOfTextAtSize(wmText, fontSize);
          const textHeight = fontSize;
          const coords = computeCoordinates(width, height, textWidth, textHeight);
          const colorMap = hexToRgb(textColor);

          page.drawText(wmText, {
            x: coords.x,
            y: coords.y,
            size: fontSize,
            font: helveticaFont,
            color: rgb(colorMap.r, colorMap.g, colorMap.b),
            opacity: opacity,
            rotate: degrees(rotation),
          });
        } else if (mode === 'image' && embeddedImage) {
          const dims = embeddedImage.scale(imageScale);
          const coords = computeCoordinates(width, height, dims.width, dims.height);

          page.drawImage(embeddedImage, {
            x: coords.x,
            y: coords.y,
            width: dims.width,
            height: dims.height,
            opacity: imageOpacity,
            rotate: degrees(imageRotation),
          });
        }
      }

      const securedBytes = await pdfDoc.save();
      const blob = new Blob([securedBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `watermarked_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess(true);
      addLog(`Applied ${mode} watermark to pages: ${pageTargetMode === 'all' ? 'all' : pageRangeInput}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Watermarking system failed. Ensure target pages exist and inputs match valid constraints.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 text-white animate-in fade-in duration-300">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent flex items-center gap-3">
          <Layers className="w-8 h-8 text-teal-400" />
          PDF Watermark Studio
        </h2>
        <p className="text-slate-400 text-sm">
          Inject text or vector image overlays into documents safely inside browser RAM. Files never travel to external cloud servers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Interface Workspace Block */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          
          {/* Drag & Drop Core File Wrapper Layout */}
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-4 group
              ${isDragActive ? 'border-teal-500 bg-teal-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
          >
            <input {...getInputProps()} />
            <div className="p-3 bg-white/5 rounded-full border border-white/10 group-hover:scale-110 transition-transform duration-300">
              <FileUp className={`w-6 h-6 ${isDragActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-white'}`} />
            </div>
            {file ? (
              <div className="space-y-1">
                <p className="text-teal-400 font-medium text-sm max-w-sm truncate">{file.name}</p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Detected: {pageCount} Sheets</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Drag & drop your target PDF file sheet here or click to browse workspace</p>
            )}
          </div>

          {/* Core Configuration Processing Mode Selectors */}
          <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/5 gap-2">
            <button 
              onClick={() => setMode('text')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${mode === 'text' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Type className="w-4 h-4" /> Text Overlay Mode
            </button>
            <button 
              onClick={() => setMode('image')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${mode === 'image' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <ImageIcon className="w-4 h-4" /> Image Stamp Mode
            </button>
          </div>

          {/* Settings Section Group Map */}
          {mode === 'text' ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-slate-400">Watermark Text</label>
                <input 
                  type="text"
                  value={wmText}
                  onChange={(e) => setWmText(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                  placeholder="e.g. CONFIDENTIAL, DRAFT"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-slate-400">Font Size ({fontSize}px)</label>
                  <input type="range" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-teal-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-slate-400">Rotation Angular Axis ({rotation}°)</label>
                  <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-teal-500" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-slate-400">Upload Logo Asset (PNG/JPG)</label>
                <input 
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageUpload}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                />
                {imageFile && <p className="text-xs text-teal-400 font-medium pt-1">Active Stamp: {imageFile.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-slate-400">Scale Multiplication Matrix ({imageScale}x)</label>
                  <input type="range" min="0.1" max="2.0" step="0.1" value={imageScale} onChange={(e) => setImageScale(Number(e.target.value))} className="w-full accent-teal-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-slate-400">Rotation Axis Vector ({imageRotation}°)</label>
                  <input type="range" min="0" max="360" value={imageRotation} onChange={(e) => setImageRotation(Number(e.target.value))} className="w-full accent-teal-500" />
                </div>
              </div>
            </div>
          )}

          {/* Opacity Control Row Split */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase text-slate-400">Opacity Boundary Transparency ({Math.round((mode === 'text' ? opacity : imageOpacity) * 100)}%)</label>
            <input 
              type="range" min="0.05" max="1.0" step="0.05" 
              value={mode === 'text' ? opacity : imageOpacity} 
              onChange={(e) => mode === 'text' ? setOpacity(Number(e.target.value)) : setImageOpacity(Number(e.target.value))} 
              className="w-full accent-teal-500" 
            />
          </div>

          {/* Error and Alert Feedback Renderers */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Watermarked PDF container stream processed and downloaded locally successfully!</span>
            </div>
          )}

          <button
            onClick={handleApplyWatermark}
            disabled={loading || !file}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300
              ${loading || !file 
                ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5' 
                : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-lg active:scale-[0.99]'}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>Applying Layer Watermark Engine...</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" />
                <span>Inject Matrix Watermark</span>
              </>
            )}
          </button>
        </div>

        {/* Right Layout Workspace Sub-Control Sidebar Column */}
        <div className="space-y-6">
          
          {/* Section Block 1: Layout Positions */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Settings className="w-4 h-4 text-teal-400" /> Positional Alignment
            </h3>
            <div className="h-[1px] bg-white/10 w-full" />
            
            <div className="grid grid-cols-2 gap-2">
              {['center', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'custom'].map((loc) => (
                <button
                  key={loc} onClick={() => setPosition(loc)}
                  className={`py-2 px-3 rounded-xl border text-[11px] font-bold capitalize transition-all
                    ${position === loc ? 'border-teal-400 bg-teal-400/10 text-white' : 'border-white/5 bg-black/20 text-slate-400 hover:text-slate-200'}`}
                >
                  {loc.replace(/([A-Z])/g, ' $1')}
                </button>
              ))}
            </div>

            {position === 'custom' && (
              <div className="grid grid-cols-2 gap-2 pt-2 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">X Offset (pt)</label>
                  <input type="number" value={customX} onChange={(e) => setCustomX(Number(e.target.value))} className="w-full bg-black/40 border border-white/5 rounded-lg px-2 py-1 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">Y Offset (pt)</label>
                  <input type="number" value={customY} onChange={(e) => setCustomY(Number(e.target.value))} className="w-full bg-black/40 border border-white/5 rounded-lg px-2 py-1 text-xs" />
                </div>
              </div>
            )}
          </div>

          {/* Section Block 2: Page Target Boundaries Router */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" /> Page Range Scope
            </h3>
            <div className="h-[1px] bg-white/10 w-full" />

            <div className="flex gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
              <button 
                onClick={() => setPageTargetMode('all')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${pageTargetMode === 'all' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
              >
                All Sheets
              </button>
              <button 
                onClick={() => setPageTargetMode('custom')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${pageTargetMode === 'custom' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
              >
                Custom Range
              </button>
            </div>

            {pageTargetMode === 'custom' && (
              <div className="space-y-1 pt-1 animate-in slide-in-from-top-2 duration-200">
                <input 
                  type="text" value={pageRangeInput} onChange={(e) => setPageRangeInput(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  placeholder="e.g. 1, 3-5, 7"
                />
                <p className="text-[9px] text-slate-500 leading-relaxed">Use commas for individual items, hyphens for layout arrays (e.g. 1-3, 5).</p>
              </div>
            )}
          </div>

          {/* Section Block 3: Palette Presets (Only visible when text mode is configured) */}
          {mode === 'text' && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Palette className="w-4 h-4 text-teal-400" /> Color Matrix Map
              </h3>
              <div className="h-[1px] bg-white/10 w-full" />

              <div className="flex items-center justify-between bg-black/20 p-2 rounded-xl border border-white/5">
                <span className="text-xs text-slate-400 font-medium">Custom Color Picker</span>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-6 bg-transparent border-0 cursor-pointer rounded" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.hex} onClick={() => setTextColor(preset.hex)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-black/20 border border-white/5 hover:bg-black/40 text-left transition-colors"
                  >
                    <span className="w-3 h-3 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: preset.hex }} />
                    <span className="text-[11px] font-bold text-slate-300">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Infrastructure Air-Gap Security Guardrail Badge */}
          <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-teal-300">Client-Isolated Safe Zone</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Processing occurs inside browser instance virtual memory threads. Your assets are safe from cloud visibility data caching.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}