"use client";

import { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/hooks/useAuth';
import { 
  Loader2, 
  Plus, 
  ChevronDown, 
  Check, 
  Trash2, 
  Pencil,
  Building2,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorkspaceCreateModal from './workspaceCreateModal';

export default function WorkSpaceProfile() {
  const { 
    workspaces, 
    activeWorkspace, 
    isLoading,  
    switchWorkspace,
    removeWorkspace,
    renameWorkspace 
  } = useWorkspace();

  const { user, loading: authLoading } = useAuth();
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  if (authLoading) return (
    <div className="flex items-center gap-2 p-4 animate-pulse">
      <Loader2 className="animate-spin text-zinc-500" size={16} />
    </div>
  );

  // Changed 'Event' to 'any' or 'React.SyntheticEvent' to stop red squigglies in onSelect
  const handleDelete = async (e: any, id: number, name: string) => {
    // Note: onSelect in Radix can call preventDefault to keep menu open if desired
    if (!confirm(`Delete "${name}"?`)) return;

    setProcessingId(id);
    try {
      await removeWorkspace(id);
      toast.success("Workspace deleted");
    } catch {
      toast.error("Failed to delete workspace");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRename = async (e: any, id: number, currentName: string) => {
    const newName = prompt("Rename workspace:", currentName);
    if (!newName || newName === currentName) return;

    setProcessingId(id);
    try {
      await renameWorkspace(id, newName);
      toast.success("Workspace renamed");
    } catch {
      toast.error("Failed to rename");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full px-2 py-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between px-2 h-12 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:ring-0 group transition-colors"
            disabled={isLoading}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-white dark:text-zinc-900 shadow-sm transition-transform group-active:scale-95">
                {isLoading ? <Loader2 className="animate-spin" size={14} /> : (activeWorkspace?.name?.[0]?.toUpperCase() || <Building2 size={14}/>)}
              </div>
              <div className="flex flex-col items-start overflow-hidden text-left">
                <span className="text-sm font-semibold truncate w-32">
                  {activeWorkspace?.name || 'Select Workspace'}
                </span>
                <span className="text-[10px] text-zinc-500 truncate w-32">
                  {user?.name || 'Workspace'}
                </span>
              </div>
            </div>
            <ChevronDown size={14} className="text-zinc-500 group-hover:text-zinc-900 transition-colors" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 p-1.5 shadow-xl border-zinc-200 dark:border-zinc-800" align="start" sideOffset={8}>
          <div className="px-2 py-2 mb-1">
            <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Account</p>
            <p className="text-xs font-medium truncate text-zinc-700 dark:text-zinc-300">{user?.email}</p>
          </div>
          
          <DropdownMenuSeparator className="opacity-50" />

          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold py-2 px-2">
            Workspaces
          </DropdownMenuLabel>

          <ScrollArea className="h-fit max-h-72">
            <DropdownMenuGroup className="space-y-0.5">
              {workspaces.map((workspace) => {
                const isActive = activeWorkspace?.id === workspace.id;
                const isProcessing = processingId === workspace.id;

                return (
                  <div key={workspace.id} className="relative group/item">
                    <DropdownMenuItem
                      onSelect={() => !isProcessing && switchWorkspace(workspace)}
                      className={`flex items-center gap-2 p-2 cursor-pointer rounded-md transition-all ${
                        isActive 
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium" 
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${
                        isActive ? "bg-white dark:bg-zinc-700 border-zinc-300 text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 border-transparent"
                      }`}>
                        {isProcessing ? <Loader2 size={10} className="animate-spin" /> : workspace.name?.[0]?.toUpperCase()}
                      </div>
                      
                      <span className="flex-1 truncate text-sm">
                        {workspace.name}
                      </span>

                      {isActive && <Check size={14} className="text-zinc-900 dark:text-zinc-100" />}
                    </DropdownMenuItem>

                    {/* THREE DOTS MENU */}
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover/item:opacity-100 data-[state=open]:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-opacity"
                            // Use e.stopPropagation here to prevent switchWorkspace from firing
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal size={14} className="text-zinc-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 shadow-lg">
                          <DropdownMenuItem 
                            onSelect={(e) => handleRename(e, workspace.id, workspace.name)}
                            className="gap-2 text-xs"
                          >
                            <Pencil size={12} /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onSelect={(e) => handleDelete(e, workspace.id, workspace.name)}
                            className="gap-2 text-xs text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                          >
                            <Trash2 size={12} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </DropdownMenuGroup>
          </ScrollArea>

          <DropdownMenuSeparator className="my-1.5 opacity-50" />

          <DropdownMenuItem 
            onSelect={() => setIsNewWorkspaceModalOpen(true)}
            className="cursor-pointer gap-2 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 focus:bg-zinc-100 dark:focus:bg-zinc-800"
          >
            <Plus size={16} />
            <span className="text-xs font-medium">Add Workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <WorkspaceCreateModal 
        isOpen={isNewWorkspaceModalOpen} 
        onClose={() => setIsNewWorkspaceModalOpen(false)} 
      />
    </div>
  );
}