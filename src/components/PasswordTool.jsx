import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt'; // Real compliant browser security processor
import { Lock, FileUp, Loader2, AlertTriangle, Eye, EyeOff, ShieldCheck, CheckCircle2, Settings } from 'lucide-react';

export default function PasswordTool({ addLog }) {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Restriction States
  const [restrictPrinting, setRestrictPrinting] = useState(false);
  const [restrictCopying, setRestrictCopying] = useState(false);
  const [restrictEditing, setRestrictEditing] = useState(false);

  // UX Feedback States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setError('');
    setSuccess(false);
    const uploadedFile = acceptedFiles[0];
    
    if (!uploadedFile) return;
    if (uploadedFile.type !== 'application/pdf') {
      setError('Invalid file type. Please upload a valid PDF document.');
      return;
    }
    setFile(uploadedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleApplyProtection = async () => {
    if (!file) {
      setError('Please select or drop a PDF file first.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify entries.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Map document to a raw file byte stream array
      const fileBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(fileBuffer);

      // 2. Pass data into the compliant crypto handler with standard security flags
      const securedBytes = await encryptPDF(pdfBytes, password, {
        algorithm: 'AES-256', // Enterprise standard encryption mapping
        allowPrinting: !restrictPrinting,
        allowCopying: !restrictCopying,
        allowModifying: !restrictEditing,
        allowAnnotating: !restrictEditing
      });

      // 3. Download the correctly generated binary file container
      const blob = new Blob([securedBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `secured_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess(true);
      addLog(`Encrypted: ${file.name}`);
      
      // Clear inputs safely
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError('Cryptographic processing failed. Make sure the file isn\'t already corrupted or double-locked.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-white animate-in fade-in duration-300">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent flex items-center gap-3">
          <Lock className="w-8 h-8 text-teal-400" />
          PDF Password Protection
        </h2>
        <p className="text-slate-400 text-sm">
          Encrypt your files locally. Your files remain completely secure in client memory and never touch a cloud server.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          
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
              <p className="text-teal-400 font-medium text-sm max-w-xs truncate">{file.name}</p>
            ) : (
              <p className="text-xs text-slate-400">Drag & drop your target PDF file here or click to browse</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 relative">
              <label className="text-[11px] font-semibold uppercase text-slate-400">Enter Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-teal-500 text-white"
                  placeholder="Min 6 characters"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-[11px] font-semibold uppercase text-slate-400">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-teal-500 text-white"
                  placeholder="Repeat password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Password encryption applied successfully. Check downloads folder!</span>
            </div>
          )}

          <button
            onClick={handleApplyProtection}
            disabled={loading || !file}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300
              ${loading || !file 
                ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5' 
                : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/10 active:scale-[0.99]'}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>Encrypting Document...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Apply Password Protection</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Settings className="w-4 h-4 text-teal-400" /> Security Options
            </h3>
            <div className="h-[1px] bg-white/10 w-full" />
            
            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between p-2.5 bg-black/20 rounded-xl border border-white/5 cursor-pointer hover:bg-black/40 transition-colors">
                <span className="text-xs text-slate-300">Restrict Printing</span>
                <input 
                  type="checkbox" 
                  checked={restrictPrinting} 
                  onChange={(e) => setRestrictPrinting(e.target.checked)}
                  className="accent-teal-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-black/20 rounded-xl border border-white/5 cursor-pointer hover:bg-black/40 transition-colors">
                <span className="text-xs text-slate-300">Restrict Copying Text</span>
                <input 
                  type="checkbox" 
                  checked={restrictCopying} 
                  onChange={(e) => setRestrictCopying(e.target.checked)}
                  className="accent-teal-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-black/20 rounded-xl border border-white/5 cursor-pointer hover:bg-black/40 transition-colors">
                <span className="text-xs text-slate-300">Restrict Editing</span>
                <input 
                  type="checkbox" 
                  checked={restrictEditing} 
                  onChange={(e) => setRestrictEditing(e.target.checked)}
                  className="accent-teal-500 w-4 h-4"
                />
              </label>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-white/5 pt-3 leading-relaxed">
            Standard client-side cryptographic injection. Processed entirely inside your viewport.
          </div>
        </div>
      </div>
    </div>
  );
}