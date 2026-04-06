"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Zap, ArrowRight, Activity, Bug } from "lucide-react";
import SearchInput from "@/components/shared/SearchInput";
import Pagination from "@/components/shared/Pagination";

// --- Sub-components for Cinematic Feel ---

const Particle = ({ p, scrollYProgress }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${p.speed * 100}%`]);
  return (
    <motion.div
      style={{ y, top: p.top, left: p.left, width: p.size, height: p.size }}
      className="absolute rounded-full bg-primary/20 blur-[1px]"
    />
  );
};

const ScrollParticles = () => {
  const { scrollYProgress } = useScroll();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate particles only on the client to avoid hydration mismatch
    const generated = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 0.5,
    }));
    setParticles(generated);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((p) => (
        <Particle key={p.id} p={p} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
};

export default function HomeClient({ posts, categories, pagination, category, search }) {
  const { scrollY } = useScroll();

  // Parallax effects for background blobs
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.4]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden relative">
      <ScrollParticles />
      {/* Navigation - Glassmorphism */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.04] bg-background/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 rounded-2xl bg-surface-low flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(234,255,184,0.1)]"
            >
              <Shield className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-xl font-black font-display tracking-tight text-white">IntrusionScope</span>
          </div>
        </div>
      </nav>

      {/* Hero Section - The Neon Observatory */}
      <section className="relative pt-44 pb-32">
        {/* Animated Background Blobs */}
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -z-10"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-40 -left-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"
        />

        <div className="max-w-7xl mx-auto px-6 text-center space-y-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-primary/20 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_25px_rgba(234,255,184,0.05)]"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Live Threat Monitoring Active
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-black font-display tracking-tighter max-w-6xl mx-auto"
          >
            <span className="bg-gradient-to-br from-primary via-primary/90 to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,255,184,0.2)]">
              Real-time intel
            </span>
            <br />
            <span className="text-white relative inline-block">
              for modern SecOps
              <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute -bottom-3 left-0 h-1 bg-primary/10 rounded-full blur-[1px]"
                />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium leading-relaxed"
          >
            Deep-dive technical analysis, CVE breakdowns, and rapid remediation strategies for critical vulnerabilities across the global supply chain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 pt-8"
          >
            <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-primary hover:bg-[#d8f0a1] text-primary-foreground font-black shadow-[0_0_40px_rgba(234,255,184,0.2)] transition-all hover:scale-[1.02] active:scale-[0.98] text-base group">
              <Link href="/blogs" className="flex items-center gap-2">
                Access Intelligence
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Intelligence Feed */}
      <section id="intel" className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="space-y-4">
            <h2 className="text-4xl font-black font-display tracking-tight text-white">Intelligence Feed</h2>
            <p className="text-muted-foreground font-medium text-lg">Verified advisories and zero-day disclosures.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <SearchInput placeholder="Search advisories..." />
            <div className="flex gap-3">
              <Link
                href="/blogs"
                className={`px-6 py-3 rounded-2xl border transition-all text-[11px] min-w-[12rem] text-center font-bold uppercase tracking-widest backdrop-blur-md ${!category ? 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_20px_rgba(234,255,184,0.1)]' : 'bg-white/5 border-white/[0.05] text-muted-foreground hover:border-primary/30'}`}
              >
                All Disclosures
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx % 3 * 0.1 }}
              className={idx === 0 && !search ? 'md:col-span-2 lg:col-span-2' : ''}
            >
              <Link
                href={`/blogs/${post.slug}`}
                className="group relative h-full flex flex-col bg-surface-low border border-white/[0.03] p-8 rounded-[2rem] overflow-hidden hover:bg-surface-mid transition-all duration-500 shadow-2xl hover:shadow-[0_0_50px_rgba(234,255,184,0.05)]"
              >
                {/* Edge Highlight (Gradient Stroke simulation) */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-6 relative z-10 flex-grow">
                  <div className="flex justify-between items-center">
                    <div className="px-4 py-2 rounded-xl bg-background border border-white/[0.05] text-primary text-[10px] font-black tracking-[0.2em] uppercase">
                      {post.cveId || "TECHNICAL-ADVISORY"}
                    </div>
                    <Zap className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all duration-300 drop-shadow-none group-hover:drop-shadow-[0_0_12px_rgba(234,255,184,0.6)]" />
                  </div>

                  <h3 className={`font-black font-display leading-[1.1] text-white group-hover:text-primary transition-colors duration-300 ${idx === 0 && !search ? 'text-3xl md:text-5xl max-w-2xl' : 'text-2xl'}`}>
                    {post.blogTitle}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed font-medium text-sm line-clamp-3">
                    {post.shortDescription}
                  </p>
                </div>

                <div className="pt-8 mt-8 border-t border-white/[0.03] flex items-center justify-between relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    {post.product || "Global Sector"}
                  </span>
                  <div className="flex items-center text-sm font-black text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    Read Intelligence <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {posts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]"
            >
              <Bug className="w-20 h-20 text-muted-foreground mx-auto mb-8 opacity-20" />
              <p className="text-muted-foreground text-2xl font-black font-display uppercase tracking-[0.3em] opacity-40">No matching correlating intel.</p>
            </motion.div>
          )}
        </div>

        <div className="mt-20">
          <Pagination totalPages={pagination.totalPages} currentPage={pagination.currentPage} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-24 bg-background/80 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-surface-low border border-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-black font-display text-white">IntrusionScope</span>
            </div>
            <p className="text-base text-muted-foreground max-w-sm leading-relaxed font-medium">
              Advancing global cybersecurity through meticulous technical research and real-time vulnerability intelligence.
            </p>
          </div>
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Sectors</h4>
            <ul className="grid grid-cols-1 gap-4 text-sm text-muted-foreground font-bold uppercase tracking-wider">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <Link href={`/?category=${encodeURIComponent(cat)}#intel`} className="hover:text-primary transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8 text-right flex flex-col justify-between">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-center ml-auto">
              <Zap className="w-6 h-6 text-primary opacity-40" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40">© 2026 IntrusionScope</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
