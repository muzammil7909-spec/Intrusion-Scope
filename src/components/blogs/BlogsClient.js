"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, Zap, ArrowRight, Bug } from "lucide-react";
import SearchInput from "@/components/shared/SearchInput";
import Pagination from "@/components/shared/Pagination";
import CategoryTree from "@/components/blogs/CategoryTree";

export default function BlogsClient({ posts, pagination, categoriesRoot, category }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 pt-20 relative overflow-hidden">
      {/* Navigation - Minimal back control */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.04] bg-background/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-surface-low border border-white/[0.05] flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
              <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground transition-colors">BACK TO INTEL</span>
          </Link>
        </div>
      </nav>

      {/* Ambient Depth Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-[180px] -z-10 opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row gap-16 relative z-10">
        
        {/* Sidebar - The Glass Observatory */}
        <aside className="w-full md:w-[320px] flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-28 bg-surface-low/80 border border-white/[0.05] p-6 md:p-8 rounded-[2rem] backdrop-blur-3xl shadow-2xl hover:border-white/[0.1] transition-all duration-700"
          >
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/[0.03]">
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-white/[0.05] shadow-inner group">
                <BookOpen className="w-5 h-5 text-primary drop-shadow-[0_0_10px_rgba(234,255,184,0.4)]" />
              </div>
              <div>
                <h2 className="text-xl font-black font-display text-white tracking-tight">Archives</h2>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1 opacity-60">Classification</p>
              </div>
            </div>
            
            <CategoryTree categoriesRoot={categoriesRoot} />
          </motion.div>
        </aside>

        {/* Main Content - Editorial Layout */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-8 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 relative"
            >
              <h1 className="text-5xl md:text-6xl font-black font-display tracking-tighter text-white flex flex-wrap items-center gap-4">
                Feed
                {category && <span className="text-primary text-[10px] font-black tracking-[0.2em] uppercase bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 block truncate shadow-[0_0_20px_rgba(234,255,184,0.1)]" title={category}>{category.split("/").pop()}</span>}
              </h1>
              <p className="text-muted-foreground font-medium text-lg max-w-xl leading-relaxed opacity-80">
                Verified advisories, vulnerability disclosures, and architectural research.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full xl:w-96"
            >
              <SearchInput placeholder="Search intelligence logs..." />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {posts.map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx % 2 * 0.1 }}
              >
                <Link
                  href={`/blogs/${post.slug}`}
                  className="group relative h-full flex flex-col bg-surface-low/40 border border-white/[0.04] p-6 lg:p-8 rounded-[2rem] overflow-hidden hover:bg-surface-mid transition-all duration-700 backdrop-blur-xl shadow-lg hover:shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="space-y-6 relative z-10 flex-grow">
                    <div className="flex justify-between items-center">
                      <div className="px-4 py-2 rounded-xl bg-background/50 border border-white/[0.05] text-primary text-[9px] font-black tracking-[0.2em] uppercase truncate max-w-[200px]">
                        {post.cveId || "TECHNICAL-ADVISORY"}
                      </div>
                      <Zap className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all duration-300 drop-shadow-none group-hover:drop-shadow-[0_0_12px_rgba(234,255,184,0.6)]" strokeWidth={1.5} />
                    </div>

                    <h3 className="font-black font-display leading-[1.2] text-white text-xl lg:text-2xl group-hover:text-primary transition-colors duration-500 line-clamp-2">
                      {post.blogTitle}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed font-medium text-[13px] line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity">
                      {post.shortDescription}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/[0.04] flex items-center justify-between relative z-10">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 transition-colors group-hover:text-muted-foreground">
                      {post.product || "Global Sector"}
                    </span>
                    <div className="flex items-center text-sm font-black text-primary opacity-0 group-hover:opacity-100 -translate-x-6 group-hover:translate-x-0 transition-all duration-500">
                      View Detail <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {posts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-48 text-center border border-dashed border-white/[0.05] rounded-[3.5rem] bg-white/[0.01]"
              >
                <Bug className="w-24 h-24 text-muted-foreground mx-auto mb-8 opacity-20" />
                <p className="text-muted-foreground text-3xl font-black font-display uppercase tracking-[0.4em] opacity-40">No correlations found.</p>
              </motion.div>
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-16 bg-surface-low/30 rounded-3xl border border-white/[0.04] p-4 backdrop-blur-3xl shadow-xl">
              <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
