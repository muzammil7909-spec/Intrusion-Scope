export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32 animate-pulse">
      {/* Navigation skeleton */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.04] bg-background/60 h-20" />

      {/* Hero Header skeleton */}
      <header className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex gap-6">
            <div className="h-6 w-32 bg-white/5 rounded-lg" />
            <div className="h-6 w-24 bg-white/5 rounded-lg" />
          </div>
          <div className="h-16 w-3/4 bg-white/10 rounded-2xl" />
          <div className="h-8 w-2/3 bg-white/5 rounded-xl" />
        </div>
      </header>

      {/* Main Content skeleton */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-8">
          <div className="h-[400px] w-full bg-white/5 rounded-[2.5rem]" />
          <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded w-full" />
            <div className="h-4 bg-white/5 rounded w-full" />
            <div className="h-4 bg-white/5 rounded w-5/6" />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-8">
          <div className="h-64 bg-white/5 rounded-[2rem]" />
          <div className="h-32 bg-white/5 rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
}
