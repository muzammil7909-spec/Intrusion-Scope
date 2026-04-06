"use client";

import { togglePublishStatus } from "@/actions/blogActions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useTransition } from "react";
// import { toast } from "sonner"; // Sonner is not installed, disabling for now

export default function PublishToggle({ postId, isPublished }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await togglePublishStatus(postId);
      if (result.success) {
        // toast.success(result.published ? "Post published!" : "Post unpublished!");
      } else {
        // toast.error(result.error || "Failed to toggle status");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className={`h-8 px-3 rounded-lg font-bold text-[10px] flex items-center gap-2 transition-all ${
        isPublished 
        ? "text-primary hover:bg-primary/10" 
        : "text-muted-foreground hover:bg-white/5"
      }`}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isPublished ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5" />
      )}
      {isPublished ? "Published" : "Draft"}
    </Button>
  );
}
