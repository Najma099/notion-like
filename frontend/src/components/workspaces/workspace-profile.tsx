import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Plus, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import WorkspaceCreateModal from './workspaceCreateModal';


export default function WorkSpaceProfile() {
    const { 
        workspaces, 
        activeWorkspace, 
        isLoading, 
        setWorkspaces, 
        switchWorkspace 
    } = useWorkspace();

    const { user, loading } = useAuth();
    const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);

    if (loading) 
        return <div>Auth...</div>

    return (
        <div>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        disabled={isLoading}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-full disabled:opacity-50 outline-none"
                    >
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-xs font-semibold text-white dark:text-zinc-900">
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={14} />
                            ) : (
                                user?.name?.[0]?.toUpperCase() || 'U'
                            )}
                        </div>
                        
                        {/* Workspace Name */}
                        <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {isLoading ? 'Loading...' : (activeWorkspace?.name || 'Select Workspace')}
                            </div>
                        </div>

                        {/* Chevron */}
                        <ChevronDown 
                            size={16} 
                            className="text-zinc-500 dark:text-zinc-400 transition-transform"
                        />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="min-w-60 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in-0 zoom-in-95"
                        sideOffset={4}
                        align="start"
                    >
                        {/* User Email Section */}
                        <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                {user?.email || 'No email'}
                            </div>
                        </div>

                        {/* Workspaces List */}
                        <DropdownMenu.Group className="py-1">
                            {workspaces && workspaces.length > 0 ? (
                                workspaces.map((workspace) => (
                                    <DropdownMenu.Item
                                        key={workspace.id}
                                        onSelect={() => switchWorkspace(workspace)}
                                        className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        <div className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                            {workspace.name?.[0]?.toUpperCase()}
                                        </div>
                                        <span className="flex-1 text-sm text-zinc-900 dark:text-zinc-100">
                                            {workspace.name}
                                        </span>
                                        {activeWorkspace?.id === workspace.id && (
                                            <Check size={16} className="text-zinc-900 dark:text-zinc-100" />
                                        )}
                                    </DropdownMenu.Item>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                                    No workspaces available
                                </div>
                            )}
                        </DropdownMenu.Group>

                        {/* Separator */}
                        <DropdownMenu.Separator className="h-px bg-zinc-200 dark:bg-zinc-800" />

                        <DropdownMenu.Item
                            onSelect={() => setIsNewWorkspaceModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 outline-none cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm text-zinc-700 dark:text-zinc-300"
                        >
                            <Plus size={16} />
                            <span>New Workspace</span>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <WorkspaceCreateModal 
                isOpen={isNewWorkspaceModalOpen} 
                onClose={() => setIsNewWorkspaceModalOpen(false)} 
                setWorkspaces={setWorkspaces}
                switchWorkspace={switchWorkspace}
            />
        </div>
    );
}