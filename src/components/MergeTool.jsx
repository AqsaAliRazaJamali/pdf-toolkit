import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { UploadCloud, FileText, ArrowUp, ArrowDown, Trash2, Combine, Layers, Sparkles } from 'lucide-react';

export default function MergeTool({ addLog }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: acceptedFiles => {
      setFiles([
        ...files, 
        ...acceptedFiles.map(file => Object.assign(file, { id: Math.random().toString() }))
      ]);
    }
  });

  const moveItem = (index, direction) => {
    const updatedFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    
    const [movedFile] = updatedFiles.splice(index, 1);
    updatedFiles.splice(targetIndex, 0, movedFile);
    setFiles(updatedFiles);
  };

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    setLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const fileBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `compiled_doc_${Date.now()}.pdf`;
      link.click();
      addLog(`Merged ${files.length} documents into a single master PDF.`);
    } catch (err) {
      alert('Error combining layouts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header section */}
      <div className="border-b pb-5">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-blue-600" size={24} /> 
          Smart PDF Binder
        </h2>
        <p className="text-sm text-slate-500 mt-1">Combine multiple vector files into a singular, cohesive document track instantly.</p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 bg-white ${
        isDragActive ? 'border-blue-500 bg-blue-50/40 scale-[0.99]' : 'border-slate-200 hover:border-blue-400 hover:shadow-sm'
      }`}>
        <input {...getInputProps()} />
        <div className="bg-blue-50 text-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <UploadCloud size={24} />
        </div>
        <h3 className="text-base font-semibold text-slate-800">Stash files for compilation</h3>
        <p className="text-sm text-slate-400 max-w-xs mx-auto mt-0.5">Drag and drop your PDFs here, or click to browse device storage.</p>
      </div>

      {/* Production List Workspace */}
      {files.length > 0 && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} /> Compilation Sequence ({files.length})
            </h3>
            {files.length < 2 && (
              <span className="text-xs text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                Add at least 2 files to bind
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {files.map((file, idx) => (
              <div 
                key={file.id} 
                className="flex items-center justify-between border border-slate-200 rounded-xl p-4 bg-white shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Sequence Position Tag */}
                  <span className="w-6 h-6 flex items-center justify-center bg-slate-100 text-slate-600 font-mono text-xs font-bold rounded-md border border-slate-200">
                    {idx + 1}
                  </span>
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-800 text-sm block truncate max-w-md sm:max-w-xl">
                      {file.name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium block mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>

                {/* Micro-Interaction Controls */}
                <div className="flex items-center gap-1.5 ml-4">
                  <button 
                    onClick={() => moveItem(idx, 'up')} 
                    disabled={idx === 0} 
                    className="p-1.5 hover:bg-slate-100 border border-slate-200/60 rounded-lg text-slate-500 disabled:opacity-30 transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button 
                    onClick={() => moveItem(idx, 'down')} 
                    disabled={idx === files.length - 1} 
                    className="p-1.5 hover:bg-slate-100 border border-slate-200/60 rounded-lg text-slate-500 disabled:opacity-30 transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown size={15} />
                  </button>
                  <div className="w-px h-6 bg-slate-200 mx-1"></div>
                  <button 
                    onClick={() => removeFile(file.id)} 
                    className="p-1.5 text-red-500 hover:bg-red-50 hover:border-red-200 border border-transparent rounded-lg transition-colors"
                    title="Remove File"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Trigger Block */}
          <div className="pt-2">
            <button 
              onClick={mergePDFs}
              disabled={loading || files.length < 2}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-blue-500/10 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Assembling Document Streams Client-Side...</span>
                </>
              ) : (
                <>
                  <Combine size={18} />
                  <span>Merge & Export Document Bundle</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}