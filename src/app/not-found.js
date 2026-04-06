import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export const metadata = {
  title: "404 — Signal Lost",
  description: "The requested resource could not be found on IntrusionScope.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px] -z-10" />

      <div className="text-center space-y-10 max-w-2xl">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-surface-low border border-white/[0.05] flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-primary opacity-60" />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
            HTTP 404 // SIGNAL LOST
          </p>
          <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter text-white">
            Target Not Found
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
            The intelligence resource you requested does not exist, may have been redacted, or is no longer available in our archive.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-14 px-8 rounded-2xl bg-primary hover:bg-[#d8f0a1] text-primary-foreground font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(234,255,184,0.15)]"
          >
            <Home className="w-4 h-4" />
            Return to Base
          </Link>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 h-14 px-8 rounded-2xl bg-surface-low border border-white/[0.05] text-foreground hover:border-primary/20 hover:text-primary font-black text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
