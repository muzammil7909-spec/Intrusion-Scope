"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Shield, HelpCircle, Search, AlertTriangle, Globe, Activity, Zap, ExternalLink } from "lucide-react";

// Dynamically import the custom markdown renderer
const MarkdownRenderer = dynamic(() => import('./MarkdownRenderer'), {
  ssr: true,
  loading: () => <div className="space-y-4 animate-pulse py-10">
    <div className="h-4 bg-white/5 rounded w-3/4"></div>
    <div className="h-4 bg-white/5 rounded w-1/2"></div>
    <div className="h-4 bg-white/5 rounded w-5/6"></div>
  </div>
});


import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const MarkdownComponents = {
  // Force h1 in markdown content to h2 since page title is already the h1
  h1: ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-white mb-6 mt-8">
      {children}
    </h2>
  ),
  h2: ({ children }) => {
    const id = children?.toString().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'section';
    return (
      <h2 id={id} className="text-2xl md:text-3xl font-black font-display tracking-tight text-white mb-6 mt-16 border-b border-white/5 pb-6 flex items-center gap-4">
        <span className="w-8 h-1 bg-primary/40 rounded-full"></span>
        {children}
      </h2>
    );
  },
  h3: ({ children }) => (
    <h3 className="text-xl md:text-2xl font-black font-display tracking-tight text-white/90 mb-6 mt-12 flex items-center gap-3">
      <Zap className="size-5 text-primary/40" />
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-base md:text-lg leading-[1.7] text-muted-foreground/80 mb-8 font-medium tracking-tight">
      {children}
    </p>
  ),
  ul: ({ children }) => <ul className="mb-10 space-y-4 ml-6 list-none">{children}</ul>,
  li: ({ children }) => (
    <li className="text-base text-muted-foreground/80 flex items-start gap-4 leading-relaxed group/li">
      <div className="size-2 rounded-full bg-primary/30 mt-2.5 shrink-0 group-hover/li:bg-primary/60 transition-colors shadow-[0_0_15px_rgba(234,255,184,0.2)]" />
      <div className="flex-1">{children}</div>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-12 p-8 md:p-10 rounded-[2.5rem] bg-surface-low/30 border-l-4 border-primary/40 backdrop-blur-3xl italic text-xl md:text-2xl font-medium text-white/80 relative overflow-hidden group">
      <Shield className="absolute top-0 right-0 size-20 opacity-5 group-hover:opacity-10 transition-opacity p-6" />
      <div className="relative z-10 leading-relaxed">{children}</div>
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="my-10 p-8 rounded-[2rem] bg-[#020202] border border-white/[0.08] overflow-x-auto font-mono text-sm leading-relaxed text-white/90 relative group shadow-2xl">
      <div className="absolute top-4 right-8 text-[9px] font-black uppercase tracking-[0.3em] text-primary/30 flex items-center gap-2">
        <Activity className="size-3" />
        ENCRYPTED_STREAM
      </div>
      <div className="mt-4">{children}</div>
    </pre>
  ),
  a: ({ children, href }) => (
    <Link href={href} className="text-primary hover:text-white underline decoration-primary/30 underline-offset-4 decoration-2 font-black transition-all inline-flex items-center gap-1 group/link">
      {children}
      <ExternalLink className="size-3.5 opacity-40 group-hover/link:opacity-100 transition-opacity" />
    </Link>
  ),
  table: ({ children }) => (
    <div className="my-12 overflow-x-auto rounded-[2rem] border border-white/[0.05] bg-surface-low/30 backdrop-blur-3xl shadow-2xl">
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-white/[0.03] border-b border-white/[0.05]">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.3em] text-primary/80">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-6 py-4 text-[13px] font-bold text-muted-foreground/80 border-b border-white/[0.03] last:border-0 group-hover:text-white transition-colors">
      {children}
    </td>
  ),
  tr: ({ children }) => (
    <tr className="group hover:bg-white/[0.01] transition-colors">
      {children}
    </tr>
  ),
  img: ({ src, alt }) => (
    <div className="my-12 space-y-4">
      <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/[0.08] shadow-2xl bg-surface-low aspect-video">
        <div className="absolute top-6 left-8 z-10">
          <Badge variant="outline" className="bg-background/60 backdrop-blur-md border-white/10 text-[9px] font-black tracking-[0.1em] uppercase px-3 py-1 rounded-lg">
            SECURE_ASSET_VT
          </Badge>
        </div>
        <Image
          src={src}
          alt={alt || "IntrusionScope Intelligence Asset"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
      </div>
      {alt && (
        <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">
          FIGURE // {alt}
        </p>
      )}
    </div>
  ),
};

export default function PostClient({ post, relatedPosts = [] }) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 pb-32 relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[200px] -z-10 mix-blend-screen opacity-30" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.04] bg-background/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/blogs" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ x: -4 }}
              className="size-9 rounded-xl bg-surface-low border border-white/[0.05] flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all"
            >
              <ArrowLeft className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground transition-colors">BACK TO ARCHIVE</span>
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <motion.header
        style={{ opacity, scale }}
        className="pt-40 pb-20 relative px-6"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex items-center gap-6 flex-wrap">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge variant="outline" className="px-4 py-1.5 rounded-lg bg-primary/5 border-primary/20 text-primary text-[9px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(234,255,184,0.1)]">
                {post.cveId || "TECHNICAL ADVISORY"}
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-muted-foreground/60 text-[9px] font-black uppercase tracking-[0.2em]"
            >
              <Calendar className="size-3.5 text-primary/40" />
              {post.dateDisclosed ? new Date(post.dateDisclosed).toLocaleDateString() : 'ACTIVE SITUATIONAL'}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="px-4 py-1.5 rounded-lg bg-red-500/10 border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-[0.3em]">
                CVSS 9.3 • CRITICAL
              </Badge>
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black font-display tracking-tighter leading-[1] text-white"
          >
            {post.blogTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground/80 font-medium max-w-4xl leading-relaxed italic border-l-2 border-primary/20 pl-6"
          >
            {post.shortDescription}
          </motion.p>
        </div>
      </motion.header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 relative">
        {/* Post Content */}
        <motion.article
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-8 prose prose-invert prose-p:text-muted-foreground max-w-none"
        >
          <MarkdownRenderer
            content={post.data || "# ERROR: Intelligence Stream Corrupted"}
            components={MarkdownComponents}
          />

          {/* FAQ Section */}
          {post.faq && post.faq.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 md:mt-32 space-y-12"
            >
              <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight text-white flex items-center gap-4 border-b border-white/[0.05] pb-8">
                <HelpCircle className="size-8 text-primary" />
                FREQUENTLY ASKED
              </h2>
              <div className="grid gap-6">
                {post.faq.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 8 }}
                    className="p-8 rounded-[2rem] bg-surface-low/50 border border-white/[0.04] backdrop-blur-xl group hover:border-primary/20 transition-all duration-500"
                  >
                    <div className="flex gap-6 items-start">
                      <div className="size-10 rounded-xl bg-background border border-white/[0.05] flex items-center justify-center shrink-0">
                        <Search className="size-4 text-primary" />
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-lg font-black font-display text-white leading-tight">{item.question}</h4>
                        <p className="text-muted-foreground leading-relaxed text-base font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </motion.article>

        {/* Sidebar Metadata */}
        <aside className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-32">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-surface-low/50 backdrop-blur-3xl overflow-hidden rounded-[2rem] border-white/[0.05] shadow-2xl">
              <div className="bg-white/[0.02] p-6 border-b border-white/[0.05]">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/80 flex items-center gap-2.5">
                  <Shield className="size-3.5" />
                  THREAT SURVEY
                </h4>
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">VULNERABILITY TARGET</p>
                  <p className="text-base font-black text-white">{post.product || "SYSTEM GENERAL"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">VENDOR SOURCE</p>
                  <p className="text-base font-black text-white">{post.vendorProject || "COMMUNITY"}</p>
                </div>
                <div className="space-y-4 pt-6 border-t border-white/[0.05]">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">CLASSIFIERS</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(post.cwes) ? post.cwes.map((cwe, idx) => (
                      <Badge key={idx} variant="outline" className="text-[9px] px-3 py-1 bg-background border-white/[0.05] text-primary uppercase font-black tracking-tight rounded-lg">
                        {cwe}
                      </Badge>
                    )) : (
                      <Badge variant="outline" className="text-[9px] border-white/[0.05] text-primary rounded-lg">{post.cwes || "VULN"}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="p-8 rounded-[2rem] bg-red-500/5 border border-red-500/10 backdrop-blur-3xl space-y-6 shadow-2xl shadow-red-950/10 group"
          >
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="size-5 animate-pulse" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">REMEDIATION PULSE</h4>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-black text-white leading-tight uppercase">
                Critical patching mandated by {post.remediationDeadline ? new Date(post.remediationDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "IMMEDIATE EFFECT"}.
              </p>
              <div className="h-1.5 w-full bg-red-500/10 rounded-full overflow-hidden mt-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-red-500"
                />
              </div>
            </div>
            <p className="text-[9px] text-red-500/50 font-black uppercase tracking-[0.1em] text-center">
              EXPLOITATION STATUS: ACTIVE_WILDFIRE
            </p>
          </motion.div>
        </aside>
      </div>

      {/* Related Intelligence Section */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-32 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black font-display tracking-tight text-white flex items-center gap-4">
              <Activity className="size-8 text-primary" />
              RELATED INTELLIGENCE
            </h2>
            <Link href="/blogs" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-white transition-colors flex items-center gap-2 group">
              View All <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rPost, idx) => (
              <motion.div
                key={rPost._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={`/blogs/${rPost.slug}`}
                  className="group block p-8 rounded-[2rem] bg-surface-low border border-white/[0.03] hover:bg-surface-mid hover:border-primary/20 transition-all shadow-xl"
                >
                  <div className="space-y-4">
                    <Badge variant="outline" className="text-[8px] px-2 py-0.5 border-white/10 text-muted-foreground uppercase font-black tracking-widest">
                      {rPost.cveId || "ADVISORY"}
                    </Badge>
                    <h3 className="text-xl font-black font-display text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {rPost.blogTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground/60 line-clamp-2 leading-relaxed">
                      {rPost.shortDescription}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-6 mt-48 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-16 md:p-24 rounded-[3rem] bg-surface-low/30 border border-white/[0.05] backdrop-blur-3xl text-center space-y-8 relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
          <Globe className="size-16 text-primary mx-auto opacity-30 animate-spin-slow" />
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black font-display tracking-tighter text-white">Defend the Architecture.</h2>
            <p className="text-muted-foreground/60 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
              Real-time intelligence drops for the global software supply chain.
            </p>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
