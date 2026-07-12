'use client'

import Link from 'next/link'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <style jsx>{`
        @keyframes spring-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes glitch {
          0% { transform: translateX(0); color: #677db7; }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); color: #000; }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); color: #677db7; }
          100% { transform: translateX(0); }
        }
        .animate-spring-in {
          animation: spring-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-glitch {
          animation: glitch 2s infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
      <div className="brutal-border brutal-shadow bg-card p-12 max-w-2xl w-full animate-spring-in">
        <h1 className="text-8xl md:text-9xl font-black italic tracking-tighter mb-4 animate-glitch">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">
          Whoops! You've wandered into the <span className="text-accent">void</span>.
        </h2>
        
        <p className="text-muted-foreground font-medium mb-8 text-lg">
          The page you are looking for has been moved, deleted, or never existed in this timeline.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 font-black uppercase brutal-border hover:-translate-y-0.5 transition-all"
          >
            <Home size={20} /> Back to Safety
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 font-black uppercase brutal-border hover:-translate-y-0.5 transition-all"
          >
            <AlertCircle size={20} /> Try Again
          </button>
        </div>
      </div>
      
      <p className="mt-8 font-mono text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '1s' }}>
        ERR_PAGE_NOT_FOUND // George Ongoro Blog 2.0
      </p>
    </div>
  )
}