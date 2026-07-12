'use client'

import Link from 'next/link'
import { Home, RefreshCcw, Terminal, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-mono relative overflow-hidden">
      {/* HUD Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)]" />
      </div>

      <style jsx>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
        @keyframes glitch {
          0% { transform: translateX(0); color: #677db7; }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); color: #000; }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); color: #677db7; }
          100% { transform: translateX(0); }
        }
        .scanline {
          position: absolute;
          width: 100%;
          height: 2px;
          background: rgba(196, 73, 0, 0.1); /* Burnt Orange */
          animation: scan 4s linear infinite;
          z-index: 10;
        }
        .glitch-text {
          text-shadow: 2px 0 #183a37, -2px 0 #c44900; /* Dark Slate Grey and Burnt Orange */
        }
      `}</style>
      
      <div className="scanline" />

      {/* Main HUD Container */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">
        {/* Top Status Pill */}
        <div className="mb-8 px-4 py-1.5 bg-destructive/10 border border-destructive/20 rounded-full flex items-center gap-2 animate-pulse">
          <AlertTriangle size={12} className="text-destructive" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive">
            System Error: 404_NOT_FOUND
          </span>
        </div>

        {/* Error Code Hero */}
        <div className="relative mb-12">
          <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter opacity-10 blur-sm select-none">
            404
          </h1>
          <h1 className="absolute inset-0 flex items-center justify-center text-8xl md:text-9xl font-black italic tracking-tighter glitch-text">
            404
          </h1>
        </div>
        
        {/* Content Pill */}
        <div className="bg-background/40 backdrop-blur-xl border border-foreground/5 p-8 md:p-12 rounded-[2rem] shadow-2xl mb-10 w-full relative group">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-background border border-foreground/10 rounded-full">
            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Description</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-4 text-balance">
            Navigation Link <span className="text-accent italic">Severed</span>
          </h2>
          
          <p className="text-muted-foreground font-medium mb-0 text-sm md:text-base leading-relaxed max-w-md mx-auto">
            The requested resource has been relocated to a different sector or ceased to exist in the current codebase.
          </p>
        </div>

        {/* Action HUD */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 font-black uppercase brutal-border hover:-translate-y-0.5 transition-all"
          >
            <Home size={14} /> Return to Core
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 font-black uppercase brutal-border hover:-translate-y-0.5 transition-all"
          >
            <RefreshCcw size={16} />
          </button>

          <div className="h-12 px-6 flex items-center gap-3 bg-background/30 backdrop-blur-md border border-foreground/5 rounded-full">
            <Terminal size={12} className="text-accent" />
            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              Sector: Root
            </span>
          </div>
        </div>
      </div>
      
      {/* Bottom HUD Metadata */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
        <div className="flex items-center gap-6 opacity-30">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black uppercase tracking-widest">Protocol</span>
            <span className="text-[10px] font-bold">HTTPS/2.0</span>
          </div>
          <div className="h-8 w-px bg-foreground/20" />
          <div className="flex flex-col items-start">
            <span className="text-[8px] font-black uppercase tracking-widest">Environment</span>
            <span className="text-[10px] font-bold">PRODUCTION_v2.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
