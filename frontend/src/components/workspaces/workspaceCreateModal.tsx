import apiClient from "@/lib/apiClient";
import { Workspace } from "@/types/workspace.type";
import { AxiosError } from "axios";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function WorkspaceCreateModal({
    isOpen,
    onClose,
    setWorkspaces,
    switchWorkspace,
}: {
    isOpen: boolean;
    setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
    onClose: () => void;
    switchWorkspace: (workspace: Workspace) => void;
}) {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    if (!isOpen) return null;

    const createWorkspace = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = await apiClient.post<Workspace>('/workspaces', {
                name
            });
            toast.success('Workspace created successfully.');
            setWorkspaces(prev => [...prev, data]);
            switchWorkspace(data);
            onClose();
        } catch (err) {
            let errorMessage = "An Error Occurred while creating workspace.";

            if (err instanceof Error) {
                errorMessage = err.message
            }
            if (err instanceof AxiosError) {
                errorMessage = err.response?.data?.message || err.message;
            } 
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
            setName("");
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-2xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-all">
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center mb-8">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        Create Workspace
                    </h2>
                </div>

                <form
                    onSubmit={createWorkspace}
                    className="space-y-4"
                >
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 ml-0.5">
                            Workspace Name
                        </label>
                        <input
                            required
                            type="text"
                            name="workspaceName"
                            autoComplete="off"
                            placeholder="Name your workspace"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2.5 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all dark:text-zinc-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center rounded-md bg-zinc-900 dark:bg-zinc-100 py-2.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2 shadow-sm"
                    >
                        {isLoading ? (
                            <Loader2
                                className="animate-spin text-zinc-400"
                                size={18}
                            />
                        ) : 'Create Workspace'}
                    </button>
                </form>
            </div>
        </div>
    );
}