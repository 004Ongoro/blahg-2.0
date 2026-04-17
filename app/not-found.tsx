'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="brutal-border brutal-shadow bg-card p-12 max-w-2xl w-full"
      >
        <motion.h1 
          animate={{ 
            x: [0, -2, 2, -2, 2, 0],
            color: ['#fb923c', '#000000', '#fb923c']
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-8xl md:text-9xl font-black italic tracking-tighter mb-4"
        >
          404
        </motion.h1>
        
        <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">
          Whoops! You've wandered into the <span className="text-accent">void</span>.
        </h2>
        
        <p className="text-muted-foreground font-medium mb-8 text-lg">
          The page you are looking for has been moved, deleted, or never existed in this timeline.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 font-black uppercase brutal-border hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_var(--foreground)] transition-all"
          >
            <Home size={20} /> Back to Safety
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 font-black uppercase brutal-border hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_var(--foreground)] transition-all"
          >
            <AlertCircle size={20} /> Try Again
          </button>
        </div>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 font-mono text-sm text-muted-foreground"
      >
        ERR_PAGE_NOT_FOUND // George Ongoro Blog 2.0
      </motion.p>
    </div>
  )
}