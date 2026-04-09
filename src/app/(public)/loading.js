export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20 relative overflow-hidden animate-pulse">
      {/* Navigation skeleton */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.04] bg-background/60 backdrop-blur-2xl h-20" />

      {/* Hero Section skeleton */}
      <section className="relative pt-44 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-16 relative z-10">
          <div className="mx-auto h-8 w-64 bg-white/5 rounded-full border border-primary/20" />
          <div className="mx-auto h-24 md:h-40 w-full max-w-4xl bg-white/10 rounded-3xl" />
          <div className="mx-auto h-12 w-full max-w-2xl bg-white/5 rounded-xl" />
          <div className="mx-auto h-16 w-48 bg-primary/20 rounded-2xl" />
        </div>
      </section>

      {/* Feed Section skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="space-y-4">
            <div className="h-10 w-64 bg-white/10 rounded-xl" />
            <div className="h-6 w-80 bg-white/5 rounded-lg" />
          </div>
          <div className="h-12 w-full md:w-96 bg-white/5 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="md:col-span-2 lg:col-span-2 h-96 bg-white/5 border border-white/[0.03] rounded-[2rem]" />
          <div className="h-96 bg-white/5 border border-white/[0.03] rounded-[2rem]" />
          <div className="h-96 bg-white/5 border border-white/[0.03] rounded-[2rem]" />
          <div className="h-96 bg-white/5 border border-white/[0.03] rounded-[2rem]" />
          <div className="h-96 bg-white/5 border border-white/[0.03] rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
}
