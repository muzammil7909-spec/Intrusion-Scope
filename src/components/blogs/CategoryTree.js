"use client";

import { ChevronRight, ChevronDown, Check } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Recursive component for rendering the tree nodes
function CategoryNode({ node, selectedCategory }) {
  const hasChildren = Object.keys(node.children).length > 0;
  const isSelected = selectedCategory === node.path || selectedCategory?.startsWith(node.path + "/");
  const [isExpanded, setIsExpanded] = useState(isSelected);

  useEffect(() => {
    if (isSelected) {
      setIsExpanded(true);
    }
  }, [isSelected]);

  return (
    <div className="ml-2 mt-2">
      <div className="flex items-center group relative">
        {isSelected && (
          <div className="absolute inset-0 bg-primary/5 blur-md rounded-xl pointer-events-none"></div>
        )}
        {hasChildren ? (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-6 h-6 mr-1.5 flex flex-shrink-0 items-center justify-center text-muted-foreground/60 hover:text-primary transition-all duration-300 relative z-10 bg-white/[0.02] hover:bg-white/[0.05] rounded-full cursor-pointer hover:shadow-[0_0_8px_rgba(191,255,0,0.2)]"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <div className="w-6 h-6 mr-1.5 flex-shrink-0" />
        )}
        
        <Link 
          href={`/blogs?category=${encodeURIComponent(node.path)}`}
          className={`text-[13px] flex items-center justify-between w-full py-2 px-3 rounded-xl transition-all duration-500 relative z-10 ${
            selectedCategory === node.path 
              ? 'bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(191,255,0,0.1)] border border-primary/20 backdrop-blur-md' 
              : 'text-muted-foreground hover:text-white hover:bg-white/[0.04] border border-transparent'
          }`}
        >
          <span className="truncate pr-2">{node.name}</span>
          {selectedCategory === node.path && (
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(191,255,0,0.8)] animate-pulse"></div>
          )}
        </Link>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-3 pt-1.5 border-l border-white/[0.04] pl-1 relative">
          {Object.values(node.children)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((childNode) => (
            <CategoryNode 
              key={childNode.path} 
              node={childNode} 
              selectedCategory={selectedCategory} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryTree({ categoriesRoot }) {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const topLevelNodes = Object.values(categoriesRoot || {})
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        {selectedCategory && (
          <Link 
            href="/blogs" 
            className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground hover:text-primary transition-all duration-300 bg-white/5 hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(191,255,0,0.15)] px-3 py-1.5 rounded-lg border border-transparent hover:border-primary/20 w-fit ml-auto"
          >
            Clear Filter
          </Link>
        )}
      </div>

      <div className="-ml-2">
        {topLevelNodes.length === 0 ? (
          <p className="text-sm text-muted-foreground italic ml-2">No categories extracted.</p>
        ) : (
           topLevelNodes.map(node => (
             <CategoryNode 
               key={node.path}
               node={node}
               selectedCategory={selectedCategory}
             />
           ))
        )}
      </div>
    </div>
  );
}
