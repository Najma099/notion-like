"use client";

import { useParams } from "next/navigation";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useEffect } from "react";
import BlockEditor from "@/components/blocks/BlockEditor";

export default function PageBlock() {
  const params = useParams();
  const { activeWorkspace, workspaces, switchWorkspace } = useWorkspace();
  
  const pageId = Number(params.pageId);
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
        <p className="text-zinc-500">Loading workspace...</p>
      </div>
    );
  }

  return <BlockEditor pageId={pageId} />;
}