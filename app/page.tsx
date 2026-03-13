import Uploader from "@/components/Uploader";
import { Zap, Shield, Smartphone, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-[family-name:var(--font-geist-sans)] selection:bg-primary/20 selection:text-primary">
      {/* SaaS Header */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">Nano<span className="text-primary italic">PDF</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
             <a href="#" className="hover:text-primary">Features</a>
             <a href="#" className="hover:text-primary">Security</a>
             <a href="#" className="hover:text-primary">API</a>
          </div>
          <div className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-colors cursor-pointer">
             Try For Free
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 px-4 text-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />

        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-2 rounded-full mb-10 shadow-sm">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Bank-Grade Security • 100% Private</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-slate-900">
          Tiny Files.<br/>
          <span className="text-primary tracking-[-0.05em]">Massive Speed.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium mb-12 leading-relaxed">
          The world's smallest PDF generator. Convert photos into crisp, multi-page PDFs under <span className="text-slate-900 underline decoration-primary decoration-4 underline-offset-4">200 KB</span> instantly.
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl mx-auto opacity-70 mb-10">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 capitalize bg-white px-4 py-2 rounded-xl border border-slate-100"><Zap className="w-4 h-4" /> 1-Click JPG to PDF</div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 capitalize bg-white px-4 py-2 rounded-xl border border-slate-100"><Shield className="w-4 h-4" /> Multi-Page Support</div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 capitalize bg-white px-4 py-2 rounded-xl border border-slate-100"><Smartphone className="w-4 h-4" /> Mobile Camera Aware</div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 capitalize bg-white px-4 py-2 rounded-xl border border-slate-100"><Globe className="w-4 h-4" /> Auto-Compression</div>
        </div>
      </header>

      {/* App Interface Container */}
      <section className="pb-32 relative z-10 px-4">
        <div className="max-w-5xl mx-auto bg-white/50 backdrop-blur-3xl rounded-[4rem] border border-white p-2 shadow-2xl">
            <div className="bg-slate-50/50 rounded-[3.8rem] border border-slate-100/50">
               <Uploader />
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                    <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-slate-900">Nano<span className="text-primary italic">PDF</span></span>
                </div>
                <p className="text-slate-500 font-medium max-w-xs leading-relaxed">
                    Designed for automobile dealerships and professionals requiring lightweight document uploads without quality loss.
                </p>
            </div>
            <div>
                <h4 className="font-black text-slate-900 mb-6 font-mono uppercase text-xs tracking-widest">Product</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                    <li className="hover:text-primary transition-colors cursor-pointer">Security First</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Adaptive Compression</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Document Scanning</li>
                </ul>
            </div>
            <div>
                 <h4 className="font-black text-slate-900 mb-6 font-mono uppercase text-xs tracking-widest">Connect</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                    <li className="hover:text-primary transition-colors cursor-pointer">Twitter / X</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">GitHub</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Contact</li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-slate-50 flex justify-between items-center text-xs font-bold text-slate-300">
            <span>© 2026 NanoPDF Engine. All rights reserved.</span>
            <div className="flex gap-6">
                 <span>Privacy Policy</span>
                 <span>Terms of Service</span>
            </div>
        </div>
      </footer>
    </main>
  );
}
