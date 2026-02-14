"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createPage } from "@/lib/page.api";
import { usePage } from "@/hooks/usePage";
import { useWorkspace } from "@/context/WorkspaceContext";
import PagesList from "./PageList";
import { Spinner }from "@/components/ui/Spinner"; 
import { Plus } from "lucide-react";

export default function PagesSidebar() {
  const { activeWorkspace } = useWorkspace();
  const { pages, loading, refetchPages } = usePage();

  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    if (!activeWorkspace || !title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createPage(activeWorkspace.id, title.trim());

      toast.success("Page created");
      setTitle("");
      setIsCreating(false);
      await refetchPages(); 
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message || "Failed to create page"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Pages
        </div>

        <button
          disabled={isSubmitting || loading}
          onClick={() => setIsCreating(true)}
          className="p-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors disabled:opacity-50"
        >
          {isSubmitting || loading ? <Spinner /> : <Plus size={14} />}
        </button>
      </div>

      {isCreating && (
        <div className="flex items-center gap-2 px-2 py-1">
          {isSubmitting ? (
            <Spinner  />
          ) : (
            <div className="w-3.5 h-3.5 rounded-sm border border-zinc-300" />
          )}
          
          <input
            autoFocus
            disabled={isSubmitting}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              // Only close if we aren't currently in the middle of an API call
              if (!isSubmitting) setIsCreating(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
              if (e.key === "Escape") {
                setIsCreating(false);
              }
            }}
            placeholder="Page title..."
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-zinc-400 disabled:opacity-50"
          />
        </div>
      )}

      <PagesList pages={pages} loading={loading} refetchPages={refetchPages} />
    </div>
  );
}