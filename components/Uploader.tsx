'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage, Trash2, ArrowRight, Loader2, Download, RefreshCcw, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

export default function Uploader() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfSizeKB, setPdfSizeKB] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages(prev => [...prev, ...newImages]);
  }, [images]);

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': []
    },
    maxFiles: 5
  });

  const handleGenerate = async () => {
    if (!images.length) return;

    setStatus('processing');
    setError(null);

    const formData = new FormData();
    images.forEach((img) => {
      formData.append('images', img.file);
    });

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const sizeKB = response.headers.get('X-File-Size-KB') || (blob.size / 1024).toFixed(2);
      
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfSizeKB(parseFloat(sizeKB.toString()));
      setStatus('done');

      // Programmatic download trigger
      const a = document.createElement('a');
      a.href = url;
      a.download = "nanopdf-compressed.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message);
      setStatus('idle');
    }
  };

  const reset = () => {
    setImages([]);
    setStatus('idle');
    setPdfUrl(null);
    setPdfSizeKB(0);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-12">
      {/* Branding for Content Area */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-900 mb-3">Generation Dashboard</h2>
        <p className="text-gray-500 font-medium">Follow the simple steps to create your compressed <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold italic">NanoPDF</span></p>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center mb-16 relative max-w-lg mx-auto">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2 rounded-full overflow-hidden">
           <motion.div 
            className="h-full bg-primary" 
            initial={{ width: '0%' }}
            animate={{ width: status === 'idle' ? '0%' : (status === 'processing' ? '50%' : '100%') }}
           />
        </div>
        <div className="flex flex-col items-center gap-2">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all border-4 shadow-sm", status === 'idle' ? 'bg-primary border-primary/20 text-white scale-110 shadow-lg' : 'bg-green-500 border-green-100 text-white')}>1</div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Upload</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all border-4 shadow-sm", status === 'processing' ? 'bg-primary border-primary/20 text-white scale-110 shadow-lg' : (status === 'done' ? 'bg-green-500 border-green-100 text-white' : 'bg-white border-gray-100 text-gray-400'))}>2</div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Process</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all border-4 shadow-sm", status === 'done' ? 'bg-primary border-primary/20 text-white scale-110 shadow-lg' : 'bg-white border-gray-100 text-gray-400')}>3</div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Download</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-10"
          >
            {/* Desktop Upload Zone */}
            <div 
              {...getRootProps()} 
              className={cn(
                "border-4 border-dashed rounded-[3rem] p-16 text-center cursor-pointer transition-all duration-500 group relative overflow-hidden",
                isDragActive ? "border-primary bg-primary/5 ring-8 ring-primary/5" : "border-slate-200 bg-white hover:border-primary/50"
              )}
            >
              <input { ...getInputProps() } />
              
              {/* Floating Animation Elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-20 h-20 bg-blue-400 rounded-full blur-3xl animate-pulse delay-1000" />
              </div>

              <div className="bg-gradient-to-br from-primary to-blue-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Upload className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3">Drop files here</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                Fast JPG to PDF conversion. <br/>
                <span className="text-primary font-bold">Files never leave your browser.</span>
              </p>
            </div>

            {/* Mobile Actions - Camera Capture */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <label 
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-primary px-8 py-5 rounded-3xl cursor-pointer transition-all hover:bg-slate-50 active:scale-95 group shadow-sm font-bold text-slate-700"
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  multiple 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files) onDrop(Array.from(e.target.files));
                  }}
                />
                <Smartphone className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                Capture from Camera
              </label>

              <div className="hidden sm:block text-slate-300 font-black">OR</div>

              <button 
                onClick={(e) => {
                    const input = document.querySelector('input[type="file"]:not([capture])') as HTMLInputElement;
                    input?.click();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-3xl transition-all hover:bg-slate-800 active:scale-95 shadow-xl font-bold"
              >
                <FileImage className="w-6 h-6" />
                Browse Device
              </button>
            </div>

            {/* Images Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                {images.map((img, idx) => (
                  <motion.div 
                    layoutId={img.id}
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white shadow-lg ring-1 ring-slate-100"
                  >
                    <img src={img.preview} alt="Document" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex justify-between items-center text-white">
                        <span className="text-xs font-black uppercase">Pg {idx + 1}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                          className="bg-red-500 rounded-lg p-2 hover:bg-red-600 shadow-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Action Button */}
            {images.length > 0 && (
              <div className="flex justify-center pt-6">
                <button 
                  onClick={handleGenerate}
                  className="bg-primary text-white text-xl py-6 px-16 rounded-[2rem] font-black shadow-[0_20px_50px_-15px_rgba(var(--primary-rgb),0.6)] flex items-center gap-4 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  Generate NanoPDF
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {status === 'processing' && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] shadow-2xl border border-slate-100"
          >
            <div className="relative mb-10">
              <div className="w-32 h-32 border-8 border-slate-50 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Loader2 className="w-12 h-12 text-primary animate-pulse" />
              </div>
            </div>
            <div className="text-center px-8">
              <h3 className="text-4xl font-black text-slate-900 mb-4">
                Shrinking Document...
              </h3>
              <div className="flex items-center justify-center gap-2 mb-6">
                  {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
              </div>
              <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mx-auto">
                Running adaptive multi-pass compression to stay below <span className="text-primary font-bold">200 KB</span> while maintaining text clarity.
              </p>
            </div>
          </motion.div>
        )}

        {status === 'done' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 text-center"
          >
            <div className="bg-white p-16 rounded-[4rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10">
                <div className={cn(
                  "px-6 py-3 rounded-full text-base font-black shadow-lg flex items-center gap-2",
                  pdfSizeKB < 200 ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                )}>
                  {pdfSizeKB.toFixed(1)} KB
                </div>
              </div>

              <div className="w-28 h-28 bg-green-50 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner ring-8 ring-green-50/50">
                <Download className="w-14 h-14" />
              </div>
              
              <h2 className="text-5xl font-black text-slate-900 mb-6">Shrink Complete!</h2>
              <p className="text-slate-500 mb-12 max-w-md mx-auto text-xl font-medium leading-relaxed">
                Your <span className="font-black text-slate-800">NanoPDF</span> is ready. Optimized for all government and corporate portals.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a 
                  href={pdfUrl!} 
                  download="nanopdf-compressed.pdf"
                  className="bg-primary hover:bg-primary/90 text-white font-black py-6 px-16 rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-2xl hoverShadow hover:scale-105 active:scale-95 text-lg"
                >
                  Download PDF
                  <Download className="w-6 h-6" />
                </a>
                <button 
                  onClick={reset}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-black py-6 px-12 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-95 text-lg"
                >
                  <RefreshCcw className="w-6 h-6" />
                  Reset
                </button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 border-t border-slate-50 pt-10">
                 <a 
                  href={pdfUrl!} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary font-black hover:underline flex items-center justify-center gap-2 text-lg"
                >
                  Preview Document
                  <FileImage className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mt-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <X className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
