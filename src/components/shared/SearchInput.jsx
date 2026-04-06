"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTransition, useState, useEffect } from "react";

export default function SearchInput({ placeholder = "Search advisories..." }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(searchParams.get("search")?.toString() || "");

  // Sync state with URL params ONLY when URL changes externally (e.g. browser navigation)
  useEffect(() => {
    const urlTerm = searchParams.get("search")?.toString() || "";
    if (urlTerm !== term) {
      setTerm(urlTerm);
    }
  }, [searchParams]);

  // Debounced URL update
  useEffect(() => {
    // Only update URL if local state doesn't match current URL param
    if (term === (searchParams.get("search") || "")) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      if (term) {
        params.set("search", term);
      } else {
        params.delete("search");
      }

      startTransition(() => {
        replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [term, pathname, replace, searchParams]);

  function handleSearch(newTerm) {
    setTerm(newTerm);
  }

  return (
    <div className="relative group w-full max-w-sm">
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isPending ? 'text-primary' : 'text-muted-foreground group-focus-within:text-primary'}`} />
      <Input
        type="text"
        placeholder={placeholder}
        value={term}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-12 pl-12 pr-6 bg-surface-low/50 border-white/[0.05] rounded-2xl text-sm font-black focus:border-primary/40 focus:ring-1 focus:ring-primary/20 backdrop-blur-xl transition-all placeholder:text-muted-foreground/30"
      />
    </div>
  );
}
