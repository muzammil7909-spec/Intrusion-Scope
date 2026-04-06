"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Pagination({ totalPages, currentPage }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function createPageURL(pageNumber) {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {currentPage <= 1 ? (
        <span
          className="inline-flex items-center justify-center h-12 w-12 rounded-2xl border-white/[0.05] bg-surface-low/50 opacity-20 cursor-not-allowed shadow-xl"
          aria-disabled="true"
        >
          <ChevronLeft className="w-5 h-5" />
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage - 1)}
          className="inline-flex items-center justify-center h-12 w-12 rounded-2xl border border-white/[0.05] bg-surface-low/50 hover:bg-surface-mid hover:border-primary/30 hover:text-primary transition-all font-black shadow-xl"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      )}

      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isCurrent = page === currentPage;
          
          return isCurrent ? (
            <span
              key={page}
              className="inline-flex items-center justify-center h-12 w-12 rounded-2xl font-black text-xs shadow-xl bg-primary text-primary-foreground shadow-[0_0_25px_rgba(234,255,184,0.3)]"
              aria-current="page"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={createPageURL(page)}
              className="inline-flex items-center justify-center h-12 w-12 rounded-2xl transition-all font-black text-xs shadow-xl border border-white/[0.05] bg-surface-low/50 hover:bg-surface-mid hover:border-primary/30 hover:text-primary"
            >
              {page}
            </Link>
          );
        })}
      </div>

      {currentPage >= totalPages ? (
        <span
          className="inline-flex items-center justify-center h-12 w-12 rounded-2xl border-white/[0.05] bg-surface-low/50 opacity-20 cursor-not-allowed shadow-xl"
          aria-disabled="true"
        >
          <ChevronRight className="w-5 h-5" />
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage + 1)}
          className="inline-flex items-center justify-center h-12 w-12 rounded-2xl border border-white/[0.05] bg-surface-low/50 hover:bg-surface-mid hover:border-primary/30 hover:text-primary transition-all font-black shadow-xl"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}
