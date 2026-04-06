"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deletePost } from "@/actions/blogActions";

export default function DeletePostButton({ postId }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deletePost(postId);
        if (result?.success) {
          setOpen(false);
        } else if (result?.error) {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Delete Error:", error);
        alert("An unexpected error occurred while deleting the post.");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-white/10 bg-black/90 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold flex items-center gap-2">
            <Trash2 className="size-5 text-red-500" />
            Delete Post
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground pt-2">
            Are you sure you want to delete this post? This action cannot be undone and the post will be permanently removed from the records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-4">
          <AlertDialogCancel className="h-10 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            className="h-10 rounded-lg bg-red-500 text-white hover:bg-red-600 font-bold text-[10px] uppercase tracking-widest gap-2"
          >
            {isPending && <Loader2 className="size-3 animate-spin" />}
            Confirm Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
