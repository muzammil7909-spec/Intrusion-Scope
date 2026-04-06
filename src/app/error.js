"use client";

import { ShieldOff, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[200px] -z-10" />

      <div className="text-center space-y-10 max-w-2xl">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <ShieldOff className="w-12 h-12 text-red-500 opacity-60" />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/60">
            SYSTEM ERROR // BREACH DETECTED
          </p>
          <h2 className="text-5xl md:text-7xl font-black font-display tracking-tighter text-white">
            Something Broke
          </h2>
          <p className="text-lg text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
            An unexpected error occurred while processing your request. Our systems are working to restore normal operations.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 h-14 px-8 rounded-2xl bg-primary hover:bg-[#d8f0a1] text-primary-foreground font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(234,255,184,0.15)] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Operation
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-14 px-8 rounded-2xl bg-surface-low border border-white/[0.05] text-foreground hover:border-primary/20 hover:text-primary font-black text-sm transition-all"
          >
            <Home className="w-4 h-4" />
            Return to Base
          </Link>
        </div>
      </div>
    </div>
  );
}
