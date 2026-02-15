"use client";

import { useParams } from "next/navigation";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useEffect } from "react";

export default function WorkspacePage() {
  const params = useParams();
  const { activeWorkspace, workspaces, switchWorkspace } = useWorkspace();
  const workspaceId = params.workspaceId as string;

  useEffect(() => {
    const workspace = workspaces.find(w => w.id.toString() === workspaceId);
    if (workspace && activeWorkspace?.id !== workspace.id) {
      switchWorkspace(workspace);
    }
  }, [workspaceId, workspaces, activeWorkspace, switchWorkspace]);

  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Loading workspace...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Welcome to {activeWorkspace.name} workspace
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Start creating pages and organizing your content
        </p>
      </div>
    </div>
  );
}
