"use client";

import { useState } from "react";
import { Page } from "@/types/page.type";
import { deletePage, updatePage } from "@/lib/page.api";
import { useWorkspace } from "@/context/WorkspaceContext";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash, FileText } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Spinner from "@/components/ui/Spinner";

export default function PagesList({
  pages,
  loading,
  refetchPages,
}: {
  pages: Page[];
  loading: boolean;
  refetchPages: () => void;
}) {
  const { activeWorkspace } = useWorkspace();
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [title, setTitle] = useState("");

  const handleRename = async (pageId: number) => {
    if (!activeWorkspace || !title.trim()) return;
    setProcessingId(pageId);
    try {
      await updatePage(activeWorkspace.id, pageId, {
        title: title.trim(),
        parentPageId: null
      });
      setEditingPageId(null);
      refetchPages();
    } catch {
      toast.error("Failed to rename page");
    } finally {
        setProcessingId(null);
    }
  };

  const handleDelete = async (pageId: number) => {
    if (!activeWorkspace) return;
    setProcessingId(pageId);
    try {
      await deletePage(activeWorkspace.id, pageId);
      toast.success("Page moved to trash");
      refetchPages();
    } catch {
      toast.error("Failed to delete page");
    } finally {
        setProcessingId(null);
    }
  };

  if (loading) return <div className="p-2 text-sm animate-pulse text-zinc-500">Loading pages...</div>;

  return (
    <div className="space-y-0.5">
      {pages.map((page) => {
        const isProcessing = processingId === page.id;
        const isMenuOpen = openMenuId === page.id;
        
        return (
          <div
            key={page.id}
            className={`group flex items-center justify-between px-2 py-1 rounded-md text-sm cursor-pointer transition-colors ${
              isMenuOpen 
                ? "bg-zinc-200 dark:bg-zinc-700" 
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center flex-1 truncate mr-2 gap-2">
              <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                {isProcessing ? (
                  <Spinner size={14} />
                ) : (
                  <FileText size={14} className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                )}
              </div>

              <div className="flex-1 truncate">
                {editingPageId === page.id ? (
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setEditingPageId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(page.id);
                      if (e.key === "Escape") setEditingPageId(null);
                    }}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-1 outline-none text-zinc-900 dark:text-zinc-100"
                  />
                ) : (
                  <span className={`transition-opacity ${isProcessing ? "opacity-50" : "text-zinc-700 dark:text-zinc-300"}`}>
                    {page.title || "Untitled"}
                  </span>
                )}
              </div>
            </div>

            {/* Actions Dropdown */}
            <DropdownMenu.Root 
              onOpenChange={(open) => setOpenMenuId(open ? page.id : null)}
            >
              <DropdownMenu.Trigger asChild>
                <button 
                  disabled={isProcessing}
                  className={`p-1 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded transition-opacity outline-none disabled:cursor-not-allowed ${
                    isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <MoreHorizontal size={14} className="text-zinc-500" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-md p-1 z-50 animate-in fade-in zoom-in-95"
                  side="right"
                  align="start"
                >
                  <DropdownMenu.Item
                    onSelect={() => {
                      setEditingPageId(page.id);
                      setTitle(page.title);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-700 dark:text-zinc-300"
                  >
                    <Pencil size={12} /> Rename
                  </DropdownMenu.Item>
                  
                  <DropdownMenu.Separator className="h-px bg-zinc-200 dark:border-zinc-800 my-1" />
                  
                  <DropdownMenu.Item
                    onSelect={() => handleDelete(page.id)}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs outline-none cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600"
                  >
                    <Trash size={12} /> Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        );
      })}
    </div>
  );
}