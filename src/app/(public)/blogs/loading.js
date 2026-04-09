export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20 relative overflow-hidden animate-pulse">
      {/* Navigation skeleton */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.04] bg-background/60 backdrop-blur-2xl h-20" />

      {/* Hero Header skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-16 relative z-10">
        {/* Sidebar skeleton */}
        <aside className="w-full md:w-[320px] flex-shrink-0">
          <div className="h-[400px] bg-white/5 border border-white/[0.05] p-8 rounded-[2rem]" />
        </aside>

        {/* Main Feed skeleton */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-8 mb-12">
            <div className="space-y-4">
              <div className="h-12 w-48 bg-white/10 rounded-xl" />
              <div className="h-6 w-96 bg-white/5 rounded-lg" />
            </div>
            <div className="h-12 w-full xl:w-96 bg-white/5 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-white/5 border border-white/[0.04] p-8 rounded-[2rem]" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
